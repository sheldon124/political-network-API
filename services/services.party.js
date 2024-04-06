const executePgQuery = require("../helpers/dbConnection");

const getAllParties = async () => {
  const query = `SELECT * FROM party;`;
  try {
    const res = await executePgQuery(query);
    return {
      result: res.rows,
      status: 1,
    };
  } catch (error) {
    return {
      message: "error executing query",
      status: 0,
    };
  }
};

const getAlignedParties = async (interests) => {
  if (interests.length === 0)
    return {
      result: [],
      status: 1,
    };
  try {
    const query = `
            SELECT "name" as party, interest AS interests
            FROM party
            WHERE EXISTS (
                SELECT 1
                FROM jsonb_array_elements(interest) AS i
                WHERE ${interests.map((interest) => `i::text = '"${interest}"'`).join(" OR ")}
            );`;

    const res = await executePgQuery(query);

    const partyList = res.rows.map((item) => {
      const rowInterests = item.interests.filter((interest) =>
        interests.includes(interest)
      );
      let percentMatch = (
        (rowInterests.length / interests.length) *
        100
      ).toFixed(2);
      return { ...item, interests: rowInterests, percentMatch };
    });

    return {
      result: partyList,
      status: 1,
    };
  } catch (error) {
    return {
      message: "error executing query",
      status: 0,
    };
  }
};

const voteParty = async (personId, partyId) => {
  try {
    const voteExistsQuery = `SELECT id
        FROM party
        WHERE EXISTS (
            SELECT 1
            FROM jsonb_array_elements_text(party.vote) AS elem
            WHERE elem::int = ${personId}
        );`;
    const existsResult = await executePgQuery(voteExistsQuery);
    let voteQuery;
    if (existsResult.rows.length) {
      const currentVoteParty = existsResult.rows[0].id;
      voteQuery = `SELECT vote_for_party(${partyId}, ${currentVoteParty}, ${personId});`;
    } else {
      voteQuery = ` UPDATE "party"
      SET "vote" = "vote" || jsonb_build_array(${personId})
      WHERE id = ${partyId};`;
    }
    await executePgQuery(voteQuery);
    const retrieveQuery = `SELECT * FROM party ORDER BY "name";`;
    const partyData = await executePgQuery(retrieveQuery);

    return {
      result: "successfully voted",
      party: partyData.rows,
      status: 1,
    };
  } catch (error) {
    return {
      message: error.message,
      status: 0,
    };
  }
};

const unvoteParty = async (personId, partyId) => {
  try {
    const unovteQuery = `UPDATE "party"
SET "vote" = COALESCE(
    (
        SELECT jsonb_agg(elem)
        FROM (
            SELECT jsonb_array_elements("vote") AS elem
            FROM "party"
            WHERE id = ${partyId}
        ) AS subquery
        WHERE elem::int <> ${personId}
    ),
    '[]'
)
WHERE id = ${partyId};`;
    await executePgQuery(unovteQuery);
    const retrieveQuery = `SELECT * FROM party ORDER BY "name";`;
    const partyData = await executePgQuery(retrieveQuery);

    return {
      result: "successfully unvoted",
      party: partyData.rows,
      status: 1,
    };
  } catch (error) {
    return {
      message: error.message,
      status: 0,
    };
  }
};

module.exports = { getAlignedParties, voteParty, unvoteParty, getAllParties };

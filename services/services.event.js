const executePgQuery = require("../helpers/dbConnection");
const { format } = require("date-fns");

const columnMap = {
  eventStart: true,
  eventName: true,
  description: true,
  location: true,
  eventEnd: true,
  price: true,
  imageURL: true,
  capacity: true,
  organizerId: true,
  isIdentityMandatory: true,
};

const createEvent = async (body) => {
  try {
    let columns = "";
    let valueString = "";
    let values = [];

    Object.keys(body).forEach((key, ind) => {
      if (body[key] !== undefined && columnMap[key]) {
        columns += `"${key}", `;
        valueString += `$${ind + 1}, `;
        values.push(body[key]);
      }
    });

    columns = columns.slice(0, -2);
    valueString = valueString.slice(0, -2);

    const query = `INSERT INTO "event" (${columns}) VALUES (${valueString}) RETURNING id;`;

    const response = await executePgQuery(query, values);
    return {
      message: "added event successfully",
      id: response.rows[0].id,
      status: 1,
    };
  } catch (error) {
    return {
      message: error.message,
      status: 0,
    };
  }
};

const getFutureEvents = async () => {
  try {
    const formattedDate = format(new Date(), "yyyy-MM-dd HH:mm");
    const query = `SELECT *, jsonb_array_length("registeredIds") AS registered FROM "event" WHERE "eventStart" > '${formattedDate}';`;

    const response = await executePgQuery(query);
    return response.rows;
  } catch (error) {
    return {
      message: error.message,
      status: 0,
    };
  }
};

const register = async (eventId, personId) => {
  try {
    const registerQuery = `UPDATE "event"
    SET "registeredIds" = "registeredIds" || jsonb_build_array(${personId})
    WHERE id = ${eventId};`;
    await executePgQuery(registerQuery);
    return {
      message: "registered successfully",
      status: 1,
    };
  } catch (error) {
    return {
      message: error.message,
      status: 0,
    };
  }
};

const unRegister = async (eventId, personId) => {
  try {
    const query = `UPDATE "event"
  SET "registeredIds" = COALESCE(
      (
          SELECT jsonb_agg(elem)
          FROM (
              SELECT jsonb_array_elements("registeredIds") AS elem
              FROM "event"
              WHERE id = ${eventId}
          ) AS subquery
          WHERE elem::int <> ${personId}
      ),
      '[]'
  )
  WHERE id = ${eventId};`;
    await executePgQuery(query);
    return {
      message: "unregistered successfully",
      status: 1,
    };
  } catch (error) {
    return {
      message: error.message,
      status: 0,
    };
  }
};

module.exports = { createEvent, getFutureEvents, register, unRegister };

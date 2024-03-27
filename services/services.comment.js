const executePgQuery = require("../helpers/dbConnection");

const columnMap = {
  content: true,
  relation_type: true,
  relation_id: true,
  timestamp: true,
  user_id: true,
};

const createComment = async (body) => {
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

    const query = `INSERT INTO "comment" (${columns}) VALUES (${valueString}) RETURNING id;`;

    const response = await executePgQuery(query, values);
    return {
      message: "added comment successfully",
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

const getComments = async (projectId) => {
  try {
    const query = `SELECT * FROM "comment" WHERE relation_id = ${projectId};`;
    const response = await executePgQuery(query);
    return {
      comments: response.rows,
      status: 1,
    };
  } catch (error) {
    return {
      message: error.message,
      status: 0,
    };
  }
};

module.exports = {
  createComment,
  getComments,
};

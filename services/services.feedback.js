const executePgQuery = require("../helpers/dbConnection");

const columnMap = {
  description: true,
  userId: true,
  timestamp: true,
};

const createFeedback = async (body) => {
  try {
    let columns = "";
    let valueString = "";
    let values = [];

    let index = 1;

    Object.keys(body).forEach((key) => {
      if (body[key] !== undefined && columnMap[key]) {
        columns += `"${key}", `;
        valueString += `$${index++}, `;
        values.push(body[key]);
      }
    });

    columns = columns.slice(0, -2);
    valueString = valueString.slice(0, -2);

    const query = `INSERT INTO "feedback" (${columns}) VALUES (${valueString}) RETURNING *;`;

    const response = await executePgQuery(query, values);
    return {
      message: "added feedback successfully",
      feedback: response.rows[0],
      status: 1,
    };
  } catch (error) {
    return {
      message: error.message,
      status: 0,
    };
  }
};

const getFeedback = async () => {
  try {
    const query = `SELECT description, "userId", "timestamp", email, phone, "role", first_name, last_name FROM feedback, citizen WHERE feedback."userId" = citizen.citizen_id ORDER BY feedback."timestamp" DESC;`;
    const response = await executePgQuery(query);
    return {
      feedback: response.rows,
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
  createFeedback,
  getFeedback,
};

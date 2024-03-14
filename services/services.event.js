const executePgQuery = require("../helpers/dbConnection");

const columnMap = {
  eventDate: true,
  eventName: true,
  eventLocation: true,
};

const createEvent = async (body) => {
  try {
    let columns = "";
    let values = "";

    Object.keys(body).forEach((key) => {
      if (body[key] !== undefined && columnMap[key]) {
        columns += `"${key}", `;
        values += `'${typeof body[key] === "object" ? JSON.stringify(body[key]) : body[key]}', `;
      }
    });

    columns = columns.slice(0, -2);
    values = values.slice(0, -2);

    const query = `INSERT INTO "event" (${columns}) VALUES (${values}) RETURNING id;`;
    console.log(query);

    const response = await executePgQuery(query);
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
    const query = `SELECT * FROM "event" WHERE "eventDate" > NOW();`;

    const response = await executePgQuery(query);
    return response.rows;
  } catch (error) {
    return {
      message: error.message,
      status: 0,
    };
  }
};

module.exports = { createEvent, getFutureEvents };

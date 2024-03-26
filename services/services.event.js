const executePgQuery = require("../helpers/dbConnection");
const { format } = require("date-fns");

const columnMap = {
  eventStart: true,
  eventName: true,
  location: true,
  eventEnd: true,
  price: true,
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
    const query = `SELECT * FROM "event" WHERE "eventStart" > '${formattedDate}';`;

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

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
  organizer: true,
  isIdentityMandatory: true,
  createdBy: true,
};

/**
 * Namespace for Citizen related functions.
 * @namespace Event
 */


/**
 * Method to create an event 
 * @memberof Event
 * @param {Object} body contins eventName, eventStart, eventEnd, location, description, capacity, organizer, createdBy and price of the event
 * @returns {any}
 */
const createEvent = async (body) => {
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

/**
 * Method to get the list of all future events or a future event based on event id
 * @memberof Event
 * @param {Integer} eventId optional parameter containing the id of the event if a particular event needs to be retrieved
 * @returns {any}
 */
const getFutureEvents = async (eventId) => {
  try {
    const formattedDate = format(new Date(), "yyyy-MM-dd HH:mm");
    const query = !eventId
      ? `SELECT *, jsonb_array_length("registeredIds") AS registered FROM "event" WHERE "eventStart" > '${formattedDate}';`
      : `SELECT *, jsonb_array_length("registeredIds") AS registered FROM "event" WHERE "eventStart" > '${formattedDate}' AND id=${eventId};`;

    const response = await executePgQuery(query);
    return response.rows;
  } catch (error) {
    return {
      message: error.message,
      status: 0,
    };
  }
};

/**
 * Method to register for an event
 * @memberof Event
 * @param {Integer} eventId id of the event to register
 * @param {Integer} personId id of the person registering of the event
 * @returns {any}
 */
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

/**
 * Method to un-register for an event
 * @memberof Event
 * @param {any} eventId id of the event to un-register from
 * @param {any} personId id of the person registering of the event
 * @returns {any}
 */
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

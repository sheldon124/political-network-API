const executePgQuery = require("../helpers/dbConnection");

const columnMap = {
  firstName: "first_name",
  lastName: "last_name",
  dob: "dob",
  city: "city",
  passportNumber: "passport_number",
  contactNumber: "phone",
  email: "email",
  password: "password",
  role: "role",
};

/**
 * Namespace for Citizen related functions.
 * @namespace Citizen
 */

/**
 * Method to create a user in the citizen table
 * @memberof Citizen
 * @param {Object} body information of the citizen as a JSON object. It contains firstName, lastName, dob, city, passportNumber, contactNumber, email, password and role
 * @returns {Object} message whether user created if successful, or message containing reason why creation is not successful
 */
const registerCitizen = async (body) => {
  try {
    let columns = "";
    let values = "";

    const checkEmailQuery = `SELECT * FROM citizen WHERE email='${body.email}';`;

    const checkEmailResp = await executePgQuery(checkEmailQuery);
    if (checkEmailResp.rows?.length) {
      return {
        message: "user with email already exists",
        status: 0,
      };
    }

    const checkPassportQuery = `SELECT * FROM citizen WHERE passport_number='${body.passportNumber}';`;

    const checkPassportResp = await executePgQuery(checkPassportQuery);
    if (checkPassportResp.rows?.length) {
      return {
        message: "user with passport already exists",
        status: 2,
      };
    }

    Object.keys(body).forEach((key) => {
      if (body[key] !== undefined && columnMap[key]) {
        columns += `${columnMap[key]}, `;
        values += `'${typeof body[key] === "object" ? JSON.stringify(body[key]) : body[key]}', `;
      }
    });

    columns = columns.slice(0, -2);
    values = values.slice(0, -2);

    const query = `INSERT INTO citizen (${columns}) VALUES (${values}) RETURNING citizen_id;`;

    const response = await executePgQuery(query);
    console.log(response);
    return {
      message: "citizen added succesfully",
      id: response.rows[0].citizen_id,
      status: 1,
    };
  } catch (error) {
    return {
      message: error.message,
      status: 0,
    };
  }
};

module.exports = { registerCitizen };

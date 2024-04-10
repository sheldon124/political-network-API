const executePgQuery = require("../helpers/dbConnection");
const bcrypt = require('bcrypt');

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
 * - POST /citizen/
 * @memberof Citizen
 * @param {Object} body information of the citizen as a JSON object. It contains firstName, lastName, dob, city, passportNumber, contactNumber, email, password and role
 * @returns {Object} message whether user created if successful, or message containing reason why creation is not successful
 */
const registerCitizen = async (body) => {
  try {
    let columns = "";
    let values = "";

    // Hash passport number, email, and password
    const hashedPassportNumber = await bcrypt.hash(body.passportNumber, 10);
    const hashedEmail = await bcrypt.hash(body.email, 10);
    const hashedPassword = await bcrypt.hash(body.password, 10);

    // Fetch all hashed emails from the database
    const getEmailsQuery = `SELECT email FROM citizen;`;
    const getEmailsResp = await executePgQuery(getEmailsQuery);
    const hashedEmailsFromDatabase = getEmailsResp.rows.map(row => row.email);

    // Compare the hashed email from the input with each hashed email from the database
    for (const hashedEmailFromDatabase of hashedEmailsFromDatabase) {
      const emailExists = await bcrypt.compare(body.email, hashedEmailFromDatabase);
      if (emailExists) {
        return {
          message: "User with email already exists",
          status: 0,
        };
      }
    }

    // Fetch all hashed passport numbers from the database
    const getPassportNumbersQuery = `SELECT passport_number FROM citizen;`;
    const getPassportNumbersResp = await executePgQuery(getPassportNumbersQuery);
    const hashedPassportNumbersFromDatabase = getPassportNumbersResp.rows.map(row => row.passport_number);

    // Compare the hashed passport number from the input with each hashed passport number from the database
    for (const hashedPassportNumberFromDatabase of hashedPassportNumbersFromDatabase) {
      const passportNumberExists = await bcrypt.compare(body.passportNumber, hashedPassportNumberFromDatabase);
      if (passportNumberExists) {
        return {
          message: "User with passport number already exists.",
          status: 2,
        };
      }
    }

    Object.keys(body).forEach((key) => {
      if (body[key] !== undefined && columnMap[key]) {
        if (key === 'passportNumber') {
          columns += `${columnMap[key]}, `;
          values += `'${hashedPassportNumber}', `;
        } else if (key === 'email') {
          columns += `${columnMap[key]}, `;
          values += `'${hashedEmail}', `;
        } else if (key === 'password') {
          columns += `${columnMap[key]}, `;
          values += `'${hashedPassword}', `;
        } else {
          columns += `${columnMap[key]}, `;
          values += `'${typeof body[key] === "object" ? JSON.stringify(body[key]) : body[key]}', `;
        }
      }
    });

    columns = columns.slice(0, -2);
    values = values.slice(0, -2);

    const query = `INSERT INTO citizen (${columns}) VALUES (${values}) RETURNING citizen_id;`;

    const response = await executePgQuery(query);
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

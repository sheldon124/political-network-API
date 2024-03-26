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

const registerCitizen = async (body) => {
  try {
    let columns = "";
    let values = "";

    const checkEmailQuery = `SELECT * FROM citizen WHERE email='${body.email}';`;

    const checkEmailResp = await executePgQuery(checkEmailQuery);
    console.log(checkEmailResp);
    if (checkEmailResp.rows?.length) {
      return {
        message: "user with email already exists",
        status: 0,
      };
    }

    const checkPassportQuery = `SELECT * FROM citizen WHERE passport_number='${body.email}';`;

    const checkPassportResp = await executePgQuery(checkPassportQuery);
    console.log(checkPassportResp);
    if (checkEmailResp.rows?.length) {
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

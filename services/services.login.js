const executePgQuery = require("../helpers/dbConnection");
const bcrypt = require('bcrypt');

/**
 * Namespace for Login related functions.
 * @namespace Login
 */

/**
 * To check user credentials and login
 * - POST /log/login
 * @memberof Login
 * @param {Object} body contains username and password
 * @returns {Object} contains message whether login is successful or not along with the user id and role if successful
 */
const login = async (body) => {
  try {
    // Fetch all hashed emails from the database
    const getEmailsQuery = `SELECT email, password, citizen_id, role FROM citizen;`;
    const getEmailsResp = await executePgQuery(getEmailsQuery);
    const usersFromDatabase = getEmailsResp.rows;

    // Iterate through each user in the database
    for (const user of usersFromDatabase) {
      const emailMatches = await bcrypt.compare(body.email, user.email);

      if (emailMatches) {
        // If the email matches, compare the password
        const passwordMatches = await bcrypt.compare(body.password, user.password);

        if (passwordMatches) {
          // If both email and password match, login successful
          return {
            message: "Login Successful",
            userInfo: {
              id: user.citizen_id,
              role: user.role,
            },
            status: 1,
          };
        } else {
          return {
            message: "Incorrect Email or Password",
            status: 0,
          };
        }
      } 
    } 

    // If no matching email is found
    return {
      message: "Incorrect Email or Password",
      status: 0,
    };
  } catch (error) {
    return {
      message: error.message,
      status: 0,
    };
  }
};

/**
 * To logout from the application
 * - POST /log/logout/:person_id
 * @memberof Login
 * @param {Integer} id id of the user logging out
 * @returns {Object} contains message stating whether Login is successful or the error message if not
 */
const logout = async (id) => {
  try {
    const logoutQuery = `UPDATE "session" SET status = 0 WHERE citizen_id=${id} AND status = 1;`;
    await executePgQuery(logoutQuery);

    return {
      message: "Logout Successful",
      status: 1,
    };
  } catch (error) {
    return {
      message: error.message,
      status: 0,
    };
  }
};

module.exports = { login, logout };

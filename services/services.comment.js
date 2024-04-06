const executePgQuery = require("../helpers/dbConnection");

const columnMap = {
  content: true,
  relation_type: true,
  relation_id: true,
  timestamp: true,
  user_id: true,
};

/**
 * Namespace for Comment related functions.
 * @namespace Comment
 */

/**
 * Method to create a comment in the db
 * @memberof Comment
 * @param {Object} body contains the content, relation_id (project id or comment id), relation_type(project or comment), timestamp and user_id
 * @returns {Object} message whether creation is successful or not, and comment info if successful
 */
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

    const query = `INSERT INTO "comment" (${columns}) VALUES (${valueString}) RETURNING *;`;

    const response = await executePgQuery(query, values);
    return {
      message: "added comment successfully",
      id: response.rows[0],
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
 * Method to get list of comments of a project
 * @memberof Comment
 * @param {Integer} projectId id of the project of which to retrieve comments
 * @returns {Object} list of comments if successfull, error message if not
 */
const getComments = async (projectId) => {
  try {
    const query = `SELECT *, email, phone, "role", first_name, last_name FROM "comment", citizen WHERE relation_id = ${projectId} AND "comment".user_id = citizen.citizen_id;`;
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

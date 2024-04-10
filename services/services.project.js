const executePgQuery = require("../helpers/dbConnection");

const columnMap = {
  name: "name",
  department: "department",
  city: "city",
  duration: "duration",
  budget: "budget",
  projectStartDate: "start_dt",
  createdDate: "create_dt",
  description: "description",
  opinions: "opinions",
  status: "status",
  upVotes: "upvote",
  downVotes: "downvote",
};

const getColumnMap = {
  project_id: "projectId",
  start_dt: "projectStartDate",
  create_dt: "createdDate",
  upvote: "upVotes",
  downvote: "downVotes",
};

/**
 * Namespace for Project related functions.
 * @namespace Project
 */


/**
 * Method to create a project
 * - POST /project/
 * @memberof Project
 * @param {Object} body details of project including name, department, city, duration, budget, projectStartDate, description, createdDate, upVotes, downVotes
 * @returns {any}
 */
const createProject = async (body) => {
  try {
    let columns = "";
    let values = "";

    Object.keys(body).forEach((key) => {
      if (body[key] !== undefined && columnMap[key]) {
        columns += `${columnMap[key]}, `;
        values += `'${typeof body[key] === "object" ? JSON.stringify(body[key]) : body[key]}', `;
      }
    });

    columns = columns.slice(0, -2);
    values = values.slice(0, -2);

    const query = `INSERT INTO project (${columns}) VALUES (${values}) RETURNING project_id;`;

    const response = await executePgQuery(query);
    console.log(response);
    return {
      message: "project added succesfully",
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

/**
 * Method to get list of active projects or a single project based on id
 * - GET /project/active & GET /project/active/:project_id
 * @memberof Project
 * @param {Integer} id id of the project if a single project needs to be retrieved
 * @param {Object} filters filters containing department, to & from date if list needs to be filtered based on these parameters
 * @returns {Object} contains the list of projects
 */
const getActiveProjects = async (id, filters) => {
  try {
    const queryKeys = `project_id as "${getColumnMap.project_id}", "name", department, city, duration, budget, start_dt as "${getColumnMap.start_dt}", description, create_dt as "${getColumnMap.create_dt}", opinions, upvote as "${getColumnMap.upvote}", downvote as "${getColumnMap.downvote}", (SELECT count(*) FROM "comment" WHERE relation_id = project_id) as "totalComments"`;

    let query = id
      ? `SELECT ${queryKeys} FROM project WHERE project_id=${id};`
      : `SELECT ${queryKeys} FROM project WHERE status=1;`;

    if (filters)
      query = `SELECT ${queryKeys} from project where department='${filters.department}' AND create_dt BETWEEN '${filters.fromDate}' AND '${filters.toDate}';`;
    const resp = await executePgQuery(query);

    // sort in descending
    const listOfProjects = resp.rows.sort((a, b) => {
      return b.projectId - a.projectId;
    });

    return {
      projects: listOfProjects,
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
 * Method to remove a project
 * - PATCH /project/disable/:project_id
 * @memberof Project
 * @param {Integer} id of the project to remove
 * @returns {Object} message whether removal is successful or not
 */
const disableProject = async (id) => {
  try {
    const query = `UPDATE project SET status=0 WHERE project_id = ${id};`;

    await executePgQuery(query);
    return {
      message: "Successfully removed project",
      status: 1,
    };
  } catch (error) {
    return {
      message: error.message,
      status: 0,
    };
  }
};

const insertOpinion = async (id, opinion) => {
  try {
    const query = `UPDATE project SET opinions= opinions || '${JSON.stringify(opinion)}' WHERE project_id = ${id};`;

    await executePgQuery(query);
    return {
      projects: "Successfully added opinion",
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
 * To upvote a project
 * - PATCH /project/upvote
 * @memberof Project
 * @param {Integer} projectId id of the project to upvote
 * @param {Integer} userId id of the user upvoting the project
 * @returns {Object} contains the message whether successful or not
 */
const upvoteProject = async (projectId, userId) => {
  try {
    const query = `SELECT update_project_upvote(${projectId},${userId});`;
    await executePgQuery(query);
    const queryKeys = `project_id as "${getColumnMap.project_id}", "name", department, city, duration, budget, start_dt as "${getColumnMap.start_dt}", description, create_dt as "${getColumnMap.create_dt}", opinions, upvote as "${getColumnMap.upvote}", downvote as "${getColumnMap.downvote}"`;
    const projectQuery = `SELECT ${queryKeys} FROM project WHERE project_id=${projectId};`;
    const resp = await executePgQuery(projectQuery);

    return {
      message: "Successfully upvoted",
      project: resp.rows?.[0],
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
 * To downvote a project
 * - PATCH /project/downvote
 * @memberof Project
 * @param {Integer} projectId id of the project to downvote
 * @param {Integer} userId id of the user downvoting the project
 * @returns {Object} contains the message whether successful or not
 */
const downvoteProject = async (projectId, userId) => {
  try {
    const query = `SELECT update_project_downvote(${projectId},${userId});`;
    await executePgQuery(query);
    const queryKeys = `project_id as "${getColumnMap.project_id}", "name", department, city, duration, budget, start_dt as "${getColumnMap.start_dt}", description, create_dt as "${getColumnMap.create_dt}", opinions, upvote as "${getColumnMap.upvote}", downvote as "${getColumnMap.downvote}"`;
    const projectQuery = `SELECT ${queryKeys} FROM project WHERE project_id=${projectId};`;
    const resp = await executePgQuery(projectQuery);

    return {
      message: "Successfully downvoted",
      project: resp.rows?.[0],
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
  createProject,
  getActiveProjects,
  insertOpinion,
  disableProject,
  upvoteProject,
  downvoteProject,
};

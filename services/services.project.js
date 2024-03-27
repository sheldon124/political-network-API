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

const getActiveProjects = async (id, filters) => {
  try {
    const queryKeys = `project_id as "${getColumnMap.project_id}", "name", department, city, duration, budget, start_dt as "${getColumnMap.start_dt}", description, create_dt as "${getColumnMap.create_dt}", opinions, upvote as "${getColumnMap.upvote}", downvote as "${getColumnMap.downvote}"`;

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

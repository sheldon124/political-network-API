const executePgQuery = require('../helpers/dbConnection');

const columnMap = {
  name: 'name',
  department: 'department',
  city: 'city',
  duration: 'duration',
  budget: 'budget',
  projectStartDate: 'start_dt',
  description: 'description',
  opinions: 'opinions',
  status: 'status',
};

const createProject = async (body) => {
  try {
    let columns = '';
    let values = '';

    Object.keys(body).forEach((key) => {
      if (body[key] !== undefined && columnMap[key]) {
        columns += `${columnMap[key]}, `;
        values += `'${typeof body[key] === 'object' ? JSON.stringify(body[key]) : body[key]}', `;
      }
    });

    columns = columns.slice(0, -2);
    values = values.slice(0, -2);

    const query = `INSERT INTO project (${columns}) VALUES (${values}) RETURNING project_id;`;

    const response = await executePgQuery(query);
    console.log(response);
    return {
      message: 'project added succesfully',
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
    let query = id
      ? `SELECT * FROM project WHERE project_id=${id};`
      : `SELECT * FROM project WHERE status=1;`;

    if (filters)
      query = `SELECT * from project where department='${filters.department}' AND create_dt BETWEEN '${filters.fromDate}' AND '${filters.toDate}';`;
    console.log(query);

    console.log(query);
    const resp = await executePgQuery(query);
    return {
      projects: resp.rows,
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
      message: 'Successfully removed project',
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
      projects: 'Successfully added opinion',
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
};

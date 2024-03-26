const { Pool } = require('pg');

// const pool = new Pool({
//   user: 'sheldonkevin',
//   host: '127.0.0.1',
//   database: 'citizenportal',
//   password: '',
//   port: 5432,
// });

const executePgQuery = async (query, values) => {
  try {
    let res;
    if (!values) {
      res = await pool.query(query);
    } else {
      res = await pool.query(query, values);
    }
    console.log("query executed");
    return res;
  } catch (error) {
    console.error(error);
    throw new Error("Error executing Query");
  }
};

module.exports = executePgQuery;

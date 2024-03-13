const { Pool } = require('pg');

const pool = new Pool({
  user: 'sheldonkevin',
  host: '127.0.0.1',
  database: 'citizenportal',
  password: '',
  port: 5432,
});

const executePgQuery = async (query) => {
  try {
    const res = await pool.query(query);
    console.log('query executed');
    return res;
  } catch (error) {
    console.error(error);
    throw new Error('Error executing Query');
  }
};

module.exports = executePgQuery;

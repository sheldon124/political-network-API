const { Pool } = require('pg');

// const pool = new Pool({
//   user: 'sheldonkevin',
//   host: '127.0.0.1',
//   database: 'citizenportal',
//   password: '',
//   port: 5432,
// });

const pool = new Pool({
  user: 'ase_postgresql_db_user',
  host: 'cnu8u3sf7o1s7389g080-a.oregon-postgres.render.com',
  database: 'ase_postgresql_db',
  password: 'i9LaCUnEEJBM72OmSQekz8Tey8UM3xNv',
  port: 5432,
  ssl: true
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

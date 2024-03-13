const executePgQuery = require('../helpers/dbConnection');

const login = async (body) => {
  try {
    const query = `SELECT * FROM citizen WHERE email='${body.email}' AND PASSWORD='${body.password}';`;
    const loginResp = await executePgQuery(query);

    if (!loginResp.rows?.length)
      return {
        message: 'Incorrect Email or Password',
        status: 0,
      };

    const sessionQuery = `INSERT INTO "session" (citizen_id) VALUES (${loginResp.rows[0].citizen_id});`;

    await executePgQuery(sessionQuery);

    return {
      message: 'Login Successful',
      userInfo: {
        id: loginResp.rows[0].citizen_id,
        role: loginResp.rows[0].role,
      },
      status: 1,
    };
  } catch (error) {
    return {
      message: error.message,
      status: 0,
    };
  }
};

const logout = async (id) => {
  try {
    const logoutQuery = `UPDATE "session" SET status = 0 WHERE citizen_id=${id} AND status = 1;`;
    await executePgQuery(logoutQuery);

    return {
      message: 'Logout Successful',
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

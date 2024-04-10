const executePgQuery = require("../helpers/dbConnection");

const columnMap = {
  question: true,
  description: true,
  answers: true,
  multiple_correct_answers: true,
  correct_answers: true,
  correct_answer: true,
  explanation: true,
  tip: true,
  tags: true,
  category: true,
  difficulty: true,
};

const createQuestion = async (body) => {
  try {
    let columns = "";
    let values = "";

    Object.keys(body).forEach((key) => {
      if (body[key] !== undefined && columnMap[key]) {
        columns += `${key}, `;
        values += `'${typeof body[key] === "object" ? JSON.stringify(body[key]) : body[key]}', `;
      }
    });

    columns = columns.slice(0, -2);
    values = values.slice(0, -2);

    const query = `INSERT INTO quiz (${columns}) VALUES (${values}) RETURNING id;`;


    const response = await executePgQuery(query);
    return {
      message: "quiz question added succesfully",
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

const getQuestions = async (limit, difficulty) => {
  try {
    const difficultySelect = difficulty
      ? `WHERE difficulty = '${difficulty}' `
      : "";

    const query = `SELECT * FROM quiz ${difficultySelect} ORDER BY RANDOM() LIMIT ${limit};`;

    const response = await executePgQuery(query);
    return response.rows;
  } catch (error) {
    return {
      message: error.message,
      status: 0,
    };
  }
};

module.exports = { createQuestion, getQuestions };

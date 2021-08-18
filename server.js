const mysql = require('mysql2');
const inquirer = require('inquirer');

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'Sweggy4Beggy21!',
    database: 'enterprise_db'
  },
  console.log('Connected to the enterprise_db database!')
);


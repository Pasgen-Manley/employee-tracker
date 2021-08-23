const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require("console.table");

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'Sweggy4Beggy21!',
    database: 'enterprise_db'
  },
  console.log('Connected to the enterprise_db database!')
);

db.connect(err => {
  if (err) throw err;
  ifConnected();
});

ifConnected = () => {
  console.log(`
  ***************************************
  *** Welcome to the Employee Manager ***
  ***************************************\n`)

  runEmployeeManager();
};

const taskOperators = {
  "View all Departments": viewDepartments,
  "View all Roles": viewRoles,
  "View all Employees": veiwEmployees,
  "Add a Department": addDepartment,
  "Add a Role": addRole,
  "Add an Employee": addEmployee,
  "Update an Employee": updateEmployee,
  "Update a Role": updateRole,
  "Exit": process.exit
};

function runEmployeeManager() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "How would you like to proceed?",
        name: 'tasks',
        choices: Object.keys(taskOperators)
      },
    ])
    .then(({ task }) => taskOperators[task]())
};

function viewDepartments() {
  db.query("SELECT * FROM department", function(err, res) {
    if (err) throw err;
    console.log("\n Departments");
    console.table(res);
    console.log("\n");

    runEmployeeManager();
  })
};

function viewRoles() {
  db.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;
    console.log("\n Roles");
    console.table(res);
    console.log("\n");

    runEmployeeManager();
  })
};

function veiwEmployees() {
  db.query("SELECT * FROM employee", function (err, res) {
    if (err) throw err;
    console.log("\n Employees");
    console.table(res);
    console.log("\n");

    runEmployeeManager();
  })
};

function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Please input name of the department you want to add.",
        name: "department",
      },
    ])
    .then(function(answer) {
      db.query(`INSERT INTO department (name) VALUES ?`, answer.department, (err, res) => {
        if (err) throw err;
        console.log(`\n${answer.department} wad added to Departments.\n`);
        runEmployeeManager();
      })
    })
};

function addRole() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Please enter the name of the role you want to add.",
        name: "roleName",
      },
    ])
}


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

// Section of code that views database elements.
function viewDepartments() {
  let query = `SELECT id AS "Department ID", name AS "Department Name" FROM department`
  db.query(query, function(err, res) {
    if (err) throw err;
    console.log("\n Departments");
    console.table(res);
    console.log("\n");

    runEmployeeManager();
  })
};

function viewRoles() {
  let query = `SELECT role.title AS "Job Title", role.id AS "Role ID", role.salary AS "Role Salary", department.name AS "Department Name"
  FROM role
  JOIN department ON role.department_id = department.id`
  db.query(query, function (err, res) {
    if (err) throw err;
    console.log("\n Roles");
    console.table(res);
    console.log("\n");

    runEmployeeManager();
  })
};

function veiwEmployees() {
  let query = `SELECT e.id, e.first_name AS "First Name", e.last_name AS "Last Name", role.title AS "Role Title", role.salary AS Salary, department.name AS "Department Name", e.manager_id AS Manager
  FROM employee e
  JOIN role ON e.role_id = role.id
  JOIN department ON role.department_id = department.id`
  db.query(query, function (err, res) {
    if (err) throw err;
    console.log("\n Employees");
    console.table(res);
    console.log("\n");

    runEmployeeManager();
  })
};

//Section for code that adds, departments, roles and employees.
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
      let query = `INSERT INTO department (name) VALUES ?`
      db.query(query, answer.department, (err, res) => {
        if (err) throw err;
        console.log(`\n${answer.department} was added to Departments.\n`);
        runEmployeeManager();
      })
    })
};

function addRole() {
  let query = `SELECT * FROM department`
  db.query(query, (err, res) => {
    if (err) throw err;
    let departmentChoices = res.map(department => ({
      value: department.id, name: department.name
    }))

    console.log(departmentChoices)
    addRolePrompts(departmentChoices)

  })
};


function addRolePrompts(departmentChoices) {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Please enter the name of the role you want to add.",
        name: "roleTitle",
      },
      {
        type: "input",
        message: "Please enter the corresponding salary of this role.",
        name: "roleSalary",
      },
      {
        type: "list",
        message: "Which department does this role belong to?",
        name: "roleDepartment",
        choices: departmentChoices,
      },
    ])
    .then(function (answer) {
      let query = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`
      console.log(answer.roleDepartment);
      db.query(query, [answer.roleTitle, answer.roleSalary, answer.roleDepartment], (err, res) => {
        if (err) throw err;
        console.log(`\n${answer.roleTitle} was added to roles.\n`);
        runEmployeeManager();
      })
    })
};

function addEmployee() {
  let query = `SELECT * FROM role`
  db.query(query, function (err, res) {
    if (err) throw err;
    let rolechoices = res.map(role => ({
      value: role.id, name: role.title
    }))

    console.log(rolechoices)
    addEmployeePrompts(rolechoices)

  })
};

function addEmployeePrompts(rolechoices) {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Please enter employee's first name.",
        name: "employeeFirstName",
      },
      {
        type: "input",
        message: "Please enter employee's last name.",
        name: "employeeLastName",
      },
      {
        type: "list",
        message: "Please choose the employees role.",
        name: "roleDepartmentID",
        choices: rolechoices,
      },
      {
        type: "confirm",
        message: "Does this employee have a manager?",
        name: "hasManager",
      },
      {
        type: "type",
        message: "Please enter manager ID",
        name: "empManager",
        when (answer) {
          return answer.hasManager;
        }, 
      }
    ])
    .then(function (answer) {
      if (answer.empManager !== null) {
        let query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;

        db.query(query, [answer.employeeFirstName, answer.employeeLastName, answer.roleDepartmentID, answer.empManager], (err, res) => {
          if (err) throw err;
          console.log(`\n${answer.employeeFirstName} ${answer.employeeLastName} added to employees\n`);
          runEmployeeManager();
        })
      } else {
        let query = `INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)`;

        db.query(query, [answer.employeeFirstName, answer.employeeLastName, answer.roleDepartmentID], (err, res) => {
          if (err) throw err;
          console.log(`\n${answer.employeeFirstName} ${answer.employeeLastName} added to employees\n`);
          runEmployeeManager();
        })
      }
    })
};
// Update section
function updateEmployee() {
  let query = `SELECT * FROM employee`
  db.query(query, function (err, res) {
    if (err) throw err;
    let employeeDetails = res.map(employee => ({
      value: employee.id, name: `${employee.first_name} ${employee.last_name}`
    }))

    let query = `SELECT * FROM role`
    db.query(query, function (err, res) {
      if (err) throw err;
      let roleDetails = res.map(role => ({
        value: role.id, name: role.title
      }))

      console.log(employeeDetails);
      console.log(roleDetails);
      updateEmployeeRole(employeeDetails, roleDetails);
    })
  })
};

function updateEmployeeRole(employeeDetails, roleDetails) {
  inquirer
    .prompt([
      {
        type: "list",
        message: "Please choose an employee to update.",
        name: 'employeeUpdateChoice',
        choices: employeeDetails,
      },
      {
        type: "list",
        message: "Please assign employee to new role.",
        name: "updateRoleChoice",
        choices: roleDetails,
      },
    ])
    .then(function (answer) {
      let query = `UPDATE employee SET role_id = ? WHERE id = ?`;
      db.query(query, [answer.updateRoleChoice, answer.employeeUpdateChoice], (err, res) => {
        if (err) throw err;
        console.log(`\nRole updated for employee\n`);
        runEmployeeManager();
      })
    })
};
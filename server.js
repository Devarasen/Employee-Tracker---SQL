const inquirer = require('inquirer');
const consoleTable = require('console.table');
const mysql = require('mysql2');
const displayMenu = require('./lib/userInput');
const figlet = require('figlet');


const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'abcd1234',
        database: 'staff_db'
    },
    console.log(`Connected to the staff_db database.`)
);

function displayHeader() {
    console.log("\n**************************************");
    console.log("          Employee Manager");
    console.log("**************************************\n");
}

displayHeader();


function viewDepartments() {
    db.query('SELECT id, name FROM department', (err, rows) => {
        if (err) {
            console.error(err.message);
            return;
        }
        console.table(rows);
        promptUser();
    });
}

function viewRoles() {
    db.query('SELECT id, title FROM role', (err, rows) => {
        if (err) {
            console.error(err.message);
            return;
        }
        console.table(rows);
        promptUser();
    });
}

function viewEmployees() {
    db.query('SELECT id, first_name, last_name FROM employee', (err, rows) => {
        if (err) {
            console.error(err.message);
            return;
        }
        console.table(rows);
        promptUser();
    });
}

function addDepartment() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'departmentName',
                message: 'Enter the name of the new department:'
            }
        ])
        .then(answers => {
            const newDepartmentName = answers.departmentName;
            const sql = 'INSERT INTO department (name) VALUES (?)';

            db.query(sql, [newDepartmentName], (err, result) => {
                if (err) {
                    console.error(err.message);
                    return;
                }
                console.log(`Added new department: ${newDepartmentName}`);
                promptUser();
            });
        });
}

function addRole() {
    db.query('SELECT * FROM department', (err, rows) => {
        if (err) {
            console.error(err.message);
            return;
        }
        console.table(rows);
    });
}

function addEmployee() {
    db.query('SELECT * FROM department', (err, rows) => {
        if (err) {
            console.error(err.message);
            return;
        }
        console.table(rows);
    });
}

function updateEmployeeRole() {
    db.query('SELECT * FROM department', (err, rows) => {
        if (err) {
            console.error(err.message);
            return;
        }
        console.table(rows);
    });
}

// Run display menu function
function promptUser() {
    displayMenu()
        .then((answers) => {
            const selectedOption = answers.select;
            switch (selectedOption) {
                case "View All Departments":
                    viewDepartments();
                    break;
                case "View All Roles":
                    viewRoles();
                    break;
                case "View All Employees":
                    viewEmployees();
                    break;
                case "Add A Department":
                    addDepartment();
                    break;
                case "Add A Role":
                    addRole();
                    break;
                case "Add An Employee":
                    addEmployee();
                    break;
                case "Update An Employee Role":
                    updateEmployeeRole();
                    break;
                case "Quit":
                    console.log('Exiting...');
                    db.close();
                    break;
            }
        });
}


// Start the program by calling promptUser()
promptUser();

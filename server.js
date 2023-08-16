const inquirer = require('inquirer');
const consoleTable = require('console.table');
const userInput = require('./lib/userInput'); 
const mysql = require('mysql2');
const displayMenu = require('./lib/userInput');



const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'abcd1234',
        database: 'staff_db'
    },
    console.log(`Connected to the staff_db database.`)
);



function viewDepartments() {
    db.query('SELECT * FROM department', (err, rows) => {
        if (err) {
            console.error(err.message);
            return;
        }
        console.table(rows);
        promptUser();
    });
}

function viewRoles() {
    db.query('SELECT * FROM role', (err, rows) => {
        if (err) {
            console.error(err.message);
            return;
        }
        console.table(rows);
        promptUser();
    });
}

function viewEmployees() {
    db.query('SELECT * FROM employee', (err, rows) => {
        if (err) {
            console.error(err.message);
            return;
        }
        console.table(rows);
        promptUser();
    });
}

function addDepartment() {
    db.query('SELECT * FROM department', (err, rows) => {
        if (err) {
            console.error(err.message);
            return;
        }
        console.table(rows);
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

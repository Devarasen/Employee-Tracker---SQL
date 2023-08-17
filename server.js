const inquirer = require('inquirer');
const mysql = require('mysql2');
const displayMenu = require('./menuController/userInput');

// Establish connection
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
    db.query('SELECT name, id FROM department', (err, rows) => {
        if (err) {
            console.error(err.message);
            return;
        }
        console.table(rows);
        promptUser();
    });
}

function viewRoles() {
    const query = `
        SELECT 
            r.title, 
            r.id AS role_id, 
            d.name AS department_name, 
            r.salary as salary_AUD
        FROM role AS r
        JOIN department AS d 
        ON r.department_id = d.id
    `;

    db.query(query, (err, rows) => {
        if (err) {
            console.error(err.message);
            return;
        }
        console.table(rows);
        promptUser();
    });
}

function viewEmployees() {
    const query= `
        SELECT 
            e.id,
            e.first_name,
            e.last_name,
            r.title,
            d.name AS department_name,
            r.salary,
            CONCAT(m.first_name, ' ', m.last_name) AS manager_name
        FROM employee AS e
        JOIN role AS r ON e.role_id = r.id
        JOIN department AS d ON r.department_id = d.id
        LEFT JOIN employee AS m ON e.manager_id = m.id;   
    `;
    db.query(query, (err, rows) => {
        if (err) {
            console.error(err.message);
            return;
        }

        console.table(rows);
        promptUser();
    });
}

function viewEmployeesByManager() {
    const query = `
        SELECT 
            CONCAT(m.first_name, ' ', m.last_name) AS manager,
            e.id, 
            e.first_name, 
            e.last_name
        FROM employee AS e
        LEFT JOIN employee AS m ON e.manager_id = m.id
        ORDER BY manager;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err.message);
            return;
        }

        console.table(results);
        promptUser();
    });
}

function viewEmployeesByDepartment() {
    const query = `
        SELECT 
            d.name AS department,
            e.id, e.first_name, e.last_name
        FROM employee AS e
        JOIN role AS r ON e.role_id = r.id
        JOIN department AS d ON r.department_id = d.id
        ORDER BY department;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err.message);
            return;
        }

        console.table(results);
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
                console.log('\n');
                viewDepartments();
            });
        });
}

function addRole() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'roleName',
                message: 'Enter the name of the new role:'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Enter the salary for the new role:'
            },
            {
                type: 'input',
                name: 'departmentId',
                message: 'Enter the department ID for the new role:'
            }
        ])
        .then(answers => {
            const roleName = answers.roleName;
            const salary = parseFloat(answers.salary);
            const departmentId = parseInt(answers.departmentId);

            const insertQuery = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
            const values = [roleName, salary, departmentId];

            db.query(insertQuery, values, (err, result) => {
                if (err) {
                    console.error('Error adding role:', err.message);
                    return;
                }
                console.log(`Role '${roleName}' added successfully`);
                console.log('\n');
                viewRoles();
            });
        });
}

function addEmployee() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'firstName',
                message: "Enter the employee's first name:"
            },
            {
                type: 'input',
                name: 'lastName',
                message: "Enter the employee's last name:"
            },
            {
                type: 'input',
                name: 'roleId',
                message: "Enter the role ID for the employee:"
            },
            {
                type: 'input',
                name: 'managerId',
                message: "Enter the manager's ID for the employee (or leave empty if none):"
            }
        ])
        .then(answers => {
            const firstName = answers.firstName;
            const lastName = answers.lastName;
            const roleId = parseInt(answers.roleId);
            const managerId = answers.managerId !== '' ? parseInt(answers.managerId) : null;

            const insertQuery = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
            const values = [firstName, lastName, roleId, managerId];

            db.query(insertQuery, values, (err, result) => {
                if (err) {
                    console.error('Error adding employee:', err.message);
                    return;
                }
                console.log(`Employee '${firstName} ${lastName}' added successfully`);
                console.log('\n');
                viewEmployees();
            });
        });
}

function updateEmployeeRole() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'employeeId',
                message: "Enter the ID of the employee you want to update:"
            },
            {
                type: 'input',
                name: 'newRoleId',
                message: "Enter the new role ID for the employee:"
            }
        ])
        .then(answers => {
            const employeeId = parseInt(answers.employeeId);
            const newRoleId = parseInt(answers.newRoleId);

            const updateQuery = 'UPDATE employee SET role_id = ? WHERE id = ?';
            const values = [newRoleId, employeeId];

            db.query(updateQuery, values, (err, result) => {
                if (err) {
                    console.error('Error updating employee role:', err.message);
                    return;
                }
                console.log(`Employee's role updated successfully`);
                viewEmployees();
            });
        });
}

function updateEmployeeManager() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'employeeId',
                message: "Enter the ID of the employee you want to update:"
            },
            {
                type: 'input',
                name: 'newManagerId',
                message: "Enter the new manager's ID for the employee:"
            }
        ])
        .then(answers => {
            const employeeId = parseInt(answers.employeeId);
            const newManagerId = answers.newManagerId !== '' ? parseInt(answers.newManagerId) : null;

            const updateQuery = 'UPDATE employee SET manager_id = ? WHERE id = ?';
            const values = [newManagerId, employeeId];

            db.query(updateQuery, values, (err, result) => {
                if (err) {
                    console.error('Error updating employee manager:', err.message);
                    return;
                }
                console.log(`Employee's manager updated successfully`);
                viewEmployeesByManager();
            });
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
                case "View Employee by Manager":
                    viewEmployeesByManager();
                    break;
                case "View Employee By Department":
                    viewEmployeesByDepartment();
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
                case "Update Employee Manager":
                    updateEmployeeManager();
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

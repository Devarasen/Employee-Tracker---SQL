const inquirer = require('inquirer');
const mysql = require('mysql2');
const displayMenu = require('./menuController/userInput');
const consoleTable = require('console.table');
const dotenv = require('dotenv');
dotenv.config(); // Load the environment variables from .env

// Establish connection
const db = mysql.createConnection(
    {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    },
    console.log(`Connected to the ${process.env.DB_NAME} database.`)
);

// Employee manager display
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
            r.salary
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
            e.id, e.first_name, e.last_name
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
    const departmentsQuery = 'SELECT id, name FROM department';

    db.query(departmentsQuery, (err, departments) => {
        if (err) {
            console.error('Error fetching departments:', err.message);
            return;
        }

        const departmentChoices = departments.map(department => ({
            name: department.name,
            value: department.id
        }));

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
                    type: 'list',
                    name: 'departmentId',
                    message: 'Select the department for the new role:',
                    choices: departmentChoices
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
    });
}

function addEmployee() {
    const rolesQuery = 'SELECT id, title FROM role';
    const managersQuery = 'SELECT id, CONCAT(first_name, " ", last_name) AS full_name FROM employee';

    db.query(rolesQuery, (err, roles) => {
        if (err) {
            console.error('Error fetching roles:', err.message);
            return;
        }

        db.query(managersQuery, (err, managers) => {
            if (err) {
                console.error('Error fetching managers:', err.message);
                return;
            }

            const roleChoices = roles.map(role => ({
                name: role.title,
                value: role.id
            }));

            const managerChoices = managers.map(manager => ({
                name: manager.full_name,
                value: manager.id
            }));

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
                        type: 'list',
                        name: 'roleId',
                        message: "Select the role for the employee:",
                        choices: roleChoices
                    },
                    {
                        type: 'list',
                        name: 'managerId',
                        message: "Select the manager for the employee (or leave empty if none):",
                        choices: managerChoices
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
        });
    });
}

function updateEmployeeRole() {
    const employeesQuery = 'SELECT id, CONCAT(first_name, " ", last_name) AS full_name FROM employee';
    const rolesQuery = 'SELECT id, title FROM role';

    db.query(employeesQuery, (err, employees) => {
        if (err) {
            console.error('Error fetching employees:', err.message);
            return;
        }

        db.query(rolesQuery, (err, roles) => {
            if (err) {
                console.error('Error fetching roles:', err.message);
                return;
            }

            const employeeChoices = employees.map(employee => ({
                name: employee.full_name,
                value: employee.id
            }));

            const roleChoices = roles.map(role => ({
                name: role.title,
                value: role.id
            }));

            inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'employeeId',
                        message: 'Select the employee you want to update:',
                        choices: employeeChoices
                    },
                    {
                        type: 'list',
                        name: 'newRoleId',
                        message: 'Select the new role for the employee:',
                        choices: roleChoices
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
                        console.log('Employee\'s role updated successfully');
                        viewEmployees();
                    });
                });
        });
    });
}

function updateEmployeeManager() {
    const employeesQuery = 'SELECT id, CONCAT(first_name, " ", last_name) AS full_name FROM employee';
    const managersQuery = 'SELECT id, CONCAT(first_name, " ", last_name) AS full_name FROM employee WHERE manager_id IS NULL';

    db.query(employeesQuery, (err, employees) => {
        if (err) {
            console.error('Error fetching employees:', err.message);
            return;
        }

        db.query(managersQuery, (err, managers) => {
            if (err) {
                console.error('Error fetching managers:', err.message);
                return;
            }

            const employeeChoices = employees.map(employee => ({
                name: employee.full_name,
                value: employee.id
            }));

            const managerChoices = managers.map(manager => ({
                name: manager.full_name,
                value: manager.id
            }));

            inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'employeeId',
                        message: 'Select the employee you want to update:',
                        choices: employeeChoices
                    },
                    {
                        type: 'list',
                        name: 'newManagerId',
                        message: 'Select the new manager for the employee:',
                        choices: managerChoices
                    }
                ])
                .then(answers => {
                    const employeeId = parseInt(answers.employeeId);
                    const newManagerId = parseInt(answers.newManagerId);

                    const updateQuery = 'UPDATE employee SET manager_id = ? WHERE id = ?';
                    const values = [newManagerId, employeeId];

                    db.query(updateQuery, values, (err, result) => {
                        if (err) {
                            console.error('Error updating employee manager:', err.message);
                            return;
                        }
                        console.log("Employee's manager updated successfully");
                        viewEmployeesByManager();
                    });
                });
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
                case "View Employee by Manager":
                    viewEmployeesByManager();
                    break;
                case "View Employee By Department":
                    viewEmployeesByDepartment();
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
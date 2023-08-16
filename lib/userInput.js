const inquirer = require('inquirer');


function displayMenu() {
  return inquirer.prompt([
      {
        type: 'list',
        message: 'What would you like to do?',
        name: 'select',
        choices: [
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "Add A Department",
          "Add A Role",
          "Add An Employee",
          "Update An Employee Role",
          "Quit"
        ]
      }
    ]);
}


module.exports = displayMenu;
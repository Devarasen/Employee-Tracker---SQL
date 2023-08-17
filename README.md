# Employee-Tracker---SQL

Employee Tracker - SQL

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Description

This is a command-line application to manage a company's employee database, using Node.js, Inquirer, and MySQL.

Walkthrough video will show instructions on how to create your own svg logo file using this project. The video will also show the tests being run.

Link: https://drive.google.com/file/d/1JhoCIY9MZ27SQSBAQ5L_h5LlovLavWyL/view?usp=sharing

Github Repo: https://github.com/Devarasen/Employee-Tracker---SQL

![Screenshot](./assets/Project%20Screenshot.PNG)

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Credits](#credits)
- [License](#license)

## Installation

Dependencies should be installed for code to run properly.

Dependencies used are: - inquirer: v8.2.4 - console.table: ^0.10.0 - dotenv": ^16.3.1 - mysql2": ^2.2.5

Project tested on node v16.20.1

## Usage

1.  Please enter your credentials as approproate in the .env file to connect to sql database.

2.  On mysql terminal, run:
    SOURCE schema.sql
    SOURCE seeds.sql

3.  Open integrated terminal on root and run 'npm start'. A list will show with options:

        View All Departments
        View All Roles
        View All Employees
        View Employee by Manager
        View Employee By Department
        Add A Department
        Add A Role
        Add An Employee
        Update An Employee Role
        Update Employee Manager
        Quit

4.  Choose preferred options and follow prompts. (refer to walkthrough video for more help)

## Credits

Special thanks to all my tutors.

## License

MIT License

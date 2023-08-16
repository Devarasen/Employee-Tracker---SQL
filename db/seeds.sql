INSERT INTO department (name)
VALUES ("Sales"),
       ("Engineering"),
       ("Finance"),
       ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES ("Intern", 65000, 2),
       ("Project Manager", 200000, 2),
       ("Sales Director", 200000, 1),
       ("Administrative Officer", 70000, 1),
       ("Financial Analyst", 120000, 3),
       ("Accountant", 140000, 3),
       ("Paralegal", 70000, 4),
       ("General Counsel", 250000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Juhi", "Choudhury", 8, NULL),
       ("Lewis", "Collins", 7, 1),
       ("Ciaran", "Frawley", 6, 1),
       ("Toni", "Kroos", 5, 1),
       ("Wayne", "Rooney", 4, 1),
       ("Marcus", "Rashford", 3, 1),
       ("Thomas", "Muller", 2, 1),
       ("Johan", "Cruyff", 1, 1);


SELECT * FROM department;

SELECT * FROM role;

SELECT * FROM employee;
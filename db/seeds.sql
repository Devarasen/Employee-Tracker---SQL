INSERT INTO department (name)
VALUES ("Sales"),
       ("Engineering"),
       ("Finance"),
       ("Legal"),
       ("Management");

INSERT INTO role (title, salary, department_id)
VALUES ("Intern", 65000, 2),
       ("Project Manager", 200000, 2),
       ("Sales Director", 200000, 1),
       ("Administrative Officer", 70000, 1),
       ("Financial Analyst", 120000, 3),
       ("Accountant", 140000, 3),
       ("Paralegal", 70000, 4),
       ("General Counsel", 250000, 4),
       ("CEO", 500000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Juhi", "Choudhury", 9, NULL),
       ("Marcus", "Rashford", 3, 1),
       ("Lady", "Gaga", 8, 1),
       ("Lewis", "Collins", 7, 3),
       ("Ciaran", "Frawley", 6, 1),
       ("Toni", "Kroos", 5, 1),
       ("Wayne", "Rooney", 4, 2),       
       ("Thomas", "Muller", 2, 1),
       ("Johan", "Cruyff", 1, 7);


SELECT * FROM department;

SELECT * FROM role;

SELECT * FROM employee;
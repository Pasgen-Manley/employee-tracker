INSERT INTO department (name)
VALUES ('Sales'),
       ('Engineering'),
       ('Legal'),
       ('Finance'),
       ('Human Resources');

INSERT INTO role (title, salary, department_id)
VALUES ('Sales Officer', 70000, 1),
       ('Sales Manager', 110000, 1),
       ('Lead Engineer', 150000, 2),
       ('Engineer', 120000, 2),
       ('Lawyer', 130000, 3),
       ('Accountant', 70000, 4),
       ('Payroll Admin', 70000, 4),
       ('Human Resources Manager', 100000, 5),
       ('Human Resources Officer', 80000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Jeff', 'Milligan', )
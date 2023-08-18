INSERT INTO department (name)
VALUES ('Marketing'),
('Human Resources (HR)'),
('Finance'),
('Information Technology (IT)')

INSERT INTO role (title, salary, department_id)
VALUES ('Marketing Analyst', 75000, 1),
('Recruitment Specialist', 60000, 2),
('Finance Manager', 110000, 3),
('Software Developer', 95000, 4)

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Emily', 'Johnson', 1, 2),
('Marcus', 'Carter', 2, 3),
('Olivia', 'Patel', 3, 4),
('Ethan', 'Williams', 4, 1)
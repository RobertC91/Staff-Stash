INSERT INTO department (name)
VALUES ('Marketing'),
('Human Resources (HR)'),
('Finance'),
('Information Technology (IT)');

INSERT INTO role (title, salary, department_id)
VALUES ('Marketing Analyst', 75000, 1),
('Content Writer', 65000, 1),
('Training and Development', 70000, 2),
('Accountant', 67000, 3),
('Financial Analyst', 90000, 3),
('Recruitment Specialist', 60000, 2),
('Finance Manager', 110000, 3),
('Network Engineer', 110000, 4),
('Software Developer', 95000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Emily', 'Johnson', 1, NULL),
('Marcus', 'Carter', 3, 1),
('Olivia', 'Patel', 2, 1),
('Ethan', 'Williams', 6, 1),
('Jessica', 'Martinez', 8, 1),
('Sopha', 'Nguyen', 9, 1),
('Samuel', 'Lee', 5, 1),
('Ava', 'Garcia', 4, 1);

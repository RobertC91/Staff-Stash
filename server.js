require("dotenv").config();
const express = require("express");
const inquirer = require("inquirer");
const mysql = require("mysql2");
const figlet = require("figlet");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to the sql database
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Confirm connection to the database
db.connect((err) => {
  if (err) throw err;
  console.log("Connected to the database!");
  // Graphical banner in the menu
  figlet("Staff Stash", function (err, data) {
    if (err) {
      console.log("Figlet cant find Pooh", err);
    } else {
      console.log(data);
    }
    questions();
  });
});

// Starting menu options
const questions = () => {
  inquirer
    .prompt([
      {
        type: "list",
        choices: [
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "Add A Department",
          "Add A Role",
          "Add An Employee",
          "Update An Employee Role",
          "Quit",
        ],
        message: "What would you like to do?",
        name: "menu",
        loop: false,
        validate: (nameInput) => {
          if (nameInput) {
            return true;
          } else {
            console.log("Please choose an option from the list");
          }
        },
      },
    ])
    .then((response) => {
      console.log("You entered: " + response.menu);
      // Switch allows different functions depending on which option is chosen
      switch (response.menu) {
        case "View All Departments":
          viewDepartment;
          console.log;
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
        default:
          "Quit";
          quit();
          break;
      }
    });
};

// Query department table
const viewDepartment = () => {
  db.query("SELECT * FROM department", (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log(result);
    questions();
  });
};

// Query role table
const viewRoles = () => {
  db.query("SELECT * FROM role", (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log(result);
    questions();
  });
};

// Query employee table
const viewEmployees = () => {
  db.query("SELECT * FROM employee", (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log(result);
    questions();
  });
};

// Add Department
const addDepartment = () => {
  let question = [
    {
      type: "input",
      name: "name",
      message: "What is the new department name?",
    },
  ];
  inquirer.prompt(question).then((response) => {
    db.query(
      `INSERT INTO department (name) VALUES (?)`,
      [response.name],
      (err, result) => {
        if (err) {
          console.log(err);
        }
        console.log(result);
        questions();
      }
    );
  });
};

// Add A Role
const addRole = () => {
  // Query department table for use in inquirer
  db.query("SELECT * FROM department", (err, result) => {
    if (err) throw err;

    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "What is the new role name?",
        },
        {
          type: "input",
          name: "salary",
          message: "What is the salary?",
        },
        {
          type: "list",
          name: "department",
          message: "Which department is this role located?",
          choices: () => {
            var array = [];
            for (var i = 0; i < result.length; i++) {
              array.push(result[i].name);
            }
            return array;
          },
        },
      ])
      .then((response) => {
        for (var i = 0; i < result.length; i++) {
          if (result[i].name === response.department) {
            var department = result[i];
          }
        }

        db.query(
          "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)",
          [response.title, response.salary, department.id],
          (err, result) => {
            if (err) {
              console.log(err);
            }
            console.log("You have Successfully added a Role");
            questions();
          }
        );
      });
  });
};

// Add Employee
const addEmployee = () => {
  // calling tables for use in inquirer choices
  db.query("SELECT * FROM employee, role", (err, result) => {
    if (err) throw err;

    // Collect information on new employee
    inquirer
      .prompt([
        {
          type: "input",
          name: "firstName",
          message: "What is the employees first name?",
        },
        {
          type: "input",
          name: "lastName",
          message: "What is the employees last name?",
        },
        {
          type: "list",
          name: "role",
          message: "what is the employees role?",
          choices: () => {
            var array = [];
            for (var i = 0; i < result.length; i++) {
              array.push(result[i].title);
            }
            var newArray = [...new Set(array)];
            return newArray;
          },
        },
        {
          type: "input",
          name: "manager",
          message: "Who is the employees manager?",
        },
      ])
      .then((response) => {
        for (var i = 0; i < result.length; i++) {
          if (result[i].title === response.role) {
            var role = result[i];
          }
        }

        // Use response data to create new employee
        db.query(
          "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
          [response.firstName, response.lastName, role.id, response.manager.id],
          (err, result) => {
            if (err) throw err;
            console.log(
              `Added ${response.firstName} ${response.lastName} to the database!`
            );
            questions();
          }
        );
      });
  });
};

// Update an Employee
updateEmployeeRole = () => {
  // Query employee and role table for use in inquirer
  db.query("SELECT * FROM employee, role", (err, result) => {
    if (err) throw err;

    // Collecting information for update
    inquirer
      .prompt([
        {
          type: "list",
          name: "employee",
          message: "Which employees role do you want to update?",
          choices: () => {
            var array = [];
            for (var i = 0; i < result.length; i++) {
              array.push(result[i].last_name);
            }
            var employeeArray = [...new Set(array)];
            return employeeArray;
          },
        },
        {
          type: "list",
          name: "role",
          message: "What is the employees new role?",
          choices: () => {
            var array = [];
            for (var i = 0; i < result.length; i++) {
              array.push(result[i].title);
            }
            var newArray = [...new Set(array)];
            return newArray;
          },
        },
      ])
      .then((response) => {
        for (var i = 0; i < result.length; i++) {
          if (result[i].lastName === response.employee) {
            var name = result[i];
          }
        }
        for (var i = 0; i < result.length; i++) {
          if (result[i].title === response.role) {
            var role = result[i];
          }
        }
        // Updating new role based on new info
        db.query(
          "UPDATE employee SET ? WHERE ?",
          [{ role_id: role }, { last_name: name }],
          (err, result) => {
            if (err) throw err;
            console.log(`Updated ${response.employee} role to the database!`);
            questions();
          }
        );
      });
  });
};

// Close out the program
quit = () => {
  db.end();
  console.log("Thank You!");
};

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);

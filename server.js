require("dotenv").config();
const express = require('express')
const inquirer = require("inquirer");
const mysql = require("mysql2");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
  {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  }
);

db.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to the database!");
});

const questions = () => {
  return (inquirer.createPromptModule([
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
      validate: (nameInput) => {
        if (nameInput) {
          return true;
        } else {
          console.log("Please choose an option from the list");
        }
      },
    },
  ]).then = (result) => {
    console.log("You entered: " + result.option);

    switch (result.option) {
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
      default:
        quit();
    }
  });
};

const viewDepartments = () => {
  app.get("/api/department", (req, res) => {
    const sql = "SELECT * FROM department";

    db.query(sql, (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: "success",
        data: body,
      });
    });
  });
};

const viewRoles = () => {
  app.get("/api/role", (req, res) => {
    const sql = "SELECT * FROM role";

    db.query(sql, (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: "success",
        data: body,
      });
    });
  });
};

const viewEmployees = () => {
  app.get("api/employee", (req, res) => {
    const sql = "SELECT * FROM employee";

    db.query(sql, (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: "success",
        data: body,
      });
    });
  });
};

const addEmployee = () => {
  inquirer.prompt([
    {
      type: "input",
      message: `What's the employee's first name?`,
      name: "firstName",
    },
    {
      type: "input",
      message: `What's the employee's last name?`,
      name: "lastName",
    },
    {
      type: "input",
      message: `What's the employee's role id number?`,
      name: "roleID",
    },
    {
      type: "input",
      message: `What's the employee's manager ID number?`,
      name: "managerID",
    },
  ]).then = (answer) => {
    app.post("/api/employee", (req, res) => {
      let sql =
        "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?), [answer.firstName, answer.lastName, answer.roleId, answer.managerId]";

      db.query(sql, answer, (err, rows) => {
        if (err) {
          res.status(400).json({ error: err.message });
          return;
        }
        res.json({
          message: "success",
          data: body,
        });
      });
    });
  };
};

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);

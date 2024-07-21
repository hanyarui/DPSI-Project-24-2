require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");
const mysql2 = require("mysql2");
const fs = require("fs");

// Read the CA certificate
const caCert = fs.readFileSync("path/to/ca-certificate.crt");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    dialectModule: mysql2,
    dialectOptions: {
      ssl: {
        require: process.env.DB_SSL === "REQUIRED",
        rejectUnauthorized: true,
        ca: caCert.toString(), // Add the CA certificate here
      },
    },
  }
);

const Contents = require("./content")(sequelize, DataTypes);
const Users = require("./user")(sequelize, DataTypes);
const Favorites = require("./favorite")(sequelize, DataTypes);
const Visits = require("./visit")(sequelize, DataTypes);

// Define associations
Users.belongsTo(Contents, {
  foreignKey: {
    name: "wisataName",
    allowNull: false,
    references: {
      model: Contents,
      key: "wisataName",
    },
  },
  targetKey: "wisataName",
});
Favorites.belongsTo(Contents, {
  foreignKey: {
    name: "wisataID",
    allowNull: false,
    references: {
      model: Contents,
      key: "wisataID",
    },
  },
  targetKey: "wisataID",
});

Favorites.belongsTo(Users, {
  foreignKey: {
    name: "email",
    allowNull: false,
    references: {
      model: Users,
      key: "email",
    },
  },
  targetKey: "email",
});

Visits.belongsTo(Contents, {
  foreignKey: {
    name: "wisataID",
    allowNull: false,
    references: {
      model: Contents,
      key: "wisataID",
    },
  },
  targetKey: "wisataID",
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
    return sequelize.sync({ alter: true }); // or { force: true } to drop and recreate tables
  })
  .then(() => {
    console.log("Database synchronized successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

module.exports = {
  sequelize,
  Users,
  Contents,
  Favorites,
  Visits,
};

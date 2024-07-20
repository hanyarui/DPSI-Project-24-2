require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  }
);

const contents = require("./content")(sequelize);
const users = require("./user")(sequelize);
const favorites = require("./favorite")(sequelize);
const visits = require("./visit")(sequelize);

// Define associations
users.belongsTo(contents, {
  foreignKey: "wisataName",
  targetKey: "wisataName",
});
favorites.belongsTo(contents, { foreignKey: "wisataID" });
favorites.belongsTo(users, { foreignKey: "email" });
visits.belongsTo(contents, { foreignKey: "wisataID" });

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

module.exports = {
  sequelize,
  users,
  contents,
  favorites,
  visits,
};

"use strict";
exports.__esModule = true;
var knex_1 = require("knex");
var knex = (0, knex_1["default"])({
    client: 'mysql',
    connection: {
        host: process.env.DB_HOST,
        port: 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    }, migrations: {
        tableName: "knex_migrations"
    }
});
exports["default"] = knex;

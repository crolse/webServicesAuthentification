const mysql = require('mysql');
const dbConfig = require("../config/db.config.js");


const dbMysql = mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
});

exports.dbMysql = dbMysql
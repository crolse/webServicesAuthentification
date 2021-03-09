module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "",
  DB: "tindquette",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 300000,
    idle: 100000
  }
};

/*
max: maximum number of connection in pool
min: minimum number of connection in pool
idle: maximum time, in milliseconds, that a connection can be idle before being released
acquire: maximum time, in milliseconds, that pool will try to get connection before throwing error
*/


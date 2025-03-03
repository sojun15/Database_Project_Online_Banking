const { createConnection } = require("mysql");

const connect = createConnection({
    host: 'localhost',
    user: 'root',
    password:'',
    database: 'banking_system'
});

module.exports = connect;
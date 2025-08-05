const { createConnection } = require("mysql");

const connect = createConnection({
    host: 'localhost',
    user: 'root',
    password:'',
    database: 'banking_system'
});
connect.connect((err) => {
    if (err) {
        console.error('Error connecting to DB:', err.stack);
        return;
    }
    console.log('Connected to database.');
});

module.exports = connect;
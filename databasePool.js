const { Pool } = require('pg');

let config = {
    user: process.env.PGUSER,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    host: 'localhost', // Server hosting the postgres database
    port: process.env.PGPORT,
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
  };

const pool = new Pool(config);

module.exports = pool;

pool.query('SELECT * from item', (err, res) => {
    if (err) return console.log('error: ', err);
    console.log('res.rows', res.rows);
})
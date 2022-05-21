// read stock no from mysql database

// mysql2 是一個第三方套件
// npm i mysql2
// 引用進來
const mysql = require('mysql2/promise');

// (async () => {
//   const connection = await mysql.createConnection({
//     host: 'localhost',
//     port: 3306,
//     user: 'admin',
//     password: '',
//     database: 'nodejs_db',
//   });

  (async () => {
    const connection = await mysql.createConnection({
      host: process.env.DB_host,
      port: process.env.DB_port,
      user: process.env.DB_user,
      password: process.env.DB_password,
      database: process.env.DB_database,
    });

  let [data, fields] = await connection.execute('SELECT * FROM stocks');
  console.log(data);

  connection.end();
})();

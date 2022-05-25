// read stock no from mysql database

const axios = require('axios'); // 有使用再引用

// mysql2 是一個第三方套件
// npm i mysql2
// 引用進來
const mysql = require('mysql2/promise');
require('dotenv').config(); 

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
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

  let [data, fields] = await connection.execute('SELECT * FROM stocks');
  console.log(data);

  connection.end();
})();

// promise version
// 1. read stock no from file (fs)
// 2. axios.get to request data

// npm i axios 因為這是第三方模組
const axios = require('axios');
// fs (filesystem) 內建的模組不用安裝，可以直接使用
const fs = require('fs/promises'); // -> 使用 promise 版本

let readFilePromise = fs.readFile('stock.txt', 'utf-8');
console.log(readFilePromise);

// readFilePromise
//   .then((stockNo) => {
//     // 在這裡表示有讀到 stockNo
//     let getPromise = axios.get('https://www.twse.com.tw/exchangeReport/STOCK_DAY', {
//       params: {
//         // 設定 query string
//         response: 'json',
//         date: '20220301',
//         stockNo: stockNo,
//       },
//     });
//     getPromise
//       .then((response) => {
//         console.log(response.data);
//       })
//       .catch((e) => {
//         console.error(e);
//       });
//   })
//   .catch((e) => {
//     console.error(e);
//   });

readFilePromise
  .then((stockNo) => {
    // 在這裡表示有讀到 stockNo
    let getPromise = axios.get('https://www.twse.com.tw/exchangeReport/STOCK_DAY', {
      params: {
        // 設定 query string
        response: 'json',
        date: '20220301',
        stockNo: stockNo,
      },
    });
    return getPromise;
  })
  .then((response) => {
    console.log(response.data);
  })
  .catch((e) => {
    console.error(e);
  });

// fs.readFile('stock.txt', 'utf-8')
//   .then((stockNo) => {
//     console.log('read stock no from file:', stockNo);
//     // https://www.twse.com.tw/exchangeReport/STOCK_DAY?response=json&date=20220301&stockNo=2330
//     // axios promise-based 的 HTTP client
//     return axios.get('https://www.twse.com.tw/exchangeReport/STOCK_DAY', {
//       params: {
//         // 設定 query string
//         response: 'json',
//         date: '20220301',
//         stockNo: stockNo,
//       },
//     });
//   })
//   .then((response) => {
//     // response 物件
//     console.log(response.data);
//   })
//   .catch((e) => {
//     console.error(e);
//   });

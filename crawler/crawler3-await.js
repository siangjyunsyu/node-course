// await version
// 1. read stock no from file (fs)
// 2. axios.get to request data

// npm i axios 因為這是第三方模組
const axios = require('axios');
// fs (filesystem) 內建的模組不用安裝，可以直接使用
const fs = require('fs/promises'); // -> 使用 promise 版本

(async () => {
  try {
    let stockNo = await fs.readFile('stock.txt', 'utf-8');
    let response = await axios.get('https://www.twse.com.tw/exchangeReport/STOCK_DAY', {
      params: {
        // 設定 query string
        response: 'json',
        date: '20220301',
        stockNo: stockNo,
      },
    });
    console.log(response.data);
  } catch (e) {
    console.error(e);
  }
})();

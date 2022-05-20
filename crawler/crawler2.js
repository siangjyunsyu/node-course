// read stock no from stock.txt

// npm i axios
const axios = require('axios');
const fs = require('fs');
// fs模組
// 在Node.js中，使用fs模組來實現所有有關檔案及目錄的建立、寫入及刪除操作。
// 在fs模組中，所有的方法都分為同步和非同步兩種實現。
// 具有sync字尾的方法為同步方法，不具有sync字尾的方法為非同步方法。

fs.readFile('stock.txt', 'utf-8', (err, stockNo) => {
  if (err) {
    console.error('read file error', err);
  } else {
    console.log('read stock no from file:', stockNo);
    // https://www.twse.com.tw/exchangeReport/STOCK_DAY?response=json&date=20220301&stockNo=2330
    axios
      .get('https://www.twse.com.tw/exchangeReport/STOCK_DAY', {
        params: {
          // 設定 query string
          response: 'json',
          date: '20220301',
          stockNo: stockNo,
        },
      })
      .then((response) => {
        // response 物件
        console.log(response.data);
      })
      .catch((e) => {
        console.error(e);
      });
  }
});

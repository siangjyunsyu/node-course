// hard code stock no

// npm i axios
const axios = require('axios'); // 引用axios的意思
// axios有點像A-jax套件，指示是用來執行JS
// https://www.twse.com.tw/exchangeReport/STOCK_DAY?response=json&date=20220301&stockNo=2330  
// ↑ 這是股票的原始網址，可以把DAY以後的網址刪掉，變11行code

// 這邊是axios的用法
// axios的用法和promise的用法類似，只是差在前者是套件，後者是物件(非同步運算)
axios
  .get('https://www.twse.com.tw/exchangeReport/STOCK_DAY', { 
    params: { // params : 參數，此行是指設定以下參數
      // 設定 query string : 查詢字串 
      response: 'json',
      date: '20220301',
      stockNo: '2330',
    },
  })
  //response 回應/回覆
  .then((response) => {  // 成功就走這裡
    // response 物件
    console.log(response.data);
  })
  .catch((e) => {  //失敗就走這裡
    console.error(e);
    // 僅是要表達是錯誤訊息，其和 console.log(e) 一樣
    // console.log(e) 
  });

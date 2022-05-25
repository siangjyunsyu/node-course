// npm i express
// 導入 express 這個模組
const express = require('express');
// 利用 epxress 來建立一個 express application
const app = express();

// HTTP request
// method: get, post, put, delete, ...
app.get('/', (request, response, next) => {
  console.log('首頁');
  response.send('首頁');
});

app.get('/about', (request, response, next) => {
  response.send('About Me');
});

app.listen(3001, () => {
  console.log('Server start at 3001');
});

// node server.js 執行
// 開新分頁，網址處打:localhost:3001，就會出現文字

// 啟動程式的時候，本來應該是要用 node server.js，因為 server 的程式是會一直啟動中，這樣才可以一直等著接受請求。
// 當你編輯程式的時候，你就必須要手動停掉程式，再啟動一次，這樣才可以把新的程式碼載入記憶體中去執行。–> 超麻煩

// 利用工具： nodemon，因為這是一個跨專案的工具，所以我們會安裝在全域:npm i -g nodemon
// 裝了nodemon之後，它會自動偵測是否有改程式碼，如果有改，就會自動重新啟動伺服器
// 這樣只要網頁重新整理，就可以看到修改的內容~~
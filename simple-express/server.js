// npm init -f 先設立專案啟用套件

// npm i express
// 導入 express 這個模組
const express = require('express');
// 利用 epxress 來建立一個 express application
const app = express();

// path 為內建套件
const path = require('path');
//引用mysql2套件資料庫
const mysql = require('mysql2');

require('dotenv').config();
// 這裡不會像爬蟲那樣，只建立一個連線 (mysql.createConnection)
// 但是，也不會幫每一個 request 都分別建立連線
// ----> connection pool

// 建立成獨立模組引用進來使用
let pool = require('./utils/db');

// 使用第三方開發的中間件 cors
const cors = require("cors");
app.use(cors());

// const { response } = require('express');

// 依照程式碼由上到下順序來執行順序
// client - server
// client send request -------> server
//                     <------- response
// request-response cycle
// client: browser, postman, nodejs,...   (發出請求的一方 = client 端)

// express 是一個由 middleware (中間件) 組成的世界
// request --> middleware1 --> middleware2 --> .... --> response
// 中間件的「順序」很重要!!
// Express 是按照你安排的順序去執行誰是 next 的
// middleware 中有兩種結果：
// 1. next: 往下一個中間件去
// 2. response: 結束這次的旅程 (request-response cycle)  


// express SSR 的做法
// 設定 express 視圖檔案放在哪裡
app.set('views', path.join(__dirname, 'views'));
// 設定 express要用哪一種樣版引擎 (template engine)
// npm i pug
app.set('view engine', 'pug');

// express.urlencoded 要讓 express 認得 req 裡 body 裡面的資料
// extended: false --> querystring
// extended: true --> qs
app.use(express.urlencoded({ extended: true }));
// 要讓 express 認得 req 裡 json
app.use(express.json());


// express 處理靜態資料
// 靜態資料: html, css 檔案, javascript 檔案, 圖片, 影音檔...
// express 少數內建的中間件 static
// 方法1: 不要指定網址
// app.use(express.static(path.join(__dirname, 'assets')));
// http://localhost:3001/images/test1.jpg
// 方法2: 指定網址 public
app.use('/public', express.static(path.join(__dirname, 'public')));
// http://localhost:3001/public/images/callback-hell.png


// 一般中間件
app.use((request, response, next) => {
  console.log('我是一個沒有用的中間件 AAAA');
  next();
  // response.send('我是中間件'); //如果這行打開會直接在這結束

  // 兩個都有，那會發生什麼事？
  // 情況 1:
  // next();
  // response.send('我是中間件');

  // 情況 2:
  // response.send('我是中間件');
  // next();
});



// (一般)中間件(函式)(use) middleware [2]
// function next() | pipeline | 到下一個中間件
// function response() | 結束整個 cycle
app.use((request, response, next) => {
  console.log('我是一個沒有用的中間件 BBBB');
  next();
  // return
});


// HTTP request
// method: get, post, put, delete, ...
// app.get --> 路由中間件
app.get('/', (request, response, next) => {
  console.log('首頁ccc');
  response.send('首頁'); 
  // 送回 response，結束了 request-response cycle 
  // 如果把這行註解，網頁就會無法response而呈現擱置狀態(網頁一直轉圈圈)
  // return
});

app.get('/about', (request, response, next) => {
  console.log('about');
  response.send('About Me');
});

app.get('/error', (request, response, next) => {
  // 發生錯誤，你丟一個錯誤出來
  // throw new Error('測試測試');
  // 或是你的 next 裡有任何參數
  next('我是正確的');
  // --> 都會跳去錯誤處理中間件
});

app.get('/ssr', (request, response, next) => {
  // 會去 views 檔案夾裡找 index.pug
  // 第二個參數: 資料物件，會傳到 pug 那邊去，pug 可以直接使用
  response.render('index', {
    stocks: ['台積電', '長榮', '聯發科'],
  });
});

const StockRouter = require('./routers/stockRouter')
app.use('/api/stocks', StockRouter)

const AuthRouter = require('./routers/authRouter');
app.use('/api/auth', AuthRouter);

// 這個中間件在所有路由的後面
// 會到這裡，表示前面所有的路由中間件都沒有比到符合的網址
// => 404
app.use((request, response, next) => {
  console.log('所有路由的後面 ==> 404', request.path);
  response.status(404).send('Not Found');
});

// 5xx
// 錯誤處理中間件: 通常也會放在所有中間件的最後
// 超級特殊的中間件
// 有點接近 try-catch 的 catch
app.use((error, request, response, next) => {
  console.error('來自四個參數的錯誤處理中間件', request.path, error);
  response.status(500).send('Server Error: 請洽系統管理員');
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
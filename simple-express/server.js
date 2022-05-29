// npm init -f

// npm i express
// 導入 express 這個模組
const express = require('express');
// 利用 epxress 來建立一個 express application
const app = express();

// path 為內建套件
const path = require('path');
const mysql = require('mysql2');
const { response } = require('express');
require('dotenv').config();
// 這裡不會像爬蟲那樣，只建立一個連線 (mysql.createConnection)
// 但是，也不會幫每一個 request 都分別建立連線
// ----> connection pool
const cors = require("cors");
app.use(cors());

// 請一堆工人 connection pool
let pool = mysql
  .createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    //為了pool 新增的參數
    connectionLimit: 10,
  })
  .promise()


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


// express 處理靜態資料
// 靜態資料: html, css 檔案, javascript 檔案, 圖片, 影音檔...
// express 少數內建的中間件 static
// 方法1: 不要指定網址
app.use(express.static(path.join(__dirname, 'assets')));
// http://localhost:3001/images/test1.jpg
// 方法2: 指定網址 aaa
app.use('/aaa', express.static(path.join(__dirname, 'public')));
// http://localhost:3001/aaa/images/callback-hell.png


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
// function next() | pipeline | 到下一個中間中
// function response() | 結束整個 cycle
app.use((request, response, next) => {
  console.log('我是一個沒有用的中間件 BBBB');
  next();
  // return
});


// HTTP request
// method: get, post, put, delete, ...
// app.get --> 這一個路由
app.get('/', (request, response, next) => {
  console.log('首頁ccc');
  response.send('首頁'); // 送回 response，結束了 request-response cycle // 如果把這行註解，網頁就會無法response而呈現擱置狀態(網頁一直轉圈圈)
  // return
});

app.get('/about', (request, response, next) => {
  console.log('about');
  response.send('About Me');
});

app.get('/news', (request, response, next) => {
  console.log('news');
  response.send('news');
});

app.get("/activity", (request, response, next) => {
  console.log('activity');
  response.send("activity");
});

app.get("/course", (request, response, next) => {
  console.log('course');
  response.send("course");
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

// RESTful API
// 取得 stocks 的列表
app.get('/stocks', async (request, response, next) => {
  console.log('我是股票列表');
  let [data, fields] = await pool.execute('SELECT * FROM stocks');
  response.json(data);
});

// 取得某個股票 id 的資料 :stockId 變數
app.get('/stocks/:stockId', async (request, response, next) => {
  // 取得網址上的參數 request.params
  // request.params.stockId
  console.log('get stocks by id', request.params);
  // let [data, fields] = await pool.execute('SELECT * FROM stock_prices WHERE stock_id = ?', [request.params.stockId]);


  // RESTful 風格之下，鼓勵把這種過濾參數用 query string 來傳遞
  // /stocks/:stockId?page=1
  // 1. 取得目前在第幾頁，而且利用 || 這個特性來做預設值
  // req.query = {}
  // 如果網址上沒有 page 這個 query string，那 req.query.page 會是 undefined
  // undefined 會是 false，所以 page 就被設定成 || 後面那個數字
  // https://developer.mozilla.org/zh-CN/docs/Glossary/Falsy
  let page = req.query.page || 1;
  console.log('current page', page);

  // 2. 取得目前的總筆數
  let [allResults, fields] = await pool.execute('SELECT * FROM stock_prices WHERE stock_id = ?', [req.params.stockId]);
  const total = allResults.length;
  console.log('total:', total);

  // 3. 計算總共有幾頁
  // Math.ceil 1.1 => 2   1.05 -> 2
  const perPage = 5; // 每一頁有幾筆
  const lastPage = Math.ceil(total / perPage);
  console.log('lastPage:', lastPage);

  // 4. 計算 offset 是多少（計算要跳過幾筆）
  // 在第五頁，就是要跳過 4 * perPage
  let offset = (page - 1) * perPage;
  console.log('offset:', offset);

  // 5. 取得這一頁的資料 select * from table limit ? offet ?
  let [pageResults] = await pool.execute('SELECT * FROM stock_prices WHERE stock_id = ? ORDER BY date DESC LIMIT ? OFFSET ?', [req.params.stockId, perPage, offset]);

  // test case:

  // 正面: 沒有page, page=1, page=2, page=12 (因為總共12頁)
  // 負面: page=-1, page=13, page=空白(page=1), page=a,...
  // 6. 回覆給前端
  res.json({
    // 用來儲存所有跟頁碼有關的資訊
    pagination: {
      total,
      lastPage,
      page,
    },
    // 真正的資料
    data: pageResults,
  });




  console.log('query stock by id:', data);
  // 空資料(查不到資料)有兩種處理方式：
  // 1. 200OK 就回 []
  // 2. 回覆 404
  if (data.length === 0) {
    // 這裡是 404 範例
    response.status(404).json(data);
  } else {
    response.json(data);
  }
});

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
app.use((err, request, response, next) => {
  console.error('來自四個參數的錯誤處理中間件', request.path, err);
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
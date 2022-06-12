// 建立一個 routers 檔案夾
// 在 routers 裡，建立一了一個 stockRouter.js

const express = require('express');
const router = express.Router();
// router is a mini-app

const pool = require('../utils/db');

router.use((require, response, next) => {
    console.log('CCCCCCCC');
    next();
});

let singleMiddleware = (require, response, next) => {
    console.log('DDDDDDD');
    next();
};

// RESTful API
// 取得 stocks 的列表
router.get('/', singleMiddleware, async (request, response, next) => {
    console.log('我是股票列表');
    let [data, fields] = await pool.execute('SELECT * FROM stocks');
    response.json(data);
});

// 取得某個股票 id 的資料 :stockId 變數
router.get('/:stockId', async (request, response, next) => {
    // 取得網址上的參數 request.params
    // request.params.stockId
     //回傳的 fields 幾乎不會用到可以省略
    console.log('get stocks by id', request.params);
    let [data, fields] = await pool.execute('SELECT * FROM stock_prices WHERE stock_id = ?', [request.params.stockId]);
    // console.log("query stock by id:", data);

    // RESTful 風格之下，鼓勵把這種過濾參數用 query string 來傳遞
    // /stocks/:stockId?page=1
    // 1. 取得目前在第幾頁，而且利用 || 這個特性來做預設值
    // request.query = {}
    // 如果網址上沒有 page 這個 query string，那 req.query.page 會是 undefined
    // undefined 會是 false，所以 page 就被設定成 || 後面那個數字
    // https://developer.mozilla.org/zh-CN/docs/Glossary/Falsy
    let page = request.query.page || 1;
    console.log('current page', page);

    // 2. 取得目前的總筆數
    let [allResults] = await pool.execute('SELECT * FROM stock_prices WHERE stock_id = ?', [request.params.stockId]);
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
    let [pageResults] = await pool.execute('SELECT * FROM stock_prices WHERE stock_id = ? ORDER BY date DESC LIMIT ? OFFSET ?', [request.params.stockId, perPage, offset]);

    // test case:
    // 正面: 沒有page, page=1, page=2, page=12 (因為總共12頁)
    // 負面: page=-1, page=13, page=空白(page=1), page=a,...
    // 6. 回覆給前端
    response.json({
        // 用來儲存所有跟頁碼有關的資訊
        pagination: {
            total,
            lastPage,
            page,
        },
        // 真正的資料
        data: pageResults,
    });

    // console.log('query stock by id:', data);
    // 空資料(查不到資料)有兩種處理方式：
    // 1. 200OK 就回 []
    // 2. 回覆 404
    // if (data.length === 0) {
    // 這裡是 404 範例
    //   response.status(404).json(data);
    // } else {
    //   response.json(data);
    // }
});

module.exports = router;
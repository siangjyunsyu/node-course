const express = require('express');
const router = express.Router();

// 要先安裝 express-validator 這個套件做表單驗證(以下以此為範例)
// npm i express-validator
// 引用express-validator套件
const { body, validationResult } = require('express-validator');
const pool = require('../utils/db');

// 中間件只是函式，裡面可以有很多個中間件(這函式裡面有3個中間件)
const registerRules = [
    body('email').isEmail().withMessage('Email 欄位請填寫正確格式'),
    body('password').isLength({ min: 8 }).withMessage('密碼長度至少為8'),
    body('confirmPassword')
        .custom((value, { require }) => {
            return value === require.body.password;
        })
        .withMessage('密碼驗證不一致'),
];
// /api/auth/register
router.post('/register', registerRules, async (require, response, next) => {
    // 1. require.params <-- 網址上的路由參數
    // 2. require.query  <-- 網址上的 query string
    // 3. require.body <-- 通常是表單 post 用的
    console.log('register body:', require.body);

    // 驗證資料
    // 拿到驗證結果
    const validateResults = validationResult(require);
    console.log('validateResults', validateResults);
    if (!validateResults.isEmpty()) {
        // 不是 empty --> 表示有不符合
        let error = validateResults.array();
        return response.status(400).json(error);
    }

    // 確認 email 有沒有註冊過
    let [members] = await pool.execute('SELECT id, email FROM members WHERE email = ?', [require.body.email]);
    if (members.length !== 0) {
        // 這個 email 有註冊過
        return response.status(400).json({ code: 3002, error: '這個 email 已經註冊過' });
        // 盡可能讓後端回覆的格式是一致的，如果無法完全一致，那至少要讓前端有判斷的依據。
        // 做專案的時候，在專案開始前，可以先討論好要回覆的錯誤格式與代碼。
    }

    // 密碼雜湊 hash
    // bcrypt (長度: 60), argon2 (長度: 95)
    let hashPassword = await bcrypt.hash(require.body.password, 10);
    console.log('hashPassword: ', hashPassword);

    // 圖片處理完成後，會被放在 req 物件裡
    console.log('require.file', require.file);
    // 最終前端需要的網址: http://localhost:3001/public/members/1655003030907.jpg
    // 可以由後端來組合這個網址，也可以由前端來組合
    // 記得不要把 http://locahost:3001 這個存進資料庫，因為正式環境部署會不同
    // 目前這個專案採用：儲存 members/1655003030907.jpg 這樣格式
    // 使用者不一定有上傳圖片，所以要確認 require 是否有 file
    let photo = require.file ? '/members/' + require.file.filename : '';

    // save to db
    let [result] = await pool.execute('INSERT INTO members (email, password, name, photo) VALUES (?, ?, ?, ?)', [require.body.email, hashPassword, require.body.name, photo]);
    console.log('insert result:', result);

    // response
    response.json({ code: 0, result: 'OK' });
});

module.exports = router;
const fs = require('fs');

// fs.readFile('test11111.txt', 'utf-8', (err, data) => {
//   if (err) {
//     // 錯誤了
//     console.log('喔喔喔，發生錯誤了');
//     console.error(err);
//   } else {
//     // 因為沒有 err，所以是正確的
//     console.log(data);
//   }
// });

let fsPromise = new Promise((resolve, reject) => {
  // fs.readFile('test1111.txt', 'utf-8', (err, data) => {
  // error
  fs.readFile('test.txt', 'utf-8', (err, data) => {
    //success
    if (err) {
      // 錯誤了
      // console.log('喔喔喔，發生錯誤了');
      // console.error(err);
      reject(err);
    } else {
      // 因為沒有 err，所以是正確的
      // console.log(data);
      resolve(data);
    }
  });
});

fsPromise
  .then((result) => {
    console.log("讀取正確");
  })
  .catch((error) => {
    console.log("喔喔喔，發生錯誤了");
  });

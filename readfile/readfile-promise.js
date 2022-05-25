const fs = require('fs');

let p = new Promise((resolve, reject) => {
  fs.readFile('test.txt', 'utf-8', (err, data) => {
    if (err) {
      // 錯誤了
      reject(err);
    } else {
      // 因為沒有 err，所以是正確的
      resolve(data);
    }
  });
});

p.then((result) => {
  console.log(`resolved: ${result}`);
}).catch((error) => {
  console.error(error);
});

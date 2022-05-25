//   有 await: 4 -> 1 -> 5 -> 2 -> 3
// 沒有 await: 4 -> 1 -> 3 -> 5 -> 2
async function asyncF() {
  console.log(1);
  // await 暫停鍵
  await new Promise((resolve, reject) => {
    // console.log('A');
    setTimeout(() => {
      console.log(2);
      resolve();
      // reject
    }, 0);
  });
  console.log(3);
}
console.log(4);
asyncF();
console.log(5);

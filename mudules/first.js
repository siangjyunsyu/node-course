const second = require('./second');

console.log('I am first');

let name = 'first';
function showName() {
  console.log(`My name is ${name}`);
}
showName();
// 如果沒有寫showName()這函式的話，程式因為不知道宣告的這段變數和函式要做什麼，所以不會執行
// 但如果加了showName()這函式的話，就會顯示My name is first

module.exports = {};

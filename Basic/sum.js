// 回傳 1 + 2 + ... + n 的結果

// 寫法 1 公式解
function sum1(n){
    return n*(n+1)/2;
}

console.log(sum1(1));   // 1
console.log(sum1(2));   // 3
console.log(sum1(10));  // 55
console.log(sum1(100)); // 5050

// 寫法 2 for迴圈解-1
function sum2(n){
    let i = "";
    for(i=0; n>=i; i++){    
    }
    return i*(i-1)/2;
}

console.log(sum2(1));   // 1
console.log(sum2(2));   // 3
console.log(sum2(10));  // 55
console.log(sum2(100)); // 5050

// 寫法 2 for迴圈解-2
function sum3(n){
    let sum = 0;
    for(i=1; i<=n; i++){    
    sum +=i;
    }
    return sum;
}

console.log(sum3(1));   // 1
console.log(sum3(2));   // 3
console.log(sum3(10));  // 55
console.log(sum3(100)); // 5050

// 寫法 3
// reduce寫法
function sum4(n){
    [1,2,3,...n].reduce((sum,item) => sum + item, 0);
}

console.log(sum4(1));   // 1
console.log(sum4(2));   // 3
console.log(sum4(10));  // 55
console.log(sum4(100)); // 5050


// BIG O 程式處理所花費的時間
console.time('sum1');
for (let i =0; i<10000; i++){
    sum1(100000);
}
console.timeEnd('sum1');

console.time('sum2');
for (let i =0; i<10000; i++){
    sum2(100000);
}
console.timeEnd('sum2');
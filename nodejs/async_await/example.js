// 普通函数手工返回 Promise

function resolveAfter2Seconds(x) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(x);
    }, 2000);
  });
};

// async 函数隐式将返回值转化成 Promise

var add1 = async function(x) {
  var a = resolveAfter2Seconds(20);
  var b = resolveAfter2Seconds(30);

  // 这个类似于 Promise all;
  return x + await a + await b;
}

add1(11).then(v => {
  console.log(v);  // prints 60 after 2 seconds.
});

var add2 = async function(x) {
    // await 把 Promise 转化成同步， 只能用在 async 函数中
  var a = await resolveAfter2Seconds(20);
  var b = await resolveAfter2Seconds(30);
  return x + a + b;
};

(async function(){
    var xxx = await add2(10);
    console.log(xxx);
})();

// add2(10).then(v => {
//   console.log(v);  // prints 60 after 4 seconds.
// });
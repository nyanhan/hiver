function* foo( input ) {
  var res = yield input;
  console.log('res is ', res);
}

var g = foo(10);
console.log(g.next()); // 到达第一个 yield，返回 input 的值
console.log(g.next(100)); // 将 100 作为参数传入


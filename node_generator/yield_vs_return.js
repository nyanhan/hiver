
// yield vs return;
function * foo( input ) {
  var res = yield input / 2; // 修改这里的表达式
  return 15;
  yield 25;
}

var g = foo(10);
console.log(g.next()); // { value: 5, done: false } 5 == input / 2
console.log(g.next()); // { value: 15, done: true } )

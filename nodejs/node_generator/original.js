//function square() {
    //var k = 0;
    //return function genNextSquare() {
            //return (++k)*k;
        //};
//}

//var squares = square();
//console.log(squares());
//console.log(squares());
//console.log(squares());

function *square() {
  var k = 0;
  while (true) {
      yield (++k)*k;
    }
}

var squares = square();
console.log(squares.next().value);
console.log(squares.next().value);
console.log(squares.next().value);
console.log(squares.next().value);


//console.time(1);
//var t = new Date();
//for( var i = 0, j = ""; i < 10000; i++ ) {
   //j+="1"; 
//}

//console.log(new Date() - t);

//console.timeEnd(1);

console.time(1);

for( var i = 0, j = 0; i < 10000000; i++ ) {
   j+=1;
}

console.timeEnd(1); 

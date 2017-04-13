var fs = require("fs");

fs.readFile("next_param.js", "utf-8", function(err, f){
    console.log("readed");
});

setImmediate(function(){
    console.log("setImmediate");
});

process.nextTick(function() {
    console.log("nextTick");
});

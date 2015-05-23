
var path = require("path");
exports.hello = function() {
    console.log("hello");
    console.log(__dirname);
    console.log(path.resolve("."));
    console.log(process.cwd());
};

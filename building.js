var http = require('http');
http.createServer(function(req, res){
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Site is building, Coming soon !!');
}).listen(80);

console.log(new Date().toString());
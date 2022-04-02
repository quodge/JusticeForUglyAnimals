var http = require("http");

http.createServer(function (request, response){

    response.writeHead(200, {'Content-Type': 'text/plain',
                            'Access-Control-Allow-Origin' : '*'
    });
//var readStream = fs.createReadStream(__dirname + '/index.html');
//readStream.pipe(response);
    response.end('Hello World\n');

    }).listen(process.env.PORT || 8080);

    response.end('Hello World\n');
//}).listen(8080);

console.log('Server running on port ${ PORT }');

let port = 8887;
let hostname = '127.0.0.1';
let dir = '';

let http = require('http');
let url=require('url');
let fs=require('fs');
let mine=require('./mine').types;
let path=require('path');
let Tools=require('./tools');

dir = dir ? dir : process.cwd() ;
// console.log('------------'+process.cwd());
let server = http.createServer(function (request, response) {
    let pathname = url.parse(request.url).pathname;
    // process.execPath
    let guessPage = Tools.guessPage(fs, path, dir, pathname);
    let realPath = guessPage.realPath;
    let ext = guessPage.ext;
    fs.exists(realPath, function (exists) {
        //console.log(exists);
        if (!exists) {
            response.writeHead(404, {
                'Content-Type': 'text/plain'
            });

            response.write("This request URL " + pathname + " was not found on this server.");
            response.end();
        } else {
            fs.readFile(realPath, "binary", function (err, file) {
                // console.log(err);
                if (err) {
                    response.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });
                    response.end(err);
                } else {

                    let contentType = mine[ext] || "text/plain";
                    response.writeHead(200, {
                        'Content-Type': contentType
                    });
                    response.write(file, "binary");
                    response.end();
                }
            });
        }
    });
});
server.listen(port,hostname,() => {
    console.log('Server running at http://'+hostname+':'+port+'/');
});
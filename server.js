
var http = require('http');
var fileSystem = require('fs');

var server = http.createServer(function(req, resp){
	// fileSystem.readFile('./index.html', function(error, fileContent){
	// 	if(error){
	// 		resp.writeHead(500, {'Content-Type': 'text/plain'});
	// 		resp.end('Error');
	// 	}
	// 	else{
	// 		resp.writeHead(200, {'Content-Type': 'text/html'});
	// 		resp.write(fileContent);
	// 		resp.end();
	// 	}
	// });

	// try and get the Jenkins X Environment this app is running on
	fileSystem.readFile('/var/run/secrets/kubernetes.io/serviceaccount/namespace', function(error, fileContent){
		if(error){
			resp.writeHead(500, {'Content-Type': 'text/plain'});
			resp.end(error.stack);
		}
		else{
			resp.writeHead(200, {'Content-Type': 'text/html'});
			resp.write(fileContent);
			resp.end();
		}
	});
});

server.listen(8080);



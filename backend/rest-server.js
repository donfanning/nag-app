// run this application before next app
var topology = require('./topology-data');
var http = require('http');
var response = topology.response;

// live network
var appConfig = {
	'live': true
};

// create a server
var server = http.createServer();

// initialize uncontrolled changes in network topology
setInterval(function(){
	// todo: develop live network
	
},3000);

server.on('request',function(req,res){
	// start live network
	if(req.url == '/start'){
		appConfig.live = true;
		res.writeHead(200,{'Access-Control-Allow-Origin': '*'});
		res.end(JSON.stringify({'command':'start','result':'ok'}));
		console.log('live: ' + appConfig.live)
	}
	// stop live network
	else if(req.url == '/stop'){
		appConfig.live = false;
		res.writeHead(200,{'Access-Control-Allow-Origin': '*'});
		res.end(JSON.stringify({'command':'stop','result':'ok'}));
		console.log('live: ' + appConfig.live)
	}
	// display status
	else if(req.url == '/status'){
		res.writeHead(200,{'Access-Control-Allow-Origin': '*'});
		res.end(JSON.stringify({'command':'status','result':appConfig.live}));
		console.log('live: ' + appConfig.live)
	}
	// default response: topology
	else if(req.url == '/'){
		res.writeHead(200,{'Access-Control-Allow-Origin': '*'});
		res.end(JSON.stringify(response));
		console.log('request for topology');
	}
});

server.listen(5555);


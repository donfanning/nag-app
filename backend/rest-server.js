// run this application before next app
var topology = require('./topology-data');
var http = require('http');
var response = topology.response;
var deleted = 0;
var added = 0;
// live network
var appConfig = {
	'live': true,
	'baseNodeNumber': response.topology[0].node.length,
	'aplicableMultiplicity': 5, // maximum number of host per 1 router,
	'permissibleInterval': 0.25, // (baseNodeNumber * aplicableMultiplicity) +- permissibleInterval%
	'timeout': 3000
};

// create a server
var server = http.createServer();

var addRandomNode = function(){added++;
	var topology = response.topology[0];
	// new node
	var newNodeId = topology.node.length;
	topology.node.push({
		"id": newNodeId,
		"node-id": 'host:' + newNodeId
	});
	// new link
	topology.link.push({
		// random node's id except the new one's
		"source": {
			"source-node": topology.node[Math.floor(Math.random() * (newNodeId - 1))]['node-id']
		},
		"destination": {
			"dest-node": topology.node[newNodeId]['node-id']
		}
	});
};

var removeRandomNode = function(){deleted++;
	console.log('removing a node...');
	var topology = response.topology[0];
	// node that will be removed
	var toBeRemoved = Math.floor((Math.random() * (topology.node.length - appConfig.baseNodeNumber)) + appConfig.baseNodeNumber);
	console.log('removing a node #' + toBeRemoved);
	var toBeRemovedName = topology.node[toBeRemoved]['node-id'];

	topology.node.splice(toBeRemoved,1);
	for(var i = 0; i < topology.link.length;)
		if(topology.link[i].source['source-node'] == toBeRemovedName || topology.link[i].destination['dest-node'] == toBeRemovedName) {
			console.log('removing link #' + i);
			topology.link.splice(i, 1);
		}
		else
			i++;
};

var liveTopologyProcessing = function(){
	// pre settings
	var point = appConfig.baseNodeNumber * appConfig.aplicableMultiplicity;
	var start = point * (1 - appConfig.permissibleInterval);
	var end = point * (1 + appConfig.permissibleInterval);
	var topology = response.topology[0];
	var nodesNumber = topology.node.length;
	if(nodesNumber < start){
		addRandomNode();
	}
	else if(nodesNumber > end){
		removeRandomNode()
	}
	else{
		var currentAction = Math.floor(Math.random() * 3);
		if(currentAction == 0){
			removeRandomNode();
		}
		else{
			addRandomNode();
		}
	}

	console.log('live running ' + "current: " + response.topology[0].node.length);
};
// initialize uncontrolled changes in network topology
var liveTopologyTimer = setInterval(liveTopologyProcessing,appConfig.timeout);

server.on('request',function(req,res){
	// start live network
	if(req.url == '/start'){
		appConfig.live = true;
		res.writeHead(200,{'Access-Control-Allow-Origin': '*'});
		res.end(JSON.stringify({'command':'start','result':'ok'}));
		liveTopologyTimer = setInterval(liveTopologyProcessing,appConfig.timeout);
		console.log('live: ' + appConfig.live)
	}
	// stop live network
	else if(req.url == '/stop'){
		appConfig.live = false;
		res.writeHead(200,{'Access-Control-Allow-Origin': '*'});
		res.end(JSON.stringify({'command':'stop','result':'ok'}));
		clearInterval(liveTopologyTimer);
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


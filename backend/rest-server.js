/*
This REST server provides NeXt-compatible topology JSON. When it's running, it keeps on generating some new nodes/links, imitating real things that are going on in a real network.
Run this server PRIOR TO your NeXt app; otherwise you'll get errors.
*/

// fetch predefined topology from external module
var topology = require('./topology-data');
var topologyData = topology.response;
var liveTopologyTimer;
var http = require('http');

// app configuration
var appConfig = {
	'live': false, // turn on live network?
	'baseNodeNumber': topologyData.nodes.length,
	'aplicableMultiplicity': 5, // maximum number of host per 1 router,
	'permissibleInterval': 0.25, // (baseNodeNumber * aplicableMultiplicity) +- permissibleInterval%
	'timeout': 500, // timeout of live topology processing
	'debug': true, // debug mode (log messages)
	'port': 5555 // port to be listened to
};

// debug stuff
var debug = {
	'added': 0, // amount nodes added
	'removed': 0 // amount nodes removed
};

// create a server
var server = http.createServer();

// custom log function (for scalability)
var log = function(message){
	if(appConfig.debug)
		console.log(message);
};

// add a random node
var addRandomNode = function(){
	// new node
	var newNodeId = topologyData.nodes.length;
	topologyData.nodes.push({
		"id": newNodeId,
		"name": 'host:' + newNodeId,
		"x": Math.floor(Math.random() * 800 + 10),
		"y": Math.floor(Math.random() * 400 + 10)
	});
	// new link
	topologyData.links.push({
		// random node's id except the new one's
		"source": Math.floor(Math.random() * (newNodeId - 1)),
		"target": newNodeId
	});
	debug.added++;
};

var removeNode = function(node_id){
	if(node_id in topologyData.nodes)
		topologyData.nodes.splice(node_id,1);
};

var removeLink = function(link_id){
	if(link_id in topologyData.links)
		topologyData.links.splice(link_id,1);
};

// remove a random node from
var removeRandomNode = function(){
	// node that will be removed
	var toBeRemoved = Math.floor((Math.random() * (topologyData.nodes.length - appConfig.baseNodeNumber)) + appConfig.baseNodeNumber);
	log('removing a node #' + toBeRemoved);
	removeNode(toBeRemoved);
	for(var i = 0; i < topologyData.links.length;)
		if(topologyData.links[i].source == toBeRemoved){
			if(topologyData.links[i].target >= appConfig.baseNodeNumber)
				removeNode(topologyData.links[i].target);
			log('removing link #' + i);
			removeLink(i);
		}
		else if(topologyData.links[i].target == toBeRemoved) {
			if(topologyData.links[i].source >= appConfig.baseNodeNumber)
				removeNode(topologyData.links[i].source);
			log('removing link #' + i);
			removeLink(i);
		}
		else
			i++;
	debug.removed++;
};

// algorithm of live topology
var liveTopologyProcessing = function(){
	// pre settings
	var point = appConfig.baseNodeNumber * appConfig.aplicableMultiplicity;
	var start = point * (1 - appConfig.permissibleInterval);
	var end = point * (1 + appConfig.permissibleInterval);

	var nodesNumber = topologyData.nodes.length;
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

	log('live running ' + "current: " + topologyData.nodes.length);
};

// initialize live network
if(appConfig.live){
	liveTopologyTimer = setInterval(liveTopologyProcessing,appConfig.timeout);
	log('live started');
}

// Server API
server.on('request',function(req,res){
	// start live network
	if(req.url == '/start'){
		if(!appConfig.live) {
			appConfig.live = true;
			liveTopologyTimer = setInterval(liveTopologyProcessing, appConfig.timeout);
			log('live started');
		}
		res.writeHead(200, {'Access-Control-Allow-Origin': '*'});
		res.end(JSON.stringify({'command': 'start', 'result': 'ok'}));
	}
	// stop live network
	else if(req.url == '/stop'){
		if(appConfig.live){
			appConfig.live = false;
			clearInterval(liveTopologyTimer);
			log('live stopped');
		}
		res.writeHead(200,{'Access-Control-Allow-Origin': '*'});
		res.end(JSON.stringify({'command':'stop','result':'ok'}));
	}
	// display status
	else if(req.url == '/status'){
		res.writeHead(200,{'Access-Control-Allow-Origin': '*'});
		res.end(JSON.stringify({'command':'status','result':appConfig.live}));
		log('live: ' + appConfig.live);
	}
	// default response: topology
	else if(req.url == '/topology'){
		res.writeHead(200,{'Access-Control-Allow-Origin': '*'});
		res.end(JSON.stringify(topologyData));
		log('request for topology');
	}
});

// start listening to income connections
server.listen(appConfig.port);


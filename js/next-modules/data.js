/*
This module implements data processing
*/

// define an empty topology data object
var nodesNames = [];

// function transforms odl respond to next json format
var odl2next = function (nx,topology,data,is_init) {
	// prepare stub for results
	var topologyResult = {nodes: [], links: []};

	// processing topology
	try {
		// parsing JSON; if fails, it throws 'SyntaxError'
		data = JSON.parse(data);

		// if first time launched
		if(is_init)
			topology.data(data);
		// if launched by timer
		else {
			
		}

/*
		// go through fetched nodes' array
		nx.each(data.nodes, function (nodeData) {
			var node = topology.getNode(nodeData.id);
			// if it's an array it means the node exists and we don't need to add it
			if(typeof(node) != 'Array'){
				topology.addNode(nodeData);
			}
		});
		// go through fetched links' array
		nx.each(data.links,function(linkData){
			var link = topology.getLink(linkData.id);
			// if it's an array it means the link exists and we don't need to add it
			if(typeof(link) != 'Array'){
				topology.addLink(linkData);
			}
		});
		// go through fetched nodesets' array
		nx.each(data.nodeSet,function(nodeSetData){
			var nodeSet = topology.getLink(linkData.id);
			// if it's an array it means the link exists and we don't need to add it
			if(typeof(link) != 'Array'){
				topology.addLink(linkData);
			}
		});
		// adjust topology's size
		topology.fit();

*/


	}
	catch(SyntaxError){
		alert('JSON response with topology data is not valid.\nVerify you REST API and server-side application.');
	}
	return topologyResult;
};

// implementing an async http request
var loadJSON = function(app,topology,is_init) {
	$.ajax({
		url: "http://localhost:5555/topology",
		type: 'GET',
		contentType: 'application/json',
		// as soon as scripts receives valid result, this function will be run
		success: function (data) {
			// process ODL topology's JSON to turn it to next json
			odl2next(nx,topology,data,is_init);
		},
		// errors will never pass silently
		error: function (jqXHR, exception) {
			if (jqXHR.status === 0) {
				//alert('Not connect.\nVerify Network.');
			}
			else if (jqXHR.status == 404) {
				alert('Requested page not found. [404]');
			}
			else if (jqXHR.status == 500) {
				alert('Internal Server Error [500].');
			}
			else if (exception === 'parsererror') {
				alert('Requested JSON parse failed.');
			}
			else if (exception === 'timeout') {
				alert('Time out error.');
			}
			else if (exception === 'abort') {
				alert('Ajax request aborted.');
			}
			else {
				alert('Uncaught Error.\n' + jqXHR.responseText);
			}
		}
	});
};
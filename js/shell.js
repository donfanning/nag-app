/*
Main module that manages the topology app
 */

(function (nx) {
	// initialize a new application instance
	var app = new nx.ui.Application();
	var topologyContainer = new TopologyContainer();
	// topology instance was made in TopologyContainer, but we can invoke its members through 'topology' variable for convenience
	var topology = topologyContainer.topology();
	//assign the app to the <div>
	app.container(document.getElementById('next-app'));
	// implementing an async http request
	$.ajax({
		url: "http://198.18.1.80:8181/restconf/operational/network-topology:network-topology/topology/flow:1",
		type: 'GET',
		// we are using a static file as an example, but if real remote ODL topology is used
		// we need to set content-type to application/json to make server present data as JSON
		contentType: 'application/xml',
		// as soon as scripts receives valid result, this function will be run
		success: function (data) {
			// process ODL topology's JSON to turn it to next json
			topologyData = odl2next(data);
			// feed topology object with nodes and links...
			topology.data(topologyData);
			// ... then attach the topology to the app instance
			topology.attach(app);
		}
	});
})(nx);
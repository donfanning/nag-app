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
	loadJSON(app,topology,nx);
	topology.attach(app);
	setInterval(loadJSON,1000,app,topology,nx);

})(nx);
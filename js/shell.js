/*
Main module that manages the topology app
 */

(function (nx) {
	// initialize a new application instance
	var app = new nx.ui.Application();
	var topologyContainer = new TopologyContainer();
	// topology instance was made in TopologyContainer, but we can invoke its members through 'topology' variable for convenience
	var topology = topologyContainer.topology();
	var actionBar = new ActionBar();
	actionBar.initialize(topology);
	//assign the app to the <div>
	app.container(document.getElementById('next-app'));
	loadJSON(app,topology,nx,true);
	topology.attach(app);
	actionBar.attach(app);
	setInterval(function(){loadJSON(app,topology,nx,false)},500);
})(nx);
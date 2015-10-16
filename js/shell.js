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
		url: "http://localhost:5555",
		type: 'GET',
		contentType: 'application/json',

		// as soon as scripts receives valid result, this function will be run
		success: function (data) {
			// process ODL topology's JSON to turn it to next json
			topologyData = odl2next(data);
			// feed topology object with nodes and links...
			topology.data(topologyData);
			// ... then attach the topology to the app instance
			topology.attach(app);
		},

		// errors will never pass silently
		error: function(jqXHR, exception){
			if (jqXHR.status === 0) {
				alert('Not connect.\nVerify Network.');
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

})(nx);
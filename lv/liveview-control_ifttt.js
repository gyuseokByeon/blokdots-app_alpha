

var IFTTTmodule;
var IFTTTmodulePath = '../builtProjects/current-demo';


function startIFTTT(){

	ipcRenderer.on('startProject', function() {

		console.log('init project')

		IFTTTmodule = require(IFTTTmodulePath);
		IFTTTmodule.run();

	});


	ipcRenderer.on('stopProject', function() {

		console.log('stop')
		delete require.cache[require.resolve(IFTTTmodulePath)]

	});

}




$(document).ready(function(){
	startIFTTT();
});
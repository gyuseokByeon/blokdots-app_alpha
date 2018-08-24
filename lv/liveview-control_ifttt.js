

var IFTTTmodule;
var IFTTTmodulePath = appRootPath+'/builtProjects/current-demo';


function startIFTTT(){

	ipcRenderer.on('startProject', function() {

		console.log('init project')

		IFTTTmodule = require(IFTTTmodulePath);
		IFTTTmodule.run();

	});


	ipcRenderer.on('stopProject', function() {

		console.log('stop project');
		IFTTTmodule.stop();
		delete require.cache[require.resolve(IFTTTmodulePath)];

	});

}




$(document).ready(function(){
	startIFTTT();
});
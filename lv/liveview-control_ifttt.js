

var IFTTTmodule;
var IFTTTmodulePath = appRootPath+'/builtProjects/current-demo';


function startIFTTT(){

	ipcRenderer.on('startProject', function() {

		console.log('init project')

		IFTTTmodule = require(IFTTTmodulePath);
		IFTTTmodule.run();

		$('#slot-wrapper').addClass('project-is-running');

	});


	ipcRenderer.on('stopProject', function() {

		console.log('stop project');
		IFTTTmodule.stop();
		delete require.cache[require.resolve(IFTTTmodulePath)];

		$('#slot-wrapper').removeClass('project-is-running');

	});

}


// pin.removeListener('high', pinHighCallback);




$(document).ready(function(){
	startIFTTT();
});
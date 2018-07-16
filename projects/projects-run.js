






function projectInfo(){

	const headerDOM = $('header');

	headerDOM.on('change','.title',function(){

		var value = $(this).val();

		if( value == '' ){
			value = 'New Project';
		}

		projectTitle = value;

	});


	headerDOM.on('click','.play_btn',function(){

		var playBtnDOM = $(this);

		if( playBtnDOM.hasClass('running') ){

			stopProject();

			playBtnDOM.siblings('.run_desc').text('Run Project');

			playBtnDOM.removeClass('running');

		}else{

			runProject();

			playBtnDOM.siblings('.run_desc').text('Stop Project');

			playBtnDOM.addClass('running');
		}


	});


}


const randomVarForDisplay = "Yay";

function runProject(){

	//parseIFTTTDB();


	ipcRenderer.send('closeBoard');

	var cp = childProcess.fork("./builtProjects/test.js");
	cp.on("exit", function (code, signal) {
	    console.log("Exited", {code: code, signal: signal});
	});
	cp.on("error", console.error.bind(console));


	/*
	cp.stdout.on('data', (data) => {
	  console.log(`child stdout:\n${data}`);
	});
	*/

}

function stopProject(){

	// ipcRenderer.send('initBoard');

}







$(document).ready(function(){

	projectInfo();


});
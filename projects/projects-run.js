
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


	headerDOM.on('click','.show-live-view.btn',function(){

		ipcRenderer.send('showLiveView');

	});


}


function runProject(){

	parseIFTTTDB(function(){

		// callback
		console.log('Project runs 🏃‍♂️');

		ipcRenderer.send('startProject');

		projectIsRunningFlag = true;

	});

	

}

var projectIsRunningFlag = false;

function stopProject(){

	ipcRenderer.send('stopProject');

	projectIsRunningFlag = false;

	checkRunning();

}

// Display Error when running
function checkRunning(){

	if( projectIsRunningFlag ){
		showError( 'medium' , 'Old Project' );
	}else{
		showError( 'none' );
	}

}


function showError( level , text ){

	var errorField = $('.error_warnings');

	if( level == null || level == 'none' ){

		errorField.attr('class', 'error_warnings');
		errorField.text('');

	}else{
		errorField.text(text);
		errorField.addClass(level+'-alert');
	}

}


$(document).ready(function(){

	projectInfo();

});






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

		if( iftttDB.length > 0 ){

			var playBtnDOM = $(this);
			var hasErrors = checkErrors();

			if( playBtnDOM.hasClass('running') ){

				stopProject();

				playBtnDOM.siblings('.run_desc').text('Run Project');

				playBtnDOM.removeClass('running');

			}else{

				// if no errors
				if( !hasErrors ){

					runProject();

					playBtnDOM.siblings('.run_desc').text('Stop Project');

					playBtnDOM.addClass('running');
			
				}
			}

		}else{
			console.log('No code to run 🤷‍♀️');

			dialog.showMessageBox({
				type: 'info',
				title: 'No Code to Run',
				detail: 'You did not set up any connection yet. Build one by clicking on the big plus.'
			});
		}


	});


	headerDOM.on('click','.show-live-view.btn',function(){

		ipcRenderer.send('showLiveView');

	});

	headerDOM.on('click','.save-project.btn',function(){
		saveProject();
	});

	headerDOM.on('click','.open-project.btn',function(){
		openFile();
	});



	headerDOM.on('click','.error_warnings',function(){

		if( $(this).hasClass('show') ){
			$(this).removeClass('show');
		}else{
			$(this).addClass('show');
		}

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


var runningErrorFired = false;

// Display Error when running
function checkRunning(){

	if( projectIsRunningFlag && runningErrorFired == false ){
		addError( 'medium' , 'project edited' , 100 );
		runningErrorFired = true;
	}else{
		removeError( 'project edited' , 100 );
		runningErrorFired = false;
	}

	checkErrors();
}


var errorList = [];

function addError( level , text , code ){

/*
	var errorField = $('.error_warnings');

	if( level == null || level == 'none' ){

		errorField.attr('class', 'error_warnings');
		errorField.text('');

	}else{
		errorField.text(text);
		errorField.addClass(level+'-alert');
	}
*/
	if( level == null || text == null || code == null ){
		return;
	}

	var error = {
		'text'	: text,
		'level'	: level,
		'code'	: code
	};
	
	errorList.push( error );

	checkErrors();

	console.log( '%cError '+code + ': ' + text , 'color: '+consoleColors.alert+';' )

}

function removeError( text , code ){

	for( var i = 0 ; i < errorList.length ; i++ ){

		if( errorList[i].text == text && errorList[i].code == code ){

			errorList.splice(i, i+1);

			return;
		}
	}

}

function checkErrors(){

	var errorField = $('.error_warnings');

	if( errorList.length <= 0 ){

		errorField.attr('class', 'error_warnings');
		errorField.text('');

		return false;

	}else{

		if( errorList.length == 1 ){
			errorField.text( errorList.length + ' error' );
		}else{
			errorField.text( errorList.length + ' errors' );
		}
		
		errorField.addClass('high-alert');

		return true;
	}

}




$(document).ready(function(){

	projectInfo();

});





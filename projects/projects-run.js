






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


function runProject(){

	parseIFTTTDB();

	ipcRenderer.send('startProject');

}

function stopProject(){

	ipcRenderer.send('stopProject');

}



$(document).ready(function(){

	projectInfo();

});
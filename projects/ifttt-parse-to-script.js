

function parseIFTTTDB(){

	console.log('Do some fancy code parsing 🤖');

	// get projectname to save file
	var projectName = 'projectName';

	// Setup vars to save code
	var code = '';
	var runFunctions = '';
	var setupCode = '';
	var initBoardCode = '';

	// Include johnny 5
	setupCode+= '// Include node components\n';
	setupCode+= 'const five = require("johnny-five");\n';
	setupCode+= 'const board = new five.Board();\n';
	setupCode+= '\n// Functions -------------------------------------------\n\n '

	runFunctions+= 'board.on("ready", function() {\n\n';

	// setup all variables
	for(var i = 0; i < allSlotsProject.length; i++){

		var slotObj = allSlotsProject[i];

		if( slotObj.state != 'empty' ){

			// build new j5objects and connect them to the pins
			initBoardCode+= '\t// '+slotObj.name+'\n';
			initBoardCode+= '\tconst '+slotObj.var+' = new five.';

			switch( slotObj.comp ){

				// Inputs
				case 'Button':
				case 'Touch Sensor':
					initBoardCode+= 'Button';
				break;
				case 'Potentiometer':
				case 'Brightness Sensor':
					initBoardCode+= 'Sensor';
				break;

				// Outputs
				case 'LED':
					initBoardCode+= 'Led';
				break;
				case 'Servo Motor':
					initBoardCode+= 'Servo';
				break;
				case 'Buzzer':
					initBoardCode+= 'Piezo';
				break;
			}

			//check if integer
			if( slotObj.slot === parseInt(slotObj.slot, 10) ){
				initBoardCode+= '('+slotObj.slot+');\n';
			}else{
				initBoardCode+= '("'+slotObj.slot+'");\n';
			}

		}
	}

	// Append elements to board.ready
	runFunctions+= initBoardCode;
	runFunctions+= '\n\t// Run the functions ----------------------\n\n';

	// build IFTTT functions
	for(var i = 0; i < iftttDB.length; i++){

		// build function for IFTTT Card
		code+= '// '+iftttDB[i].title+'\n';
		code+= 'function iftttCard_'+iftttDB[i].id+'(){\n';

		for(var x = 0; x < iftttDB[i].ifttt.length; x++){

			code+= parseComponent( iftttDB[i].ifttt[x] );

		}


		// close function
		code+= '}\n\n';

		// append call to board.ready
		runFunctions+= '\tiftttCard_'+iftttDB[i].id+'();\n';
	}

	// end board ready
	runFunctions+= '});'

	// combine snippets 
	var completeCode = setupCode + code + runFunctions;

	// save code into file
	saveProjectToFile( projectName , completeCode );
}


function parseComponent( iftttObj ){

	var code = '';




	return code;
}





function saveProjectToFile( filename , code ){
	fs.writeFile(filename+'.js', code, function(err) {
	    if (err) {
	        console.log(err);
	    }
	});
}












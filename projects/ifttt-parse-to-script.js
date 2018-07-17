

function parseIFTTTDB(){

	console.log('Do some fancy code parsing 🤖');

	// get projectname to save file
	var projectName = buildVarNameString( projectTitle );

	// Setup vars to save code
	var code = '';
	var runFunctions = '';
	var setupCode = '';
	var initBoardCode = '';

	// code for demo
	var moduleCode = '';

	// Include johnny 5
	setupCode+= '// Include node components\n';
	setupCode+= 'const five = require("johnny-five");\n';
	setupCode+= 'const board = new five.Board();\n';
	setupCode+= '\n\n// Build vars for components --------- \n\n';


	// demo init
	moduleCode+= 'module.exports = {\n\trun: function(){';
	

	runFunctions+= 'board.on("ready", function() {\n\n';

	// setup all variables
	for(var i = 0; i < allSlotsProject.length; i++){

		var slotObj = allSlotsProject[i];

		if( slotObj.state != 'empty' ){

			// build new j5objects and connect them to the pins
			initBoardCode+= '\t// '+slotObj.name+';\n';
			initBoardCode+= '\t'+slotObj.var+' = new five.';

			setupCode+= 'var '+slotObj.var+';\n';

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


	setupCode+= '\n// Functions -------------------------------------------\n\n ';

	// Append elements to board.ready
	runFunctions+= initBoardCode;
	runFunctions+= '\n\t// Run the functions ----------------------\n\n';

	// build IFTTT functions
	for(var i = 0; i < iftttDB.length; i++){

		// build function for IFTTT Card
		code+= '// '+iftttDB[i].title+'\n';
		code+= 'function iftttCard_'+iftttDB[i].id+'(){\n';

		// only one ifttt atm -----------------------------------------------------------------
		//for(var x = 0; x < iftttDB[i].ifttt.length; x++){

			code+= parseComponent( iftttDB[i].ifttt );

		//}


		// close function
		code+= '}\n\n';

		// append call to board.ready
		runFunctions+= '\tiftttCard_'+iftttDB[i].id+'();\n';
		moduleCode+= '\tiftttCard_'+iftttDB[i].id+'();\n';
	}

	// end board ready
	runFunctions+= '});'
	moduleCode+= '}\n}'

	// combine snippets 
	var completeCode = setupCode + code + runFunctions;


	var fullDemoCode = code + moduleCode;

	// change var names for demo
	for(var i = 0; i < allSlotsProject.length; i++){

		let oldVarName = allSlotsProject[i].var+'.';
		let newVarName = 'slot'+allSlotsProject[i].slot+'.';
		let regex = new RegExp(oldVarName, "g");

		fullDemoCode = fullDemoCode.replace(regex, newVarName);
	}

	// save code into file -> regular js
	saveProjectToFile( projectName , completeCode );

	// save code into file -> regular js
	saveProjectToFile( 'current-demo' , fullDemoCode );
}


// need allSlotsProject for var name

function parseComponent( iftttObj ){

	var slotObjIf = findSlotObj( iftttObj.if.slot );
	
	var code = '';

	// get if condition
	code+= parseIf( iftttObj , slotObjIf ); 

	return code;
}



function parseIf( iftttObj , slotObj ){

	var code = '';
	var componentType = findComponentTypeObj( slotObj );
	var actionObj;

	for (var i = 0; i < componentType.ifttt.actions.length ; i++) {
		if( componentType.ifttt.actions[i].action == iftttObj.if.action ){

			actionObj = componentType.ifttt.actions[i];
		}
	}

	// code+= eval( 'parse_'+componentType.image_url+'( slotObj , actionObj , iftttObj )' );

	// console.log(componentType.image_url);

	code+= window[ componentType.image_url ].parse( slotObj , actionObj , iftttObj );

	return code;

}


// Will be parsed within the parseIf Fns
function parseThen( iftttObj ){

	var slotObj = findSlotObj( iftttObj.then.slot );
	var componentType = findComponentTypeObj( slotObj );

	var code = '';
	var componentType = findComponentTypeObj( slotObj );
	var reactionObj;

	for (var i = 0; i < componentType.ifttt.reactions.length ; i++) {
		if( componentType.ifttt.reactions[i].reaction == iftttObj.then.action ){

			reactionObj = componentType.ifttt.reactions[i];
		}
	}

	// code+= eval( 'parse_'+componentType.image_url+'( slotObj , reactionObj , iftttObj , true )' );

	code+= window[ componentType.image_url ].parse( slotObj , reactionObj , iftttObj , true );

	return code;

}


function saveProjectToFile( filename , code ){
	fs.writeFile('./builtProjects/'+filename+'.js', code, function(err) {
	    if (err) {
	        console.log(err);
	    }
	});
}







function parseIFTTTDB( callback ){

	console.log('Do some fancy code parsing 🤖');

	// get projectname to save file
	let projectName = buildVarNameString( projectTitle );

	// Setup vars to save code
	let code = '';
	let runFunctions = '';
	let setupCode = '';
	let initBoardCode = '';

	// code for demo
	let moduleCode = '';

	// Include johnny 5
	setupCode+= '// Include node components\n';
	setupCode+= 'const five = require("johnny-five");\n';
	setupCode+= 'const board = new five.Board();\n';
	setupCode+= '\n\n// Build vars for components --------- \n\n';


	// demo init
	moduleCode+= 'module.exports = {\n\trun: function(){\n';
	

	runFunctions+= 'board.on("ready", function() {\n\n';

	// setup all variables
	for(let i = 0; i < allSlotsProject.length; i++){

		let slotObj = allSlotsProject[i];

		let isSensor = false;

		if( slotObj.state != 'empty' ){

			// build new j5objects and connect them to the pins
			initBoardCode+= '\t// '+slotObj.name+';\n';
			initBoardCode+= '\t'+slotObj.var+' = new five.';

			setupCode+= 'var '+slotObj.var+';\n';

			switch( slotObj.comp ){

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

				// Inputs
				case 'Button':
				case 'Touch Sensor':
					initBoardCode+= 'Button';
				break;

				default: // because most elements are sensors
				case 'Potentiometer':
				case 'Brightness Sensor':

					isSensor = true; 
					initBoardCode+= 'Sensor';

				break;
			}

			// if is sensor, threshold needs to be applied 
			// to not trigger change fn that often
			if( isSensor ){

				initBoardCode+= '({\n';
					initBoardCode+= 'pin: "'+slotObj.slot+'",\n'; // sensors are always analog
					initBoardCode+= 'threshold: 5 // this value is added so the sensor does not trigger its action constantly\n';
				initBoardCode+= '});\n';

			// if no sensor, no threshold needs to be added
			}else{

				//check if integer
				if( slotObj.slot === parseInt(slotObj.slot, 10) ){
					initBoardCode+= '('+slotObj.slot+');\n';
				}else{
					initBoardCode+= '("'+slotObj.slot+'");\n';
				}

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

			code+= parseComponent( iftttDB[i] );

		//}	
			code+= '\n\t// to trigger events';
			code+= '\n\tiftttCard_'+iftttDB[i].id+'.action_'+iftttDB[i].id+' = action_'+iftttDB[i].id+';\n\n';


		// close function
		code+= '}\n\n';

		// append call to board.ready

		// if card inactive disable function
		if( iftttDB[i].active == false ){
			runFunctions+= '//';
			moduleCode+= '//';
		}

		runFunctions+= '\tiftttCard_'+iftttDB[i].id+'();\n';
		moduleCode+= '\t\tiftttCard_'+iftttDB[i].id+'();\n';
	}

	// end board ready
	runFunctions+= '});';


	// add fn to stop code from running

	moduleCode+= '\t},\n'; // end of run fn

	moduleCode+= parseIFTTTStop();

	moduleCode+='}';

	// combine snippets 
	var completeCode = setupCode + code + runFunctions;


	var fullDemoCode = code + moduleCode;

	// change var names for demo
	for(var i = 0; i < allSlotsProject.length; i++){

		let oldVarName = allSlotsProject[i].var+'\.';
		let newVarName = 'slot'+allSlotsProject[i].slot+'\.';
		let regex = new RegExp(oldVarName, "g");

		fullDemoCode = fullDemoCode.replace(regex, newVarName);
	}

	// save code into file -> regular js
	saveProjectToCode( projectName , completeCode , projectPath ); // projectPath is the path of the correct files

	// save code into file -> demo js
	saveProjectToCode( 'current-demo' , fullDemoCode , appRootPath+'/builtProjects' , callback );

}



// need allSlotsProject for var name

function parseComponent( iftttDBObj ){

	var slotObjIf = findSlotObj( iftttDBObj.ifttt.if.slot );
	
	var code = '';

	// get if condition
	code+= parseIf( iftttDBObj , slotObjIf ); 

	return code;
}



function parseIf( iftttDBObj , slotObj ){

	var code = '';
	var componentType = findComponentTypeObj( slotObj );
	var actionObj;

	for (var i = 0; i < componentType.ifttt.actions.length ; i++) {
		if( componentType.ifttt.actions[i].action == iftttDBObj.ifttt.if.action ){

			actionObj = componentType.ifttt.actions[i];
		}
	}

	// code+= eval( 'parse_'+componentType.image_url+'( slotObj , actionObj , iftttObj )' );

	// console.log(componentType.image_url);

	code+= window[ componentType.image_url ].parse( slotObj , actionObj , iftttDBObj );

	return code;

}


// Will be parsed within the parseIf Fns
function parseThen( iftttObj , ifSlotVar , callback ){

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

	code+= window[ componentType.image_url ].parse( slotObj , reactionObj , iftttObj , true , ifSlotVar );

	return code;
}



function parseIFTTTStop(){

	var code = '\tstop: function(){\n';

		for ( var i = 0 ; i < iftttDB.length ; i++ ) {

			var iftttDBObj = iftttDB[i];
			var slotObj = findSlotObj( iftttDBObj.ifttt.if.slot );
			var componentType = findComponentTypeObj( slotObj );
			var actionObj;

			for (var y = 0; y < componentType.ifttt.actions.length ; y++) {
				if( componentType.ifttt.actions[y].action == iftttDBObj.ifttt.if.action ){
					actionObj = componentType.ifttt.actions[y];
				}
			}

			code+= '\t\t'+slotObj.var+'.removeListener("'+actionObj.jhonny5+'", iftttCard_'+iftttDBObj.id+'.action_'+iftttDBObj.id+');\n';
		}

	code+= '\t}\n';

	console.log('listener removed')


	return code;
}


function saveProjectToCode( filename , code , path , callback ){

	// beautify the code to make it more readable
	code = beautify( code, { 
		"indent_size"			: 4,
		"max_preserve_newlines"	: 3
	});

	if(path){

		fs.writeFile( path+'/'+filename+'.js', code, function(err) {
		    if (err) {
		        console.error(err);
		    }else{
		    	if (callback && typeof(callback) === "function") {
					callback();
				}
	  		}
		});
	}
}





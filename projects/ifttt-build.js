



var iftttID = 0;
var iftttDB = [];
var projectTitle = 'new_project';

function getIFTTTDBIndex( theID ){

	var index = 0;

	for ( var i = 0; i < iftttDB.length; i++ ) {
		if( iftttDB[i].id == theID){
			index = i;
		}
	}

	return index;
}


function initIFTTT(){

	const container = $('#programm-container');
	var addField = '<div class="add-ifttt small"></div>';
	container.prepend( addField );

	setTimeout(function(){
		$('.add-ifttt').removeClass('small');	
	}, 10 );

	container.off('click').on('click','.add-ifttt',function(){
		buildIFTTTCard();
	});

}


function buildIFTTTCard(){

	var card = $('.add-ifttt');
	card.removeClass('add-ifttt').addClass('ifttt');

	card.attr( 'ifttt-id' , iftttID );

	var title = '<div class="title">';

			title+= '<div class="id">'+iftttID+'</div>';
			title+= '<input type="text" class="name" value="New Card '+iftttID+'"">';
			title+= '<div class="close"></div>';

		title+= '</div>';

	var m = '<div class="program">';
			m+= '<div class="if program-part">';

				//m+= '<select class="choose comp" type="component"><option>default</option></select>';
				m+= '<div class="program-part-component">';
					m+= '<div class="choose init">...</div>';
				m+= '</div>';

			m+= '</div>';
			m+= '<div class="then program-part">';

				m+= '<div class="program-part-component">';
					m+= '<div class="choose init">...</div>';
				m+= '</div>';

			m+= '</div>';
		m+= '</div>';

	card.append( title ).append(m);

	var iftttDOM = card;//.eq(iftttID);

	addChoiceListeners( iftttDOM );

	addIFTTTDBEntry();
}


function addChoiceListeners( iftttDOM ){

	iftttDOM.on('click','.choose.init',function(){

		var choiceDOM = $(this);
		var programPartComponentDOM = choiceDOM.closest('.program-part-component');

		//if( choiceDOM.hasClass('init') ){

			var type;

			if( programPartComponentDOM.find('.choice').length <= 1 ){
				type = null;
			}

			var newChoice = buildNewChoice( type );

			choiceDOM.replaceWith(newChoice);

		//}
	});

	// check again if all components are within list
	iftttDOM.on('click','.choose.component',function(){

		var choiceDOM = $(this);

		if( choiceDOM.val() != '...' ){

			updateComponentChoice( choiceDOM );

		}

	});


	// setup element when selected
	iftttDOM.on('change','.choose',function(){

		checkRunning();

		var choiceDOM = $(this);

		choiceDOM.find('.dummy').remove();

		var programPartComponentDOM = choiceDOM.closest('.program-part-component');

		var valueSelected = this.value;

		// set flag if either 'if' or 'else'
		var ifFlag = programPartComponentDOM.closest('.program-part').hasClass('if');
		
		if( choiceDOM.hasClass('integer') == false ){

			choiceDOM.nextAll().remove();

		}

		// update steps 
		programPartComponentDOM.attr( 'step' , programPartComponentDOM.find('.choose').length );

		if( choiceDOM.hasClass('actions') ){
			programPartComponentDOM.attr('action',valueSelected);
		}else if( choiceDOM.hasClass('reactions') ){
			programPartComponentDOM.attr('reaction',valueSelected);
		}

		if( choiceDOM.hasClass('component') ){

			if( ifFlag ){
				programPartComponentDOM.append( addFiller( 'is' ) );
			}else{
				programPartComponentDOM.append( addFiller( 'should' ) );
			}
			
			var slotObj;
			for(var i = 0; i < allSlotsProject.length; i++){
				var curr = allSlotsProject[i];
				if(curr.name == valueSelected ){
					slotObj = curr;
				}
			}

			programPartComponentDOM.attr('component-type',slotObj.comp).attr('slot',slotObj.slot);

			var newChoice;
			if( ifFlag ){
				newChoice = buildNewChoice( 'actions' , findComponentTypeObj(slotObj) );
			}else{
				newChoice = buildNewChoice( 'reactions' , findComponentTypeObj(slotObj) );
			}
			programPartComponentDOM.append(newChoice);

		}else{

			var action, reaction;
			if( ifFlag ){
				action = programPartComponentDOM.attr( 'action' );
			}else{
				reaction = programPartComponentDOM.attr( 'reaction' );
			}
			var parameter; // = componentList[0].ifttt.actions[0].parameters[0];

			var step = parseInt(programPartComponentDOM.attr( 'step' ));
			var allSteps;

			var componentTypeObject = findComponentTypeObj( null , programPartComponentDOM.attr( 'component-type' ) );
			var currComponentTypeObject;


			if( ifFlag ){
				// get correct parameter action from list
				for(var i = 0; i < componentList.length; i++){
					if( componentList[i].component == componentTypeObject.component ){

						currComponentTypeObject = componentList[i];

						for(var y = 0; y < currComponentTypeObject.ifttt.actions.length; y++){
							if( currComponentTypeObject.ifttt.actions[y].action == action ){

								allSteps = currComponentTypeObject.ifttt.actions[y].parameters.length+1;
								parameter = currComponentTypeObject.ifttt.actions[y].parameters[step-2]; // -2 because of component and action
							}
						}
					}
				}
			}else{
				for(var i = 0; i < componentList.length; i++){
					if( componentList[i].component == componentTypeObject.component ){

						currComponentTypeObject = componentList[i];

						for(var y = 0; y < currComponentTypeObject.ifttt.reactions.length; y++){
							if( currComponentTypeObject.ifttt.reactions[y].reaction == reaction ){

								allSteps = currComponentTypeObject.ifttt.reactions[y].parameters.length+1;
								parameter = currComponentTypeObject.ifttt.reactions[y].parameters[step-2]; // -2 because of component and action
							}
						}
					}
				}
			}

			// if all steps are done -> new init
			if( step <= allSteps ){
				programPartComponentDOM.append( addFiller( parameter.filler ) );
				programPartComponentDOM.append( buildNewChoice( parameter.option ) );

				if( parameter.option == 'integer' ){
					programPartComponentDOM.find('.integer').trigger('change').val(1);
				}
			}else{
				programPartComponentDOM.attr('progress','done')
				console.log('new init')
			}
		}


		var allParts = iftttDOM.find('.program-part-component').length;
		var allPartsCheck = 0;
		iftttDOM.find('.program-part-component').each(function(){
			if( $(this).attr('progress') == 'done' ){
				allPartsCheck++;
			}
		});

		if (  allPartsCheck == allParts ) {
			IFTTTCardDone( iftttDOM );
		}

	});


	// Change Name within iftttDB
	iftttDOM.on('change','.title .name',function(){

		var currIftttID = parseInt( iftttDOM.attr('ifttt-id') );
		var value = $(this).val();

		if( value == '' ){
			value = 'Card '+currIftttID;
		}

		var dbIndex = getIFTTTDBIndex( currIftttID )

		iftttDB[ dbIndex ].title = value;

	});

	// Change Name within iftttDB
	iftttDOM.on('click','.title .close',function(){
		deleteIFTTT( iftttDOM );
	});

}


function buildNewChoice( type , componentTypeObj ){

	var choiceType = type;
	var options = type;

	switch( type ){
		case 'actions':
		case 'reactions':
			choiceType = 'string';
		break;
		case 'value':
			choiceType = 'integer';
		break;
		case null:
			choiceType = 'component';
			type = 'component';
		break;
	}


	if( Array.isArray(options) ){
		choiceType = 'string';
		type = 'string';
	}

	var choiceMarkup = '<select class="choose '+choiceType+' '+type+'" type="'+choiceType+'">'; // 
		choiceMarkup+= '<option disabled selected="selected" class="dummy">...</option>';

	switch( type ){
		case 'component':
			
			/*
			for(var i = 0; i < allSlotsProject.length; i++){
				var componentType = allSlotsProject[i].comp;
				if( componentType ){
					choiceMarkup+= '<option slotID="'+allSlotsProject[i].slot+'">'+componentType+'</option>';
				}
			}
			*/

			// build trhough updateComponentChoice( choiceDOM );

		break;
		case 'actions':

			for(var i = 0; i < componentTypeObj.ifttt.actions.length; i++){
				choiceMarkup+= '<option>'+componentTypeObj.ifttt.actions[i].action+'</option>';
			}

		break;
		case 'reactions':

			for(var i = 0; i < componentTypeObj.ifttt.reactions.length; i++){

				console.log( componentTypeObj.ifttt.reactions[i].pwm )

				/*
				// Only allow pwm values if sensor is also pwm
				if( componentTypeObj.ifttt.reactions[i].pwm == true ){



				}else{
					*/

					choiceMarkup+= '<option>'+componentTypeObj.ifttt.reactions[i].reaction+'</option>';
				//}
			}

		break;
		case 'string':

			for(var i = 0; i < options.length; i++){
				choiceMarkup+= '<option>'+options[i]+'</option>';
			}

		break;
		case 'integer':

			/*
			for(var i = 0; i < 10; i++){
				choiceMarkup+= '<option>'+i+'</option>';
			}
			*/

		break;
	}


		choiceMarkup+= '</select>';


	// Build different Markup for integer Values
	if( type == 'integer' ){
		choiceMarkup = '<input class="choose '+choiceType+' '+type+'" type="number" value="1" min="1" step="1">';
	}

	return choiceMarkup;

}


function updateComponentChoice( choiceDOM ){

	var thenFlag = choiceDOM.closest('.program-part').hasClass('then');


	for(var i = 0; i < allSlotsProject.length; i++){
		

		// var componentType = allSlotsProject[i].comp;
		var componentName = allSlotsProject[i].name;
		var projectSlot = allSlotsProject[i].slot;

		// only list output in "then" part
		if ( thenFlag ) {
			if( allSlotsProject[i].dir == 'in' ){
				componentName = null;
			}
		}

		if( componentName ){

			var alreadyInFlag = false;
			// var notInUseAnymoreFlag = false;
			
			// check if already in options
			choiceDOM.find('option').each(function(){

				var optionSlot = $(this).attr('slotID');

				if( projectSlot == optionSlot ){
					alreadyInFlag = true;
				}

			});

			// if not there append new option
			if( alreadyInFlag == false ){
				var choiceMarkup = '<option slotID="'+allSlotsProject[i].slot+'">'+componentName+'</option>';
				choiceDOM.append(choiceMarkup);
			}	
		}else{

			// remove old ones
			choiceDOM.find('option').each(function(){
				var optionSlot = $(this).attr('slotID');
				if( projectSlot == optionSlot ){
					$(this).remove();
				}

			});
		}
	}
}


function addFiller( filler ){

	if( filler ){

		var fillerMarkup = '<div class="filler">';
			
		fillerMarkup+= filler;

		fillerMarkup += '</div>';

		return fillerMarkup;
	
	}
}


function addIFTTTDBEntry(){

	iftttDB[ iftttDB.length ] = {
      'id'  	: iftttID,
      'title'	: 'New Card'
    }

	iftttID++;
}

Array.prototype.clean = function(deleteValue) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == deleteValue) {         
			this.splice(i, 1);
			i--;
		}
	}
	return this;
};

function deleteIFTTT( iftttDOM ){

	var thisID = parseInt( iftttDOM.attr('ifttt-id') ); 

	var dbIndex = getIFTTTDBIndex( thisID );

	iftttDB.splice(dbIndex, 1);

	iftttDB.clean(null);
	iftttDOM.remove();

	if( $('.add-ifttt').length <= 0 ){
		initIFTTT();
	}

}


function IFTTTCardDone( iftttDOM ){
	// parse html to json
	parseIFTTTCard( iftttDOM );

	// parse json to js
	// parseIFTTTDB();

	// add new card
	if( $('.add-ifttt').length <= 0 ){
		initIFTTT();
	}
}

// parse html into json obj
function parseIFTTTCard( iftttDOM ){



	var iftttID = parseInt( iftttDOM.attr('ifttt-id') );

	var ifDOM = iftttDOM.find('.if').find('.program-part-component');
	var thenDOM = iftttDOM.find('.then').find('.program-part-component')

	var action = ifDOM.attr('action');

	var ifSlotID = ifDOM.attr('slot');
	if ( $.isNumeric( ifSlotID ) ){
		ifSlotID = parseInt(ifSlotID);
	}

	var ifComponent = ifDOM.attr('component-type');

	var ifComponentTypeObj = findComponentTypeObj( null , ifComponent );

	var reaction = thenDOM.attr('reaction');

	var thenSlotID = thenDOM.attr('slot');
	if ( $.isNumeric( thenSlotID ) ){
		thenSlotID = parseInt(thenSlotID);
	}
	
	var thenComponent = thenDOM.attr('component-type');

	var thenComponentTypeObj = findComponentTypeObj( null , thenComponent );

	var dbIndex = getIFTTTDBIndex( iftttID );

	var db = iftttDB[dbIndex];

	db.ifttt = {
		'if' 	: {
			'slot' : ifSlotID,
			'component' : ifComponent,
			'action' : action,
			'parameters' : []
		},
		'then'	: {
			'slot' : thenSlotID,
			'component' : thenComponent,
			'action' : reaction,
			'parameters' : []
		}
	}

	// add the values (if)
	for(var y = 0; y < ifComponentTypeObj.ifttt.actions.length; y++){
		if( ifComponentTypeObj.ifttt.actions[y].action == action ){

			for( var i = 0; i < ifComponentTypeObj.ifttt.actions[y].parameters.length; i++ ){

				var chooseDOM = ifDOM.find('.choose').eq(i+2);
				var value = chooseDOM.val();

				if ( chooseDOM.hasClass('integer') ) {
					value = parseInt( value );
				}
				db.ifttt.if.parameters[i] = {
					'value' : value
				}

			}
		}
	}

	// add the values (then))
	for(var y = 0; y < thenComponentTypeObj.ifttt.reactions.length; y++){
		if( thenComponentTypeObj.ifttt.reactions[y].reaction == reaction ){

			for( var i = 0; i < thenComponentTypeObj.ifttt.reactions[y].parameters.length; i++ ){

				var chooseDOM = thenDOM.find('.choose').eq(i+2);
				var value = chooseDOM.val();

				if ( chooseDOM.hasClass('integer') ) {
					value = parseInt( value );
				}
				db.ifttt.then.parameters[i] = {
					'value' : value
				}

			}
		}
	}
}



$(document).ready(function(){

	initIFTTT();

});
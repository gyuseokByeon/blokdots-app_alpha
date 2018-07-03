
const fs = require('fs');


var iftttID = 0;
var iftttDB = [];

function initIFTTT(){

	const container = $('#programm-container');
	var addField = '<div class="add-ifttt"></div>';
	container.append( addField );


	container.on('click','.add-ifttt',function(){
		buildIFTTTCard();
	});

}


function buildIFTTTCard(){

	const card = $('.add-ifttt');
	card.removeClass('add-ifttt').addClass('ifttt');

	card.attr( 'ifttt-id' , iftttID );

	var title = '<div class="title">';

			title+= '<div class="id">'+iftttID+'</div>';
			title+= '<div class="name">New Card</div>';

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

	var iftttDOM = $('.ifttt').eq(iftttID);

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

	iftttDOM.on('change','.choose',function(){

		var choiceDOM = $(this);
		var programPartComponentDOM = choiceDOM.closest('.program-part-component');

		var valueSelected = this.value;

		//choiceDOM.find('option').attr('selected','');
		//choiceDOM.find('option:contains('+valueSelected+')').attr('selected','selected');

		choiceDOM.nextAll().remove();

		programPartComponentDOM.attr( 'step' , programPartComponentDOM.find('.choose').length );

		if( choiceDOM.hasClass('actions') ){
			programPartComponentDOM.attr('action',valueSelected)
		}

		if( choiceDOM.hasClass('component') ){

			programPartComponentDOM.append( addFiller( 'is' ) );

			var slotObj;
			

			for(var i = 0; i < allSlotsProject.length; i++){
				var curr = allSlotsProject[i];
				if(curr.comp == valueSelected ){
					slotObj = curr;
				}
			}

			programPartComponentDOM.attr('component-type',slotObj.comp).attr('slot',slotObj.slot);;

			var newChoice = buildNewChoice( 'actions' , findComponentTypeObj(slotObj) );
			programPartComponentDOM.append(newChoice);

		}else{

			var componentTypeObject = findComponentTypeObj( null , programPartComponentDOM.attr( 'component-type' ) );

			var step = parseInt(programPartComponentDOM.attr( 'step' ));
			var action = programPartComponentDOM.attr( 'action' );
			var parameter; // = componentList[0].ifttt.actions[0].parameters[0];

			// get correct parameter action from list
			for(var i = 0; i < componentList.length; i++){
				if( componentList[i].component == componentTypeObject.component ){

					for(var y = 0; y < componentList[i].ifttt.actions.length; y++){

						if( componentList[i].ifttt.actions[y].action == action ){

							parameter = componentList[i].ifttt.actions[y].parameters[step-2]; // -2 because of component and action
						}
					}
				}
			}

			programPartComponentDOM.append( addFiller( parameter.filler ) );
			programPartComponentDOM.append( buildNewChoice( parameter.option ) );


		}

	});
}


function buildNewChoice( type , componentTypeObj ){

	var choiceType = type;
	var options = type;

	switch( type ){
		case 'actions':
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
		choiceMarkup+= '<option disabled selected="selected">...</option>';

	switch( type ){
		case 'component':
			for(var i = 0; i < allSlotsProject.length; i++){
				var componentType = allSlotsProject[i].comp;
				if( componentType ){
					choiceMarkup+= '<option slotID="'+allSlotsProject[i].slot+'">'+componentType+'</option>';
				}
			}
		break;
		case 'actions':

			for(var i = 0; i < componentTypeObj.ifttt.actions.length; i++){
				choiceMarkup+= '<option>'+componentTypeObj.ifttt.actions[i].action+'</option>';
			}

		break;
		case 'string':

			for(var i = 0; i < options.length; i++){
				choiceMarkup+= '<option>'+options[i]+'</option>';
			}

		break;
		case 'integer':

			for(var i = 0; i < 10; i++){
				choiceMarkup+= '<option>'+i+'</option>';
			}

		break;
	}


		choiceMarkup+= '</select>';

	return choiceMarkup;

}


function addFiller( filler ){

	if( filler ){

	var fillerMarkup = '<div class="filler">';
		

	//if( filler != undefined ){

		fillerMarkup+= filler;
		
		/*
		var componentTypeObject = findComponentTypeObj( null , compType );
		var action = programPartComponentDOM.attr('action');

		for(var i = 0; i < componentList.length; i++){
			if( componentList[i].component == componentTypeObject ){


				for(var y = 0; y < componentList[i].ifttt.actions.length; y++){

					if( componentList[i].ifttt.actions[y] == action ){

						fillerMarkup += componentList[i].ifttt.actions[y].parameters.filler;
					}
				}
			}
		}
		*/

	//}
	/*
	else{
		fillerMarkup += 'is';
	}
	*/

	fillerMarkup += '</div>';

	return fillerMarkup;
	
	}
}


function addIFTTTDBEntry(){

	iftttDB[ iftttID ] = {
      'id'  	: iftttID
    }

	iftttID++;
}




function saveProjectToFile(){
	fs.writeFile("test.txt", iftttDB, function(err) {
	    if (err) {
	        console.log(err);
	    }
	});
}


$(document).ready(function(){

	initIFTTT();

});

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

		choiceDOM.nextAll().remove();

		if( choiceDOM.hasClass('actions') ){
			programPartComponentDOM.attr('action',valueSelected)
		}

		if( choiceDOM.hasClass('component') ){

			programPartComponentDOM.append( addFiller( ) );

			var slotNum = choiceDOM.children(":selected").attr("slotID");
			var slotObj = findSlotObj( findSlotDOM( slotNum ) );

			programPartComponentDOM.attr('component-type',slotObj.component);

			var newChoice = buildNewChoice( 'actions' , findComponentTypeObj(slotObj) );
			programPartComponentDOM.append(newChoice);

		}else{
/*

			## some weird shit 
			## redo code
			

			programPartComponentDOM.append( addFiller( programPartComponentDOM.attr('component-type') ) );

			var step = parseInt(programPartComponentDOM.attr( 'step' ));

			var arr = ['value','unit']

			programPartComponentDOM.append( buildNewChoice( arr[step] ) );
*/
		}

		programPartComponentDOM.attr( 'step' , programPartComponentDOM.find('.choice').length );

	});
}


function buildNewChoice( type , componentTypeObj ){

	var choiceType = type;

	switch( type ){
		case 'actions':
		case 'unit':
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

	var choiceMarkup = '<select class="choose '+choiceType+' '+type+'" type="'+choiceType+'">';
		choiceMarkup+= '<option disabled selected value>...</option>';

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
	}


		choiceMarkup+= '</select>';

	return choiceMarkup;

}


function addFiller( compType ){

	var fillerMarkup = '<div class="filler">';
		

	if( compType ){

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
	}else{
		fillerMarkup += 'is';
	}

	fillerMarkup += '</div>';

	return fillerMarkup;
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
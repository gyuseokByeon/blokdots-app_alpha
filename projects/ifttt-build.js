
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
			m+= '<div class="if">';

				//m+= '<select class="choose comp" type="component"><option>default</option></select>';

			m+= '</div>';
			m+= '<div class="then">';

			m+= '</div>';
		m+= '</div>';

	card.append( title ).append(m);

	var iftttDOM = $('.ifttt').eq(iftttID);

	addIFTTTChoiceSelection( iftttDOM , 'if' );

	IFTTTChoiceOnClick( iftttDOM );

	addIFTTTDBEntry();
}


function addIFTTTDBEntry(){

	iftttDB[ iftttID ] = {
      'id'  	: iftttID
    }

	iftttID++;
}


function addIFTTTChoiceSelection( iftttDOM , location , type ){

	var choiceMarkup;

	if( type ){

		choiceMarkup = '<select class="choose '+type+'" type="'+type+'">';

		switch( type ){

			case 'component':

				for(var i = 0; i < allSlotsProject.length; i++){

					var componentType = allSlotsProject[i].comp;

					if( componentType ){
						choiceMarkup+= '<option slotID="'+allSlotsProject[i].slot+'">'+componentType+'</option>';
					}
				}


			break;
			case 'integer':

			break;
			case 'string':

			break;

			default: 



			break;
		}

		choiceMarkup+= '</select>';
	}else{

		choiceMarkup = '<div class="choose init">...</div>';

	}




	iftttDOM.find('.'+location).append( choiceMarkup );

}


function IFTTTChoiceOnClick( iftttDOM ){

	iftttDOM.on('click','.choose',function(){

		var chooseDOM = $(this);

		if( chooseDOM.hasClass('init') ){
			
		}


	});

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
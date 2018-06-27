
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

				m+= '<select class="choose comp"><option>default</option></select>';

			m+= '</div>';
			m+= '<div class="then">';

			m+= '</div>';
		m+= '</div>';

	card.append( title ).append(m);


	addIFTTTentry();
}


function addIFTTTentry(){

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
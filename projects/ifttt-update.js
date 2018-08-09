



function updateProject(){


	// update Title
	$('header .title').val( projectTitle );


	// update Slots

	for( var i = 0 ; i < allSlotsProject.length ; i++ ){

		var slot = allSlotsProject[i];

		if( slot.state == 'connected' ){

			slotState( $('.slot').eq(i) , 'quickSetup' , slot );

			slotState( $('.slot').eq(i) , 'connected' , slot );

			// compare with live view -> reset state
		}

	}


	// update Cards
	for( var i = 0 ; i < iftttDB.length ; i++ ){

		let single = iftttDB[i];

		if( i == iftttDB.length-1 ){
			iftttID = parseInt( single.id ) + 1;
		}

		initIFTTT();



		// build cards and connect with slots

	}

}





function checkCardStates( slotNum , state ){

	for( var i = 0; i < iftttDB.length ; i++ ){
	
		if ( 
				 ( iftttDB[i].ifttt.if.slot   == slotNum )
			  || ( iftttDB[i].ifttt.then.slot == slotNum )
			){
		
				var iftttDOM = findIftttDOM( iftttDB[i].id );

				iftttDOM.addClass(state);
		
			}
	}

}

























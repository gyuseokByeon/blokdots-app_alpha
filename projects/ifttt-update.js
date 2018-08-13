




// allSlotsLV check with this var what is connected


function updateProject(){


	// update Title
	$('header .title').val( projectTitle );


	// reset slots
	$('.slot').each(function(){

		slotState( $(this) , 'empty' );
		
	});

	// update Slots
	for( var i = 0 ; i < allSlotsProject.length ; i++ ){

		var slot = allSlotsProject[i];
		var slotLV = allSlotsLV[i];

		if( slot.state == 'connected' ){

			// needed to get all information correctly
			slotState( $('.slot').eq(i) , 'quickSetup' , slot );
			slotState( $('.slot').eq(i) , 'connected' , slot );

			// if no component ergo missing 
			if( slotLV.comp == null ){
				slotState( $('.slot').eq(i) , 'missing' , slot );
			// if wrong component or no component
			}else if( slotLV.comp != slot.comp ){
				slotState( $('.slot').eq(i) , 'wrong' , slot );

				
			}
		}
	}


	// update Cards
	for( var i = 0 ; i < iftttDB.length ; i++ ){

		let single = iftttDB[i];

		if( i == iftttDB.length-1 ){
			iftttID = parseInt( single.id ) + 1;
		}

		//initIFTTT();

		buildCardFromDB( single );

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






function buildCardFromDB( iftttEl ){

	// See original at buildIFTTTCard() -> ifttt-build.js

	var activeFlag = iftttEl.active;
	var offClass = 'inactive';
	var toggleOff = 'off';

	if( activeFlag != false ){
		offClass = null;
		toggleOff = null;
	}

	var card = '<div class="ifttt last-built '+offClass+'" ifttt-id="'+iftttEl.id+'">';

	var title = '<div class="title">';

			title+= '<div class="id">'+iftttEl.id+'</div>';
			title+= '<input type="text" class="name" value="'+iftttEl.title+'"">';
			title+= '<div class="close"></div>';

			title+= '<div class="toggler '+toggleOff+'">';
				title+= '<div class="knob"></div>';
			title+= '</div>';

		title+= '</div>';

		card = card.concat(title);

	var m = '<div class="program">';
			m+= '<div class="if program-part">';

				m+= '<div class="program-part-component" component-type="'+iftttEl.ifttt.if.component+'" slot="'+iftttEl.ifttt.if.slot+'" action="'+iftttEl.ifttt.if.action+'" progress="done">';
					
					m+= parseChoices( iftttEl , 'if' );

				m+= '</div>';

			m+= '</div>';
			m+= '<div class="then program-part">';

				m+= '<div class="program-part-component">';
					
					m+= parseChoices( iftttEl , 'then' );

				m+= '</div>';

			m+= '</div>';
		m+= '</div>';

		card = card.concat(m);

		card+= '</div>';


	$('#programm-container').append( card );


	addChoiceListeners( $('.last-built') );

	$('.last-built').removeClass('last-built');







	function parseChoices( iftttEl , dir ){


		let choices = "";


		if( dir == 'if' ){

			let compTypeObj = findComponentTypeObj( null , iftttEl.ifttt.if.component );
			let componentName = iftttEl.ifttt.if.component; // get name from db?

			// append component selection
			choices+= '<select class="choose component" type="component">';
				choices+= '<option slotID="'+iftttEl.ifttt.if.slot+'">'+componentName+'</option>'; 
			choices+= '</select>';

			choices+= addFiller( 'is' );

			// append action selection
			choices+= buildNewChoice( 'actions' , compTypeObj , iftttEl.ifttt.if.slot , iftttEl.ifttt.if.action );

			// append params selection
			for( var i = 0 ; i < iftttEl.ifttt.if.parameters.length ; i++ ){

				let paramEl = iftttEl.ifttt.if.parameters[i];
				let parameter;

				for(var y = 0; y < compTypeObj.ifttt.actions.length; y++){
					if( compTypeObj.ifttt.actions[y].action == iftttEl.ifttt.if.action ){

						parameter = compTypeObj.ifttt.actions[y].parameters[i];
					}
				}

				if( parameter.filler ){
					choices+= addFiller( parameter.filler );
				}

				choices+= buildNewChoice( parameter.option , compTypeObj , iftttEl.ifttt.if.slot , paramEl.value );
			}

		}else{

			let compTypeObj = findComponentTypeObj( null , iftttEl.ifttt.then.component );
			let componentName = iftttEl.ifttt.then.component; // get name from db?

			// append component selection
			choices+= '<select class="choose component" type="component">';
				choices+= '<option slotID="'+iftttEl.ifttt.then.slot+'">'+componentName+'</option>'; 
			choices+= '</select>';

			choices+= addFiller( 'should' );

			// append action selection
			choices+= buildNewChoice( 'reactions' , compTypeObj , iftttEl.ifttt.then.slot , iftttEl.ifttt.then.action );

			console.log( iftttEl.ifttt.then.action )

			// append params selection
			for( var i = 0 ; i < iftttEl.ifttt.then.parameters.length ; i++ ){

				let paramEl = iftttEl.ifttt.then.parameters[i];
				let parameter;

				for(var y = 0; y < compTypeObj.ifttt.reactions.length; y++){
					if( compTypeObj.ifttt.reactions[y].reaction == iftttEl.ifttt.then.action ){

						parameter = compTypeObj.ifttt.reactions[y].parameters[i];
					}
				}

				if( parameter.filler ){
					choices+= addFiller( parameter.filler );
				}

				choices+= buildNewChoice( parameter.option , compTypeObj , iftttEl.ifttt.then.slot , paramEl.value );
			}


		}


		return choices;


	}

}

























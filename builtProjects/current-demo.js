// New Card
function iftttCard_0(){
	// counter for times pressed / released
	var i = 0;
	slot2.on("up", action_0 );

	function action_0(){
		i++;
		if( i == 2 ){
			slot3.off();
			// Reset counter
			i = 0;
		}
	}

	// to trigger events
	iftttCard_0.action_0 = action_0;

}

// sdafgasga
function iftttCard_1(){
		// set new variable for the selected unit (degrees)
		var sensorValue = 0;

	slotA0.on("change", action_1 );

	function action_1(){
			var position = parseInt( (slotA0.value / 1024 ) * 180 ); 
slot5.to(position);
	}

	// to trigger events
	iftttCard_1.action_1 = action_1;

}

// New Card
function iftttCard_2(){
	// counter for times pressed / released
	var i = 0;
	slot2.on("down", action_2 );

	function action_2(){
		i++;
		if( i == 2 ){
			slot3.pulse(700);setTimeout(function(){
	slot3.stop();
}, 60000);
			// Reset counter
			i = 0;
		}
	}

	// to trigger events
	iftttCard_2.action_2 = action_2;

}

module.exports = {
	run: function(){
		iftttCard_0();
		iftttCard_1();
		iftttCard_2();
	},
	stop: function(){
		slot2.removeListener("up", iftttCard_0.action_0);
		slotA0.removeListener("change", iftttCard_1.action_1);
		slot2.removeListener("down", iftttCard_2.action_2);
	}
}
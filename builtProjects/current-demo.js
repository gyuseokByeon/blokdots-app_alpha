// New Card
function iftttCard_0(){
	// counter for times pressed / released
	var i = 0;
	slot2.on("down", action_0 );

	function action_0(){
		i++;
		if( i == 1 ){
			slot3.pulse(700);setTimeout(function(){
	slot3.stop();
}, 60000);
			// Reset counter
			i = 0;
		}
	}

	// to trigger events
	iftttCard_0.action_0 = action_0;

}

// New Card
function iftttCard_2(){
	// counter for times pressed / released
	var i = 0;
	slot2.on("down", action_2 );

	function action_2(){
		i++;
		if( i == 3 ){
			slot3.off();
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
		iftttCard_2();
	},
	stop: function(){
		slot2.removeListener("down", iftttCard_0.action_0);
		slot2.removeListener("down", iftttCard_2.action_2);
	}
}
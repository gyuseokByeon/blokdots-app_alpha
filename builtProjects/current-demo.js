// New Card
function iftttCard_0(){
		// set new variable for the selected unit (degrees)
		var sensorValue = 0;

	slotA0.on("change", function(){
		sensorValue = 100 * ( this.value / 1023 );
		if( sensorValue > 50 ){
			slot5.on();		}
	});
}

// New Card
function iftttCard_1(){
		// set new variable for the selected unit (degrees)
		var sensorValue = 0;

	slotA0.on("change", function(){
		sensorValue = 100 * ( this.value / 1023 );
		if( sensorValue < 60 ){
			slot5.off();		}
	});
}

module.exports = {
	run: function(){
		iftttCard_0();
		iftttCard_1();
	}
}
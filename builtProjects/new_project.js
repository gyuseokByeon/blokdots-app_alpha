// Include node components
const five = require("johnny-five");
const board = new five.Board();


// Build vars for components --------- 

var led;
var potentiometer;

// Functions -------------------------------------------

 // New Card
function iftttCard_0(){
		// set new variable for the selected unit (degrees)
		var sensorValue = 0;

	potentiometer.on("change", function(){
		sensorValue = 100 * ( this.value / 1023 );
		if( sensorValue > 50 ){
			led.on();		}
	});
}

// New Card
function iftttCard_1(){
		// set new variable for the selected unit (degrees)
		var sensorValue = 0;

	potentiometer.on("change", function(){
		sensorValue = 100 * ( this.value / 1023 );
		if( sensorValue < 60 ){
			led.off();		}
	});
}

board.on("ready", function() {

	// LED;
	led = new five.Led(5);
	// Potentiometer;
	potentiometer = new five.Sensor("A0");

	// Run the functions ----------------------

	iftttCard_0();
	iftttCard_1();
});
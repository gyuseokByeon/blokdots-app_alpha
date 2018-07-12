// Include node components
const five = require("johnny-five");
const board = new five.Board();


// Build vars for components --------- 

var button
var touch_sensor
var led

// Functions -------------------------------------------

 // New Card
function iftttCard_0(){
	// counter for times pressed / released
	var i = 0;
	button.on("up", function(){
		if( i === 3 ){
			led.on();		}
		i++;
	});
}

board.on("ready", function() {

	// Button;
	button = new five.Button(2);
	// Touch Sensor;
	touch_sensor = new five.Button(3);
	// LED;
	led = new five.Led(4);

	// Run the functions ----------------------

	iftttCard_0();
});
// Include node components
const five = require("johnny-five");
const board = new five.Board();


// Build vars for components --------- 

var button;
var led;

// Functions -------------------------------------------

 // New Card
function iftttCard_0(){
	// counter for times pressed / released
	var i = 0;
	button.on("down", function(){
		i++;
		if( i == 2 ){
			led.on();			// Reset counter
			i = 0;
			console.log("undefined");
		}
	});
}

// New Card
function iftttCard_1(){
	// counter for times pressed / released
	var i = 0;
	button.on("down", function(){
		i++;
		if( i == 3 ){
			led.off();			// Reset counter
			i = 0;
			console.log("undefined");
		}
	});
}

board.on("ready", function() {

	// Button;
	button = new five.Button(2);
	// LED;
	led = new five.Led(3);

	// Run the functions ----------------------

	iftttCard_0();
	iftttCard_1();
});
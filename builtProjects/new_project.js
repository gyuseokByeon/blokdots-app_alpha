// Include node components
const five = require("johnny-five");
const board = new five.Board();


// Build vars for components --------- 

var button
var led

// Functions -------------------------------------------

 // New Card
function iftttCard_0(){
	// counter for times pressed / released
	var i = 0;
	button.on("up", function(){
		if( i === 1 ){
			led.on();		}
		i++;
	});
}

// New Card
function iftttCard_1(){
	// counter for times pressed / released
	var i = 0;
	button.on("down", function(){
		if( i === 1 ){
			led.off();		}
		i++;
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
// Include node components
const five = require("johnny-five");
const board = new five.Board();


// Build vars for components --------- 

var button_1
var led

// Functions -------------------------------------------

 // New Card
function iftttCard_0(){
	// counter for times pressed / released
	var i = 0;
	button_1.on("down", function(){
		if( i === 3 ){
			led.on();		}
		i++;
	});
}

board.on("ready", function() {

	// Button 1;
	button_1 = new five.Button(2);
	// LED;
	led = new five.Led(3);

	// Run the functions ----------------------

	iftttCard_0();
});
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
	button.on("down", action_0 );

	function action_0(){
		i++;
		if( i == 1 ){
			led.toggle();
			// Reset counter
			i = 0;
		}
	}

	// to trigger events
	iftttCard_0.action_0 = action_0;

}

board.on("ready", function() {

	// Button;
	button = new five.Button(2);
	// LED;
	led = new five.Led(3);

	// Run the functions ----------------------

	iftttCard_0();
});
// Include node components
const five = require("johnny-five");
const board = new five.Board();

// Functions -------------------------------------------

 // New Card
function iftttCard_0(){
}

board.on("ready", function() {

	// Button
	const slot2 = new five.Button(2);
	// LED
	const slot3 = new five.Led(3);

	// Run the functions ----------------------

	iftttCard_0();
});
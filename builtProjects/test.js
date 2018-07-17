/*
var five = require("johnny-five");
var board = new five.Board({
  repl: false,
  debug: false,
});


console.log('\x1b[32m%s\x1b[0m','-> Start IFTTT Prototype 🎚 🎛 🕹');

board.on("ready", function() {

  console.log( "It's running!! 🏃‍♂️" );

  var led = new five.Led(2);
  led.blink(500);

});
*/



function iftttCard_0(){
	/*var i = 0;
	slot2.on("down", function(){
		if( i === 3 ){
			slot3.on();		
		}
		i++;
	});
	*/

	console.log(slot2)

	console.log('run')
	slot2.blink(500);

}



module.exports = {
  // Parse function for IFTTT
  run: function(){
  	iftttCard_0();
  }
}

















// Test file to check child subprocess


//console.log( "It's running!! 🏃‍♂️" );
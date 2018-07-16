var five = require("johnny-five");
var board = new five.Board({
  repl: false,
  debug: false,
});

board.on("ready", function() {
  // it's very quiet in here now!

  console.log( "It's running!! 🏃‍♂️" );


});




// Test file to check child subprocess


//console.log( "It's running!! 🏃‍♂️" );
/*

// johnny five w/ electron bugfix

var Readable = require("stream").Readable;  
const util = require("util");  
util.inherits(MyStream, Readable);  
function MyStream(opt) {  
  Readable.call(this, opt);
}
MyStream.prototype._read = function() {};  
// hook in our stream
process.__defineGetter__("stdin", function() {  
  if (process.__stdin) return process.__stdin;
  process.__stdin = new MyStream();
  return process.__stdin;
});


// Node modules
const {remote, ipcRenderer} = require('electron');

const five = require("johnny-five");
const pixel = require("../global/js/pixel.js");
// setup board
var board = new five.Board({
  repl: false, // does not work with browser console
  port: "/dev/tty.SNES-DevB"
});

*/

// Functions ########################################


function initSlots(){

  console.log('run')

  const Slots = [2,3,4,5,6,7,8,'A0','A1','A2','A3'];

  const dContainer = $('#digital_slots');


  var m = "<div class='slot'>";

  var c = "</div>";


  dSlots.forEach(function(slot){

    dContainer.append(m);

    dContainer.append('D'+slot);

    dContainer.append(c);

  });

}





// Run functions
$(document).ready(function(){

  // Layout Functions
  initSeparators();

  initSlots();

});
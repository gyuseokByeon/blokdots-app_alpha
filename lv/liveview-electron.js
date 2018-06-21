
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


// -------------------------------------------------------

// Node modules
const {remote, ipcRenderer} = require('electron');

const five = require('johnny-five');
const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
const usb = require('usb');


var connected = false;



// board setup ------------------------------------------- 

var vID = '2a03'; 	// Vendor ID of Arduino -> USB
var pID = '0043'; 	// Product ID of blokdots 	-> USB (Micro)
 // pID = 8036; 	// (Leonardo)

var MYport; 		// String of TTY Port
var port;			// serialport object
var board;			// five.board object


// USB object to now if at/detach
var blokdots = usb.findByIds('0x'+vID, '0x'+pID); 

// Log if blokdots has already been connected
if( blokdots ){
	console.log('blokdots was already connected');
	initPort();
}else{
	console.log('blokdots is not connected yet');
}

// Do sth when blokdots gets attached
usb.on('attach', function( device ) { 
	
	// check if is blokdots
	blokdots = usb.findByIds('0x'+vID, '0x'+pID);

	if ( device == blokdots ){
		console.log('%cblokdots Connected 🎛','color: #1abc9c;');
		//if ( MYport == null ) { 
			initPort(); 
		//}
	}

});

// Do sth when blokdots gets detached
usb.on('detach', function( device ) { 
	if ( device == blokdots ){
		console.log('%cblokdots Disconnected 🔌','color: #E74C3C;');
		// io.emit('blokdotsDisconnect');
	}

	ipcRenderer.send('detached');
	connected = false;
	blokdotsConnectionIndicator( connected );

});

function initPort(){

	console.log('Searching SerialPort 🔎');

	SerialPort.list(function (err, ports) {

		// console.log('\x1b[2m',ports,'\x1b[0m');

		ports.forEach(function(sPort) {
			if(sPort.vendorId == vID){
				
				MYport = sPort.comName.toString();
				console.log('%cFound it -> '+MYport,'color: #c1c1c1;');
								
				/*
				port = new SerialPort( MYport, {
					baudRate: 9600
				});
				*/
				console.log('%cSerialPort is set ✔️','color: #c1c1c1;');
				
				initBoard();
				return;
			}
		});
	});
}


function initBoard(){

	if( board ){

	}else{
		// setup board
		board = new five.Board({
		  repl: false, // does not work with browser console
		  port: MYport
		});
	}


	board.on("ready", function() {

		ipcRenderer.send('attached');
		connected = true;
		blokdotsConnectionIndicator( connected );
		console.log('%cBoard is ready to go 🚀','color: #1abc9c;');

	});

	board.on("close", function () {
		console.log('Board closed')
	})
	
}

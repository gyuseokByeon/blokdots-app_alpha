
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
const path = require('path');
const appRootPath = require('electron').remote.app.getAppPath();
const isDev = require('electron-is-dev');
const fs = require('fs');

const Avrgirl = require('avrgirl-arduino');

// require('typeface-roboto-mono');


var connected = false;


// board setup ------------------------------------------- 

let blokdots;		// the current blokdots board

let MYport; 		// String of TTY Port
let port;			// serialport object
let board;			// five.board object
let currentBoardObj;


// check once at the beginning
for( let i = 0 ; i < boardList.length ; i++ ){

	if( !blokdots ){

		let boardObj = boardList[i];

		// remove Leonardo from distributed version (for now)
		if( !isDev && boardObj.avr == 'leonardo' ){
			boardObj = null;
		}

		const vID = boardObj.param.vid;
		const pID = boardObj.param.pid; 

		// check if is blokdots
		let tempDevice = usb.findByIds('0x'+vID, '0x'+pID);

		if ( tempDevice ){
			blokdots = tempDevice;
			// set currentBoardObj for avrGirl
			currentBoardObj = boardObj;

			console.log('blokdots was already connected');
			initPort();
		}
	}
}


if( !blokdots ){
	console.log('blokdots is not connected yet');
}


// Do sth when blokdots gets attached
usb.on('attach', function( device ) { 

	if( blokdots ){
		console.log('already one board connected');
		
	}else{
		for( let i = 0 ; i < boardList.length ; i++ ){

			const boardObj = boardList[i];

			const vID = boardObj.param.vid;
			const pID = boardObj.param.pid; 

			// check if is blokdots
			const tempDevice = usb.findByIds('0x'+vID, '0x'+pID);

			if ( device == tempDevice ){
				
				blokdots = tempDevice;

				// set currentBoardObj for avrGirl
				currentBoardObj = boardObj;

				console.log('%cblokdots Connected 🎛','color: '+consoleColors.good+';');

				//if ( MYport == null ) { 
					initPort(); 
				//}

				return;
			}
		}
	}
	
});

// Do sth when blokdots gets detached
usb.on('detach', function( device ) { 
	if ( device == blokdots ){
	
		console.log('%cblokdots Disconnected 🔌','color: '+consoleColors.alert+';');
		// io.emit('blokdotsDisconnect');

		closeBoard();
		ipcRenderer.send('detached');
		connected = false;
		blokdotsConnectionIndicator( connected );

		ipcRenderer.send('showAlert', 'high' , 'board not connected' );
	}
});



function initPort(){

	console.log( '%cConnected to an ' + currentBoardObj.board ,'color: '+consoleColors.good+';');

	console.log('%cSearching SerialPort 🔎','color: '+consoleColors.system+';');

	SerialPort.list(function (err, ports) {

		// console.log('\x1b[2m',ports,'\x1b[0m');

		ports.forEach(function(sPort) {
			if(sPort.vendorId == currentBoardObj.param.vid ){


				port = sPort;

				MYport = sPort.comName.toString();
				console.log('%cFound it -> '+MYport,'color: '+consoleColors.system+';');
								
				/*
				port = new SerialPort( MYport, {
					baudRate: 9600
				});
				*/
				console.log('%cSerialPort is set ✔️','color: '+consoleColors.system+';');
				

				//startAVR();
				
				if( isDev ){
					initBoard();
				}else{
					startAVR();
				}
								

				return;
			}
		});
	});
}


function initBoard(){

	if( board ){

		// board.io.reset();

	}else{
		// setup board
		board = new five.Board({
			// id: "A",
			repl: false, // does not work with browser console
			port: MYport,
			sigint: true
		});
	}

	board.on('error',function(err){

		console.log(err)

		if( err.class == "Device or Firmware Error" ){
			
			setTimeout(function(){
				startAVR();
				return;
			},1000);
		}

	});

	board.on("ready", function() {

		ipcRenderer.send('attached');
		connected = true;
		blokdotsConnectionIndicator( connected );
		// Rebuild Board List on LV to match slot structure 
		rebuildSlots();
		
		console.log('%cBoard is ready to go 🚀','color: '+consoleColors.good+';');

		reattachAllSlots();

		ipcRenderer.send('showAlert');

	});

	board.on("close", function () {
		console.log('Board closed (real)')
	});
	
}

function closeBoard(){

	removeAllSlotListeners();

	blokdots = null;
	board = null;
	currentBoardObj = null;
	
	console.log('board closing (fake)');
}


function ipcCommunicationInitLV(){

	ipcRenderer.on('useProject', function(evt,slotNum) {

		var slotObj;
		for(var i = 0; i < allSlots.length; i++){
			var curr = allSlots[i];
			if(curr.slot == slotNum ){
			  slotObj = curr;
			}
		}
		ipcRenderer.send('use', slotObj );

	});

	ipcRenderer.on('closeBoard', function() {
		closeBoard();
	});
	ipcRenderer.on('initBoard', function() {
		initBoard();
	});

}



function startAVR(){

	closeBoard();

	console.log("start uploading firmata");

	var avrgirl = new Avrgirl({
	  board: currentBoardObj.avr,
	  port: MYport
	});

	// start displaying uploading bar
	$('header').find('.info').remove();
	var m = '<div class="uploading info">Firmata is uploading</div>';

	$('header').append(m);

	let hexPath = appRootPath+'/firmata/'+currentBoardObj.avr+'/StandardFirmataPlus.ino.with_bootloader.hex';

	console.log( hexPath )

	avrgirl.flash( hexPath , function (error) {
	  
	  if (error) {
	    console.error(error);

	    // display Error

	    $('header').find('.info').removeClass('uploading').addClass('error').text('Upload failed. Try replugging the Board');

	  } else {

	    console.info('done uploading.');

	    $('header').find('.info').text('Done uploading');

	    // end uploading bar
	    setTimeout(function(){
	    	$('header').find('.info').remove();
	    }, 500);

	   
	    initBoard();
	  }
	});
	
}













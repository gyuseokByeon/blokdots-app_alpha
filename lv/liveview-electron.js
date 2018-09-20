/* global boardList */

// johnny five w/ electron bugfix
const Readable = require("stream").Readable;  
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

// board setup ------------------------------------------- 
let connected = false;

let blokdots = null;		// the current blokdots board

let port = null;			// SerialPort object
let portName = null; 		// String of TTY port name/address, i.e. /dev/cu.usbmodem...
let board = null;			// five.board object
let currentBoardDefinition = null; // avrGirl board object


// Check if we already have a supported board attached at launch
if( !blokdots ){
	const { device, boardDefinition } = detectUSBDevice();
	if(device && boardDefinition) {
		blokdots = device;
		currentBoardDefinition = boardDefinition;

		console.log('%cblokdots Connected 🎛','color: '+consoleColors.good+';');
		initPort(); 
	} else {
		console.log('blokdots board is not connected yet');
	}
}


// When new USB devices are attached, check if they are blokdots compatible boards
usb.on('attach', function( device ) {
	// Do not connect to more than one board
	if( blokdots ) return console.log('already one board connected'); 

	// Check if the attached board matches our supported boards
	const { boardDefinition } = detectUSBDevice(device);
	if(boardDefinition) {
		blokdots = device;
		currentBoardDefinition = boardDefinition;

		console.log('%cblokdots Connected 🎛','color: '+consoleColors.good+';');
		initPort(); 
	}

});

// Clean up when the blokdots is detached
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

function detectUSBDevice(device = null) {
	for( let i = 0 ; i < boardList.length ; i++ ){

		const boardDefinition = boardList[i];
		const vID = boardDefinition.param.vid;
		const pID = boardDefinition.param.pid; 

		// check if is blokdots
		const tempDevice = usb.findByIds('0x'+vID, '0x'+pID);
		if ( tempDevice != null ){
			if(device == null || device == tempDevice) {
				return { device: tempDevice, boardDefinition };
			}
		}
	}
	return {};
}


function initPort(){
	console.log("Board Definition", currentBoardDefinition);

	console.log('%cConnected to an ' + currentBoardDefinition.board ,'color: '+consoleColors.good+';');
	console.log('%cSearching SerialPort 🔎','color: '+consoleColors.system+';');

	SerialPort.list(function (err, ports) {

		ports.forEach(function(sPort) {
			if(sPort.vendorId == currentBoardDefinition.param.vid ){

				port = sPort;
				portName = sPort.comName.toString();

				console.log('%cFound it -> '+portName,'color: '+consoleColors.system+';');
				console.log('%cSerialPort is set ✔️','color: '+consoleColors.system+';');
				
				// @todo: Find a way to detect if the Firmate firmware is flashed and flash/initialise accordingly				
				/*if( isDev ){
					initBoard();
				} else {
					startAVR();
				}*/
				startAVR();

				return;
			}
		});
	});
}


function initBoard(){

	if( board ){
		// board.io.reset();
	} else {
		// setup board
		board = new five.Board({
			// id: "A",
			repl: false, // does not work with browser console
			port: portName,
			sigint: true
		});
	}

	board.on('error',function(err){

		console.log(err)

		if( err.class == "Device or Firmware Error" ){
			
			setTimeout(function(){
				startAVR();
				return;
			}, 1000);
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
	currentBoardDefinition = null;
	
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
	
	const avrBoardName = currentBoardDefinition.avr;
	closeBoard();

	console.log("start uploading firmata");

	var avrgirl = new Avrgirl({
	  board: avrBoardName,
	  port: portName
	});

	// start displaying uploading bar
	$('header').find('.info').remove();
	var m = '<div class="uploading info">Firmata is uploading</div>';
	$('header').append(m);

	const hexPath = `${appRootPath}/firmata/${avrBoardName}/StandardFirmataPlus.ino.with_bootloader.hex`;
	console.log( "Firmware file path:", hexPath );

	avrgirl.flash( hexPath , function (error) {
		if (error) {
			console.error(error);
			// display Error
			$('header').find('.info').removeClass('uploading').addClass('error').text('Upload failed. Try replugging the Board');

		} else {
			console.info('done uploading.');

			$('header').find('.info').text('Done uploading');


			if(avrBoardName == "leonardo") {

				// end uploading bar
				setTimeout(function(){
					$('header').find('.info').remove();
					initBoard();
	
				}, 11500);

			} else {

				// end uploading bar
				setTimeout(function(){
					$('header').find('.info').remove();
				}, 500);			
			}
		}
	});
}













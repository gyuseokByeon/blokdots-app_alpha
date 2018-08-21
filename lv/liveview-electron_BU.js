
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

const fs = require('fs');




var connected = false;




// board setup ------------------------------------------- 

var vID = '2a03';   // Vendor ID of Arduino -> USB
var pID = '0043';   // Product ID of blokdots   -> USB (Micro)
 // pID = 8036;   // (Leonardo)

var MYport;     // String of TTY Port
var port;     // serialport object
var board;      // five.board object


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
    console.log('%cblokdots Connected 🎛','color: '+consoleColors.good+';');
    //if ( MYport == null ) { 
      initPort(); 
    //}
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

  console.log('Searching SerialPort 🔎');

  SerialPort.list(function (err, ports) {

    // console.log('\x1b[2m',ports,'\x1b[0m');

    ports.forEach(function(sPort) {
      if(sPort.vendorId == vID){
        
        MYport = sPort.comName.toString();
        console.log('%cFound it -> '+MYport,'color: '+consoleColors.system+';');
                
        /*
        port = new SerialPort( MYport, {
          baudRate: 9600
        });
        */
        console.log('%cSerialPort is set ✔️','color: '+consoleColors.system+';');
        
        initBoard();
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


  board.on("ready", function() {

    ipcRenderer.send('attached');
    connected = true;
    blokdotsConnectionIndicator( connected );
    console.log('%cBoard is ready to go 🚀','color: '+consoleColors.good+';');

    reattachAllSlots();

    ipcRenderer.send('showAlert');

  });

  board.on("close", function () {
    console.log('Board closed')
  })
  
}

function closeBoard(){


  removeAllSlotListeners();

  board = null;
  
  console.log('board closing')

  /*
  board.exit(function (err) {
      console.log('port closed', err);
  });
  */

  /*
  exitHook(function () {
        console.log('exitong (exitHook)')
    });
   
    
    process.on('SIGINT', function () {
        console.log('process.on SIGINT');
    });

    process.on('exit', function () {
        console.log('process.on exit ');
    });

    */


    // ipcRenderer.send('stopProject');

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























// Node modules
const {remote, ipcRenderer} = require('electron');
const {dialog} = require('electron').remote;
const fs = require('fs');
// const childProcess = require("child_process");


// If Component is connected to LV
ipcRenderer.on('componentConnected', function(evt,slotObj) {
    
	const slotDOM = findSlotDOM( slotObj.slot );

    if ( slotDOM.hasClass('connected') == false ) {
		showQuicksetupSlot( slotObj );
	}else if( slotDOM.hasClass('missing') ){

		if( slotObj.comp == slotDOM.attr('component-type') ){

			slotState( slotDOM , 'connected' );

		}else{

			slotState( slotDOM , 'wrong' );
		}
	}

});

// if use button is hit on liveview -> insert component also in project
ipcRenderer.on('use', function(evt,slotObj) {
    
	setSlot( slotObj );

});

ipcRenderer.on('disconnectSlotLV', function(evt,slotNum) {
    
	slotGotDetached( slotNum );

});



// Display Alert
ipcRenderer.on('showAlert', function( evt , level , message ) {
    
	showError( level , message );

});
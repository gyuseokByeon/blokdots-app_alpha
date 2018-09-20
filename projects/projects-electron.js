
// Node modules
const {remote, ipcRenderer} = require('electron');
const {dialog} = require('electron').remote;
const fs = require('fs');
const path = require('path');
const appRootPath = require('electron').remote.app.getAppPath();
const beautify = require('js-beautify').js_beautify;

// require('typeface-roboto-mono');
  

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
    
	addError( level , message );

});


// update allSlotsLV
ipcRenderer.on('updateAllSlotsLV', function( evt , arr ) {
    
	allSlotsLV = arr;

});


ipcRenderer.on('save', function( evt  ) {
	saveProject();
});
ipcRenderer.on('save_as', function( evt  ) {
	saveProject( true );
});
ipcRenderer.on('open', function( evt  ) {
	openFile();
});



// Software Update available (from autoUpdater -> app.js)
ipcRenderer.on('softwareUpdateAvailable', function( evt , releaseNotes , releaseName ) {
    
	console.log('Update?');

	const dialogOpts = {
		type: 'info',
		buttons: ['Restart', 'Later'],
		title: 'Application Update',
		message: process.platform === 'win32' ? releaseNotes : releaseName,
		detail: 'A new version has been downloaded. Restart the application to apply the updates.'
	};

	// Dialog must be sent to project window !!!!!!

	dialog.showMessageBox(dialogOpts, (response) => {
		if (response === 0){ 
			ipcRenderer.send('installUpdate');
		}
	});
});





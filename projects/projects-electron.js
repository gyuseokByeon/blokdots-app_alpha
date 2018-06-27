
// Node modules
const {remote, ipcRenderer} = require('electron');






// If Component is connected to LV
ipcRenderer.on('componentConnected', function(evt,slotObj) {
    
	showQuicksetupSlot( slotObj );

});

// if use button is hit on liveview -> insert component also in project
ipcRenderer.on('use', function(evt,slotObj) {
    
	setSlot( slotObj );

});


// if use button is hit on liveview -> insert component also in project
ipcRenderer.on('disconnectSlotLV', function(evt,slotNum) {
    
	slotGotDetached( slotNum );

});
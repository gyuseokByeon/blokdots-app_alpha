
// include node modules

const {app, BrowserWindow, ipcMain, Menu, autoUpdater} = require('electron');
const windowStateKeeper = require('electron-window-state');
const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');

if (isDev) {
	console.log('Running in development');
} else {
	console.log('Running in production');
}

// init compile process
// var appRoot = path.join(__dirname);
// require('electron-compile').init(appRoot, require.resolve('./app'));


let lvWindow;
let projWindow;

let quitFlag = false;


// init electron windows
function createLiveViewWindow(){

	let lvWindowState = windowStateKeeper({
		file: 'lvWinState.json',
		defaultWidth: 400,
		defaultHeight: 680
	});

	let centerBool = false;

	// init Live View window – use last position or set position if opened for the first time
	lvWindow = new BrowserWindow({
		'x': lvWindowState.x || 40,
		'y': lvWindowState.y || 40,
		'width': lvWindowState.width,
		'height': lvWindowState.height,
		minHeight: 500,
		minWidth: 400,
		maxHeight: 1000,
		titleBarStyle: 'hidden'
	});
	lvWindow.loadURL('file://' + __dirname + '/lv/liveview.html');

	if (isDev) {
		lvWindow.openDevTools();
	}

	lvWindow.on('close', function (event) {
		if( !quitFlag ){
			event.preventDefault();
	    	lvWindow.hide();
		}
	});

	lvWindowState.manage(lvWindow);

}
function createProjectWindow(){

	let projWindowState = windowStateKeeper({
		file: 'projWinState.json',
		defaultWidth: 1150,
		defaultHeight: 806
	});

	let centerBool = false;

	if( !projWindowState.x && !projWindowState.y ){
		centerBool = true;
	}

	// init main window
	projWindow = new BrowserWindow({
		'x': projWindowState.x,
		'y': projWindowState.y,
		'width': projWindowState.width,
		'height': projWindowState.height,
		minHeight: 566,
		minWidth: 650,
		maxHeight: 1046,
		show: true,
		titleBarStyle: 'hidden',
		center: centerBool
  	});
  	projWindow.loadURL('file://' + __dirname + '/projects/projects.html');

  	if (isDev) {
	  	projWindow.openDevTools();
  	}

	projWindow.on('close', function () {
		//event.preventDefault();
	    //projWindow.hide();

	   	/* 
	   	console.log("Projecgt closed");
		projWindow = null;
		*/
	});

	projWindowState.manage(projWindow);

};


const menuTemplate = [
	{
		label: 'blokdots',
		submenu: [
			{
				role: 'about'
			},
			{
				type: 'separator'
			},
			{
				role: 'hide'
			},
			{
				role: 'hideothers'
			},
			{
				role: 'unhide'
			},
			{
				type: 'separator'
			},
			{
				role: 'quit'
			}
		]
	},
	{
		label: 'File',
		submenu: [
			{
				label: 'new',
				click () { createProjectWindow(); }
			},
			{
				label: 'save',
				click () { projWindow.webContents.send('save' ); }
			},
			{
				label: 'save as…',
				click () { projWindow.webContents.send('save_as' ); }
			},
			{
				label: 'open…',
				click () { projWindow.webContents.send('open' ); }
			}
		]
	},
	{
		role: 'window',
		submenu: [
			{
				role: 'minimize'
			},
			{
				role: 'close'
			},
			{
				type: 'separator'
			},
			{
				label: 'show Project',
				click () { projWindow.show(); }
			},
			{
				label: 'show Live View',
				click () { lvWindow.show(); }
			}
		]
	},
	{
		role: 'help',
		submenu: [
			{
				label: 'Learn More',
				click () { require('electron').shell.openExternal('http://blokdots.com') }
			}
		]
	}
];


function ipcCommunicationInit(){

	// If Component is connected to LV
	ipcMain.on('componentConnected', function( evt , slotObj ) {
	    projWindow.webContents.send('componentConnected',slotObj);
	});

	// If Button Use is pressed in LV
	ipcMain.on('use', function( evt , slotObj ) {
	    projWindow.webContents.send('use',slotObj);
	});
	// If Button Use is pressed in Project
	ipcMain.on('useProject', function( evt , slotNum ) {
	    lvWindow.webContents.send('useProject',slotNum);
	});

	// If Comp is disconnected in LV
	ipcMain.on('disconnectSlotLV', function( evt , slotNum ) {
	    projWindow.webContents.send('disconnectSlotLV',slotNum);
	});


	// update slotDB live view
	ipcMain.on('updateAllSlotsLV', function( evt , arr ) {
	    projWindow.webContents.send('updateAllSlotsLV', arr );
	});



	ipcMain.on('closeBoard', function() {
	    lvWindow.webContents.send('closeBoard');
	});
	ipcMain.on('initBoard', function() {
	    lvWindow.webContents.send('initBoard');
	});


	ipcMain.on('startProject', function() {
	    lvWindow.webContents.send('startProject');
	});
	ipcMain.on('stopProject', function() {
	    lvWindow.webContents.send('stopProject');
	});


	ipcMain.on('showLiveView', function() {
	    lvWindow.show();
	});


	ipcMain.on('showAlert', function( evt , level , message ) {
	    projWindow.webContents.send('showAlert',level,message);
	});

}



const menu = Menu.buildFromTemplate(menuTemplate);

app.on('ready', function(){

	if ( !isDev ) {
		Menu.setApplicationMenu(menu);
	}

	createLiveViewWindow();
	createProjectWindow();
	ipcCommunicationInit();

});


app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (projWindow === null) {
    // createProjectWindow();
  }
  lvWindow.show();
});


// Quit Process
app.on('quit', function () {

});

app.on('will-quit', function () {
   
});

app.on('before-quit', function() {
	// Set flag true to allow lvWindow to be closed
	quitFlag = true;
});

app.commandLine.appendSwitch('--enable-viewport-meta', 'true');





// https://electronjs.org/docs/tutorial/updates
// Add updater
// require('update-electron-app')();

if ( !isDev ) {

	const server = 'https://update.electronjs.org';
	const feed = `${server}/olivierbrcknr/blokdots-app/${process.platform}/${app.getVersion()}`;

	autoUpdater.setFeedURL(feed);

	// check once when the app is started
	setInterval(() => {
		autoUpdater.checkForUpdates();
	}, 60000*10 );

	autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {

		// show dialog in project window
		projWindow.webContents.send('softwareUpdateAvailable', releaseNotes, releaseName);

	});

	autoUpdater.on('error', message => {
		console.error('There was a problem updating the application');
		console.error(message);
	});

	// Run Update after Dialog (project window) has been hit
	ipcMain.on('installUpdate', function() {
		autoUpdater.quitAndInstall()
	});

}






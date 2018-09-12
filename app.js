
// include node modules

const {app, BrowserWindow, ipcMain, Menu, autoUpdater} = require('electron');

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


var lvWindow;
var projWindow;

var quitFlag = false;


// init electron windows
function createLiveViewWindow(){


	// init Live View window
	lvWindow = new BrowserWindow({
		width: 400,
		height: 680,
		minHeight: 500,
  		minWidth: 400,
  		maxHeight: 1000,
		titleBarStyle: 'hidden'
	});
	lvWindow.loadURL('file://' + __dirname + '/lv/liveview.html');

	if (isDev) {
		lvWindow.openDevTools();
	}

	lvWindow.setPosition(100, 200 );


	lvWindow.on('close', function (event) {
		if( !quitFlag ){
			event.preventDefault();
	    	lvWindow.hide();
		}
	});

}
function createProjectWindow(){

	// init main window
	projWindow = new BrowserWindow({
		width: 1150,
		height: 806,
		minHeight: 566,
		minWidth: 650,
		maxHeight: 1046,
		show: true,
		titleBarStyle: 'hidden'
  	});
  	projWindow.loadURL('file://' + __dirname + '/projects/projects.html');

  	if (isDev) {
	  	projWindow.openDevTools();
  	}

	projWindow.on('close', function () {
		//event.preventDefault();
	    // projWindow.hide();
	})

	projWindow.setPosition(530, 200 );
	
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
require('update-electron-app')();

if ( !isDev ) {

	const server = 'https://github.com/olivierbrcknr/blokdots-app';
	const feed = `${server}/update/${process.platform}/${app.getVersion()}`;

	autoUpdater.setFeedURL(feed);

	// check once when the app is started
	setInterval(() => {
		autoUpdater.checkForUpdates();
	}, 60000*10 );

	autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {

		const dialogOpts = {
			type: 'info',
			buttons: ['Restart', 'Later'],
			title: 'Application Update',
			message: process.platform === 'win32' ? releaseNotes : releaseName,
			detail: 'A new version has been downloaded. Restart the application to apply the updates.'
		};

		// Dialog must be sent to project window !!!!!!

		/*
		dialog.showMessageBox(dialogOpts, (response) => {
			if (response === 0){ 
				autoUpdater.quitAndInstall()
			}
		});
		*/
	});

	autoUpdater.on('error', message => {
		console.error('There was a problem updating the application');
		console.error(message);
	});

}



















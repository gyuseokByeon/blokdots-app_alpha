


// include node modules

const {app, BrowserWindow, ipcMain} = require('electron');

const path = require('path');
const url = require('url');


// start code when app is ready

app.on('ready', function(){


	// init Live View window
	var lvWindow = new BrowserWindow({
		width: 400,
		height: 700,
		minHeight: 500,
  		minWidth: 350,
		titleBarStyle: 'hidden'
	});
	lvWindow.loadURL('file://' + __dirname + '/lv/liveview.html')


/*
	// init main window
	var projWindow = new BrowserWindow({
		width: 1150,
		height: 860,
		show: true,
		titleBarStyle: 'hiddenInset'
  	});
  	projWindow.loadURL('file://' + __dirname + '/projects/projects.html')
  	//projWindow.openDevTools();
*/
  	

  	// init communication between windows

/*
	ipcMain.on('library_toggle', function () {

		if(libraryVisible){
			projWindow.setSize(1150,860,true);
			libraryVisible = false;
		}else{
			projWindow.setSize(1450,860,true);	
			libraryVisible = true;
		}
		
	});

	ipcMain.on('resize', (event, arg) => {
	    lvWindow.setSize(400,arg,true);
	});

	ipcMain.on('playPause', function() {
	    lvWindow.webContents.send('runProject');
	    projWindow.webContents.send('runProject');
	});

	ipcMain.on('stripSetUp', function() {
	    projWindow.webContents.send('stripSetUp');
	});

	ipcMain.on('showProject', function() {
	    projWindow.show();
	});
*/

});
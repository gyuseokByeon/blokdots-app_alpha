


// include node modules

const {app, BrowserWindow, ipcMain, Menu} = require('electron');

const path = require('path');
const url = require('url');



let lvWindow;
let projWindow;

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
	lvWindow.loadURL('file://' + __dirname + '/lv/liveview.html')


	lvWindow.on('close', function (event) {

		// console.log(event);
	    // event.preventDefault();
	    // lvWindow.hide();
		//lvWindow = null
	})

}
function createProjectWindow(){

	// init main window
	projWindow = new BrowserWindow({
		width: 1150,
		height: 766,
		minHeight: 566,
		minWidth: 650,
		show: true,
		titleBarStyle: 'hidden'
  	});
  	projWindow.loadURL('file://' + __dirname + '/projects/projects.html')
  	//projWindow.openDevTools();
  	
	projWindow.on('close', function () {

		projWindow = null
	})

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
				role: 'services',
				submenu: []
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
	/*
	{
		label: 'blokdots',
		submenu: [
			{
				label: 'Hide LiveView',
				accelerator: 'Shift+CmdOrCtrl+H',
				click() {
					lvWindow.hide();
				}
			},
			{
				label: 'Show LiveView',
				accelerator: 'Shift+CmdOrCtrl+H',
				click() {
					lvWindow.show();
				}
			}
		]
	},
	*/
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

const menu = Menu.buildFromTemplate(menuTemplate);

app.on('ready', function(){

	// Menu.setApplicationMenu(menu);

	createLiveViewWindow();
	createProjectWindow();

});


app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', function () {
  if (projWindow === null) {
    // createProjectWindow();
  }
  lvWindow.show();
})

app.commandLine.appendSwitch('--enable-viewport-meta', 'true');









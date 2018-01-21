const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const url = require('url')
const menubar = require('menubar')

let win;
let mb = menubar({
  icon: path.join(process.cwd(), 'tmp', 'TestClosedTemplate.png')
});
let debug = false;

mb.on('ready', createMenuBar);

function createMenuBar () {
  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '/../build/index.html'),
    protocol: 'file:',
    slashes: true
  });

  mb.on('after-create-window', () => {
    mb.window.loadURL(startUrl);

    if (debug == true) { 
      const size = mb.window.getSize();
      // title bar is 20px
      createDebuggingWindow({height: size[0]+20, width: size[1], startUrl: startUrl});
    }

    mb.window.on('after-close', () => {
      mb.window = null;
      win = null;
    });
  });
}

function createDebuggingWindow ({height, width, startUrl}) {
  win = new BrowserWindow({height: height, width: width})
  win.webContents.openDevTools();
  win.loadURL(startUrl);
}

mb.app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

ipcMain.on('menubar-spin', (e, arg) => {
  mb.setIcon(path.join(process.cwd(), 'tmp', 'TestOpenTemplate.png'))
});

ipcMain.on('menubar-wait', (e, arg) => {
  mb.setIcon(path.join(process.cwd(), 'tmp', 'TestClosedTemplate.png'))
});

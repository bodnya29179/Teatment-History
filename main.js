const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

function createWindow() {
  const win = new BrowserWindow({
    width: 940,
    minWidth: 940,
    height: 680,
    minHeight: 680,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    },
  });

  win.loadURL(
    url.format({
      pathname: path.join(__dirname, 'dist/treatment-history/browser/index.html'),
      protocol: 'file:',
      slashes: true,
    })
  );
}

app.disableHardwareAcceleration();

app.on('ready', createWindow);

app.on('activate', () => {
  if (!BrowserWindow.getAllWindows().length) {
    createWindow();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

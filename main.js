const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const url = require('url');

let serverProcess = null;

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

app.on('ready', () => {
  serverProcess = spawn('node', [path.join(__dirname, 'server/server.js')]);

  // Optional: Log server output to the console
  serverProcess.stdout.on('data', (data) => {
    console.log(`Server output: ${data}`);
  });

  serverProcess.stderr.on('data', (data) => {
    console.error(`Server error: ${data}`);
  });

  createWindow();
});

app.on('activate', () => {
  if (!BrowserWindow.getAllWindows().length) {
    createWindow();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }

  /* Stop the Node.js server when Electron closes */
  if (serverProcess) {
    serverProcess.kill();
  }
});

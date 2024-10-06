const { app, BrowserWindow } = require('electron');
const childProcess = require('child_process');
const path = require('path');
const url = require('url');
const waitOn = require('wait-on');

const PLATFORMS = Object.freeze({
  macos: 'darwin',
  windows: 'win32',
  linux: 'linux',
});

const APP_EVENTS = Object.freeze({
  ready: 'ready',
  activate: 'activate',
  close: 'window-all-closed',
  willQuit: 'will-quit',
});

const CLIENT_BUILD_ROOT_PATH = 'dist/treatment-history/browser';

const IS_DEV = !app.isPackaged;

const IS_MACOS = process.platform === PLATFORMS.macos;

process.env.NODE_ENV = IS_DEV ? 'development' : 'production';

let mainWindow;
let serverProcess;

app.disableHardwareAcceleration();

app.on(APP_EVENTS.ready, () => {
  createWindow();
  runServer();
});

app.on(APP_EVENTS.activate, () => {
  const areAllWindowsClosed = !BrowserWindow.getAllWindows().length;

  if (areAllWindowsClosed) {
    createWindow();
    sendServerReadyEvent();
  }
});

app.on(APP_EVENTS.close, () => {
  if (!IS_MACOS) {
    closeWindow();
  }
});

app.on(APP_EVENTS.willQuit, () => {
  if (IS_MACOS) {
    closeWindow();
  }
});

function createWindow() {
  mainWindow = new BrowserWindow({
    icon: path.join(__dirname, CLIENT_BUILD_ROOT_PATH, 'assets/icons/favicon.png'),
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

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, CLIENT_BUILD_ROOT_PATH, 'index.html'),
      protocol: 'file:',
      slashes: true,
    })
  );
}

function closeWindow() {
  stopServer();
  mainWindow = undefined;
  app.quit();
}

function runServer() {
  const serverPath = IS_DEV
    ? path.join(__dirname, 'server', 'server.js')
    : path.join(process.resourcesPath, 'app.asar.unpacked', 'server', 'server.js');

  serverProcess = childProcess.fork(serverPath);

  waitOn(options, (err) => {
    if (err) {
      console.error('Error waiting for server:', err);
      return;
    }

    mainWindow.webContents.send('server-ready', 'ready');
  });
}

function stopServer() {
  serverProcess?.kill();
}

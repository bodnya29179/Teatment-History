const { app, ipcMain, globalShortcut, BrowserWindow } = require('electron');
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
  clientRendered: 'renderer-ready',
  windowFocus: 'browser-window-focus',
  windowBlur: 'browser-window-blur',
});

const BUTTONS = Object.freeze({
  f5: 'F5',
  controlR: 'CommandOrControl+R',
  controlShiftR: 'CommandOrControl+Shift+R',
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

ipcMain.on(APP_EVENTS.clientRendered, () => listenServer());

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

app.on(APP_EVENTS.windowFocus, () => {
  globalShortcut.register(BUTTONS.controlR, () => {});
  globalShortcut.register(BUTTONS.controlShiftR, () => {});
  globalShortcut.register(BUTTONS.f5, () => {});
});

app.on(APP_EVENTS.windowBlur, () => {
  globalShortcut.unregister(BUTTONS.controlR);
  globalShortcut.unregister(BUTTONS.controlShiftR);
  globalShortcut.unregister(BUTTONS.f5);
});

function createWindow() {
  mainWindow = new BrowserWindow({
    icon: path.join(__dirname, CLIENT_BUILD_ROOT_PATH, 'assets/icons/favicon.png'),
    width: 940,
    minWidth: 940,
    height: 680,
    minHeight: 680,
    autoHideMenuBar: true,
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
}

function stopServer() {
  serverProcess?.kill();
}

function listenServer() {
  const options = {
    resources: ['tcp:3000'],
    interval: 500,
    timeout: 10_000,
  };

  waitOn(options, (err) => {
    if (err) {
      console.error('Error waiting for server:', err);
      return;
    }

    sendServerReadyEvent();
  });
}

function sendServerReadyEvent() {
  mainWindow.webContents.send('server-ready', 'ready');
}

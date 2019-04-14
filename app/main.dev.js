/* eslint global-require: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
import { app, BrowserWindow, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import {
  CATCH_ON_MAIN,
  FUNCTIONS_DEF_LOAD,
  FILE_OPENED,
  DELIMITER_CHANGE_RECEIVE,
  DELIMITER_CHANGE_SEND,
  EXPORT_TEMPLATE_TO_RENDER,
  TEMPLATE_OPENED
} from './constants/constants';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow = null;

let definitionData;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  ipcMain.on(CATCH_ON_MAIN, (event, arg) => {
    console.log(definitionData, arg);
    console.log(mainWindow.tempMem.text);

    const tempMem = mainWindow.tempMem;

    mainWindow.webContents.send(FUNCTIONS_DEF_LOAD, definitionData);
    mainWindow.webContents.send(FILE_OPENED, tempMem);
  });

  ipcMain.on(EXPORT_TEMPLATE_TO_RENDER, (event, arg) => {
    const templateExport = {
      template: arg,
      isOpened: false
    }
    mainWindow.tempMem.functionsTemplate = arg;
    mainWindow.webContents.send(TEMPLATE_OPENED, templateExport);
  })

  ipcMain.on(DELIMITER_CHANGE_SEND, (event, arg) => {
    console.log(arg);
    mainWindow.webContents.send(DELIMITER_CHANGE_RECEIVE, arg);
  });

  // ipcMain.on()

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();
  menuBuilder.createAppDataFolder();
  definitionData = menuBuilder.readDefinitionsFromAppData();

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
});

// @flow
import { app, Menu, shell, BrowserWindow, dialog, ipcMain } from 'electron';
import fs from 'fs';
import {
  FUNCTIONS_DEF_LOAD,
  LAST_FILE_NAME,
  REQUEST_DATA_TO_SAVE,
  REQUEST_TEMPLATE_TO_SAVE,
  SEND_DATA_TO_SAVE,
  FILE_OPENED,
  // CATCH_ON_MAIN,
  TEMPLATE_OPENED,
  NOTEPAD_UNMOUNT
} from './constants/constants';

export default class MenuBuilder {
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
    this.mainWindow.tempMem = {};
    this.appDataPath = `${app.getPath('appData')}/DefemPreprocessor`;
  }

  createAppDataFolder() {
    if (!fs.existsSync(this.appDataPath)) {
      fs.mkdirSync(this.appDataPath);
    }
  }

  saveDefinitionsFileToAppData(data) {
    if (!data) return;
    fs.writeFileSync(`${this.appDataPath}/${LAST_FILE_NAME}`, data);
  }

  readDefinitionsFromAppData() {
    let readFile;
    try {
      readFile = fs.readFileSync(`${this.appDataPath}/${LAST_FILE_NAME}`);
    } catch (e) {
      console.error(e);
    }
    if (!readFile) return;

    return readFile;
  }

  openDialog = type => {
    dialog.showOpenDialog(fileNames => {
      if (fileNames === undefined) {
        console.log('No file selected');
        return;
      }

      fs.readFile(fileNames[0], 'utf-8', (err, data) => {
        if (err) {
          console.error('An error occured');
        }
        if (type === FUNCTIONS_DEF_LOAD) {
          this.saveDefinitionsFileToAppData(data);
        }
        this.mainWindow.webContents.send(type, data);
      });
    });
  };

  openFileDialog = type => {
    dialog.showOpenDialog(fileNames => {
      if (fileNames === undefined) {
        console.log('No file selected');
        return;
      }
      fs.readFile(fileNames[0], 'utf-8', (err, data) => {
        if (err) {
          console.error('An error occured');
        }
        this.mainWindow.webContents.send(type, data);
        if (type === TEMPLATE_OPENED) {
          if (!this.mainWindow.tempMem) {
            this.mainWindow.tempMem = {};
          }
          this.mainWindow.tempMem.functionsTemplate = JSON.parse(data);
        }
        // todo: save last opened files
      });
    });
  };

  saveDialog = type => {
    const options = {
      defaultPath: app.getPath('documents')
    };

    this.savePath = dialog.showSaveDialog(null, options, path => {
      console.log(path);
      this.mainWindow.webContents.send(type, path);
    });
  };

  saveTemplateDialog = () => {
    // todo
    console.log('Gowno dupa cycki');
    this.saveDialog(REQUEST_TEMPLATE_TO_SAVE);
  };

  openTemplateDialog = () => {
    this.openFileDialog(TEMPLATE_OPENED);
    // todo
  };

  saveDataToPath = (event, data) => {
    // console.log(data.path, data.saveToFile);
    fs.writeFileSync(data.path, data.text);
  };

  buildMenu() {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      this.setupDevelopmentEnvironment();
    }

    const template =
      process.platform === 'darwin'
        ? this.buildDarwinTemplate()
        : this.buildDefaultTemplate();

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    ipcMain.on(SEND_DATA_TO_SAVE, (event, data) => {
      this.saveDataToPath(event, data);
      console.log('IN FUNCTION');
    });

    ipcMain.on(NOTEPAD_UNMOUNT, (event, data) => {
      console.log(data.text);
      this.mainWindow.tempMem.text = data.text;
      // this.tempMem.text = data.text
    });

    return menu;
  }

  setupDevelopmentEnvironment() {
    this.mainWindow.openDevTools();
    this.mainWindow.webContents.on('context-menu', (e, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            this.mainWindow.inspectElement(x, y);
          }
        }
      ]).popup(this.mainWindow);
    });
  }

  buildDarwinTemplate() {
    const subMenuAbout = {
      label: 'Electron',
      submenu: [
        {
          label: 'About ElectronReact',
          selector: 'orderFrontStandardAboutPanel:'
        },
        { type: 'separator' },
        { label: 'Services', submenu: [] },
        { type: 'separator' },
        {
          label: 'Hide ElectronReact',
          accelerator: 'Command+H',
          selector: 'hide:'
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Shift+H',
          selector: 'hideOtherApplications:'
        },
        { label: 'Show All', selector: 'unhideAllApplications:' },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    };
    const subMenuEdit = {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'Command+Z', selector: 'undo:' },
        { label: 'Redo', accelerator: 'Shift+Command+Z', selector: 'redo:' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'Command+X', selector: 'cut:' },
        { label: 'Copy', accelerator: 'Command+C', selector: 'copy:' },
        { label: 'Paste', accelerator: 'Command+V', selector: 'paste:' },
        {
          label: 'Select All',
          accelerator: 'Command+A',
          selector: 'selectAll:'
        }
      ]
    };
    const subMenuViewDev = {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'Command+R',
          click: () => {
            this.mainWindow.webContents.reload();
          }
        },
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          }
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'Alt+Command+I',
          click: () => {
            this.mainWindow.toggleDevTools();
          }
        }
      ]
    };
    const subMenuViewProd = {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          }
        }
      ]
    };
    const subMenuWindow = {
      label: 'Window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'Command+M',
          selector: 'performMiniaturize:'
        },
        { label: 'Close', accelerator: 'Command+W', selector: 'performClose:' },
        { type: 'separator' },
        { label: 'Bring All to Front', selector: 'arrangeInFront:' }
      ]
    };
    const subMenuHelp = {
      label: 'Help',
      submenu: [
        {
          label: 'Learn More',
          click() {
            shell.openExternal('http://electron.atom.io');
          }
        },
        {
          label: 'Documentation',
          click() {
            shell.openExternal(
              'https://github.com/atom/electron/tree/master/docs#readme'
            );
          }
        },
        {
          label: 'Community Discussions',
          click() {
            shell.openExternal('https://discuss.atom.io/c/electron');
          }
        },
        {
          label: 'Search Issues',
          click() {
            shell.openExternal('https://github.com/atom/electron/issues');
          }
        }
      ]
    };

    const fileMenu = {
      label: 'File',
      submenu: [
        {
          label: 'Open definitions',
          accelerator: 'Command + Shift + O',
          click: () => this.openDialog(FUNCTIONS_DEF_LOAD)
        },
        {
          label: 'Save',
          accelerator: 'Command + S',
          click: () => this.saveDialog(REQUEST_DATA_TO_SAVE)
        },
        {
          label: 'Open',
          accelerator: 'Command + O',
          click: () => this.openFileDialog(FILE_OPENED)
        }
      ]
    };

    const templateMenu = {
      label: 'Templates',
      submenu: [
        {
          label: 'Save',
          // accelerator: 'Command '
          click: () => this.saveTemplateDialog()
        },
        {
          label: 'Open',
          click: () => this.openTemplateDialog()
        }
      ]
    };

    const subMenuView =
      process.env.NODE_ENV === 'development' ? subMenuViewDev : subMenuViewProd;

    return [
      fileMenu,
      subMenuAbout,
      subMenuEdit,
      subMenuView,
      subMenuWindow,
      subMenuHelp,
      templateMenu
    ];
  }

  buildDefaultTemplate() {
    const templateDefault = [
      {
        label: '&File',
        submenu: [
          {
            label: '&Open definitions',
            accelerator: 'Ctrl + Shift + O',
            click: () => this.openDialog(FUNCTIONS_DEF_LOAD)
          },
          {
            label: '&Open',
            accelerator: 'Ctrl + O',
            click: () => this.openFileDialog(FILE_OPENED)
          },
          {
            label: '&Close',
            accelerator: 'Ctrl+W',
            click: () => {
              this.mainWindow.close();
            }
          },
          {
            label: '&Save',
            accelerator: 'Ctrl+S',
            click: () => this.saveDialog(REQUEST_DATA_TO_SAVE)
          }
        ]
      },
      {
        label: '&View',
        submenu:
          process.env.NODE_ENV === 'development'
            ? [
                {
                  label: '&Reload',
                  accelerator: 'Ctrl+R',
                  click: () => {
                    this.mainWindow.webContents.reload();
                  }
                },
                {
                  label: 'Toggle &Full Screen',
                  accelerator: 'F11',
                  click: () => {
                    this.mainWindow.setFullScreen(
                      !this.mainWindow.isFullScreen()
                    );
                  }
                },
                {
                  label: 'Toggle &Developer Tools',
                  accelerator: 'Alt+Ctrl+I',
                  click: () => {
                    this.mainWindow.toggleDevTools();
                  }
                }
              ]
            : [
                {
                  label: 'Toggle &Full Screen',
                  accelerator: 'F11',
                  click: () => {
                    this.mainWindow.setFullScreen(
                      !this.mainWindow.isFullScreen()
                    );
                  }
                }
              ]
      },
      {
        label: 'Help',
        submenu: [
          {
            label: 'Learn More',
            click() {
              shell.openExternal('http://electron.atom.io');
            }
          },
          {
            label: 'Documentation',
            click() {
              shell.openExternal(
                'https://github.com/atom/electron/tree/master/docs#readme'
              );
            }
          },
          {
            label: 'Community Discussions',
            click() {
              shell.openExternal('https://discuss.atom.io/c/electron');
            }
          },
          {
            label: 'Search Issues',
            click() {
              shell.openExternal('https://github.com/atom/electron/issues');
            }
          }
        ]
      },
      {
        label: 'Template',
        submenu: [
          {
            label: 'Save',
            // accelerator: 'Command '
            click: () => this.saveTemplateDialog()
          },
          {
            label: 'Open',
            click: () => this.openTemplateDialog()
          }
        ]
      }
    ];

    return templateDefault;
  }
}

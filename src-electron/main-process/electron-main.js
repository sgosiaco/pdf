import { app, BrowserWindow, nativeTheme, ipcMain, shell } from 'electron'

try {
  if (process.platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(require('path').join(app.getPath('userData'), 'DevTools Extensions'))
  }
} catch (_) { }

/**
 * Set `__statics` path to static files in production;
 * The reason we are setting it here is that the path needs to be evaluated at runtime
 */
if (process.env.PROD) {
  global.__statics = __dirname
}

let mainWindow

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 800,
    height: 450,
    frame: false,
    useContentSize: true,
    webPreferences: {
      // Change from /quasar.conf.js > electron > nodeIntegration;
      // More info: https://quasar.dev/quasar-cli/developing-electron-apps/node-integration
      nodeIntegration: process.env.QUASAR_NODE_INTEGRATION,
      nodeIntegrationInWorker: process.env.QUASAR_NODE_INTEGRATION,
      // More info: /quasar-cli/developing-electron-apps/electron-preload-script
      // preload: path.resolve(__dirname, 'electron-preload.js')
    }
  })

  mainWindow.loadURL(process.env.APP_URL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.handle('window', async (event, arg) => {
  const window = BrowserWindow.getFocusedWindow()
  switch (arg) {
    case 'minimize':
      window.minimize()
      break
    case 'maximize':
      if (window.isMaximized()) {
        window.unmaximize()
      } else {
        window.maximize()
      }
      return window.isMaximized()
    case 'close':
      window.close()
      break
    default: break
  }
})

ipcMain.handle('PDF', async (event, command, obj) => {
  switch (command) {
    case 'add':
      console.log(obj)
      break
    case 'combine':
      break
    case 'rotate':
      break
    case 'open':
      shell.showItemInFolder(obj.dir)
      break
    default: break
  }
})

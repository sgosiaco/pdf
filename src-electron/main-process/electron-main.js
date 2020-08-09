import { app, BrowserWindow, nativeTheme, ipcMain, shell, dialog } from 'electron'
import { promises, fstat } from 'fs'
import { PDFDocument, degrees } from 'pdf-lib'

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
  console.log(obj)
  switch (command) {
    case 'add':
      return await addPDF()
    case 'combine':
      return await combinePDF(obj.files)
    case 'rotate':
      return await rotatePDF(obj.file, obj.angle)
    default: break
  }
})

const addPDF = async () => {
  return await dialog.showOpenDialog({
    title: 'Select PDF to combine',
    filters: [{ name: 'PDF', extensions: ['pdf'] }],
    properties: ['openFile']
  })
}

const combinePDF = async (files) => {
  const saveDir = await dialog.showSaveDialog({ filters: [{ name: 'PDF', extensions: ['pdf'] }] }, { properties: ['openFile'] })
  if (saveDir.canceled) {
    dialog.showErrorBox('Please select a file to save to!', 'Please select a file to save to!')
    return saveDir
  }

  const output = await PDFDocument.create()

  for (const file of files) {
    const bytes = await promises.readFile(file)
    const pdf = await PDFDocument.load(bytes)
    const donor = await output.copyPages(pdf, Array.from({ length: pdf.getPageCount() }, (v, i) => i))
    donor.forEach(page => {
      output.addPage(page)
    })
  }

  const outputBytes = await output.save()
  await promises.writeFile(saveDir.filePath, outputBytes)
  shell.showItemInFolder(saveDir.filePath)
  return saveDir
}

const rotatePDF = async (file, angle) => {
  const saveDir = await dialog.showSaveDialog({ filters: [{ name: 'PDF', extensions: ['pdf'] }] }, { properties: ['openFile'] })
  if (saveDir.canceled) {
    dialog.showErrorBox('Please select a file to save to!', 'Please select a file to save to!')
    return saveDir
  }
  const output = await PDFDocument.create()

  const bytes = await promises.readFile(file)
  const pdf = await PDFDocument.load(bytes)
  const donor = await output.copyPages(pdf, Array.from({ length: pdf.getPageCount() }, (v, i) => i))
  donor.forEach(page => {
    const newAngle = (page.getRotation().angle + angle) % 360
    page.setRotation(degrees(newAngle))
    output.addPage(page)
  })
  const outputBytes = await output.save()
  await promises.writeFile(saveDir.filePath, outputBytes)
  shell.showItemInFolder(saveDir.filePath)
  return saveDir
}

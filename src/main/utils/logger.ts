import log from 'electron-log/main'
import { BrowserWindow, shell, ipcMain } from 'electron'

export const loggerInit = () => {
  log.initialize()
  log.transports.file.level = 'info'
  log.transports.console.level = 'debug'
  log.transports.file.maxSize = 1024 * 1024 * 10
  log.transports.file.fileName = 'logs.log'
  ipcMain.on('open-log-file', () => {
    openLogFile()
  })
}

export const openLogFile = () => {
  shell.openPath(log.transports.file.getFile().path)
}

export default {
  info: (param) => {
    log.info('[main] ' + param)
  },
  error: (param) => {
    const mainWindow = BrowserWindow.getAllWindows()[0]
    mainWindow?.webContents.send('on-message', 'error', '错误：' + param)
    log.error('[main] ' + param)
  },
  warn: (param) => {
    log.warn('[main] ' + param)
  },
  debug: (param) => {
    log.debug('[main] ' + param)
  }
}

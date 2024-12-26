import { autoUpdater } from 'electron-updater'
import { ipcMain, BrowserWindow, screen } from 'electron'
import { is } from '@electron-toolkit/utils'
import { join } from 'path'
import logger from '../utils/logger'

const updateURL = is.dev
  ? `${process.env['ELECTRON_RENDERER_URL']}#/update`
  : `${join(__dirname, '../renderer/index.html')}#/update`

export default () => {
  const mainWindow = BrowserWindow.getAllWindows()[0]
  let updateWindow: BrowserWindow
  autoUpdater.forceDevUpdateConfig = true
  autoUpdater.setFeedURL({
    provider: 'github',
    repo: 't-ge',
    owner: 'Z-404-Not-Found'
  })
  autoUpdater.autoDownload = false
  const createUpdateWindow = () => {
    if (!updateWindow || updateWindow.isDestroyed()) {
      updateWindow = new BrowserWindow({
        frame: false,
        resizable: false,
        skipTaskbar: true,
        alwaysOnTop: true,
        transparent: true,
        parent: mainWindow,
        webPreferences: {
          nodeIntegration: true,
          preload: join(__dirname, '../preload/index.js')
        }
      })
      const { width, height } = screen.getPrimaryDisplay().workAreaSize
      updateWindow.setBounds({
        x: width - 400,
        y: height - 300,
        width: 400,
        height: 300
      })
      updateWindow.loadURL(updateURL)
    }
  }
  // 监听更新事件
  autoUpdater.on('checking-for-update', () => {
    mainWindow?.webContents.send('checking-for-update')
  })
  // 更新可用
  autoUpdater.on('update-available', async (info) => {
    createUpdateWindow()
    setTimeout(() => {
      updateWindow?.webContents.send('update-available', info)
    }, 1000)
  })
  // 更新下载进度事件
  autoUpdater.on('download-progress', (progress) => {
    updateWindow?.webContents.send('download-progress', progress)
  })
  // 无更新
  autoUpdater.on('update-not-available', () => {
    mainWindow?.webContents.send('update-not-available', '已经是最新版本！')
  })
  // 更新错误事件
  autoUpdater.on('error', (err) => {
    logger.error('更新错误：' + err)
    mainWindow?.webContents.send('on-error', '更新错误：' + err)
    updateWindow?.webContents.send('on-error', '更新错误：' + err)
  })
  // 更新下载完成事件
  autoUpdater.on('update-downloaded', () => {
    updateWindow?.webContents.send('update-downloaded')
  })
  // 检查更新
  ipcMain.on('check-for-updates', () => {
    autoUpdater.checkForUpdates()
  })
  // 下载更新
  ipcMain.on('download-update', () => {
    autoUpdater.downloadUpdate()
  })
  // 安装更新
  ipcMain.on('install-update', () => {
    autoUpdater.quitAndInstall()
  })
}

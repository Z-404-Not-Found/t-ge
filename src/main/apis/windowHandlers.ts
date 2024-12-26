import { ipcMain, BrowserWindow } from 'electron'

export default () => {
  // 获取窗口是否最大化
  ipcMain.handle('is-mainWindow-maximized', () => {
    return BrowserWindow.getAllWindows()[0]?.isMaximized()
  })
  // 窗口最大化
  ipcMain.handle('toggle-window-maximize', (event) => {
    if (BrowserWindow.fromWebContents(event.sender)?.isMaximized()) {
      BrowserWindow.fromWebContents(event.sender)?.unmaximize()
    } else {
      BrowserWindow.fromWebContents(event.sender)?.maximize()
    }
    return BrowserWindow.fromWebContents(event.sender)?.isMaximized()
  })
  // 窗口最小化
  ipcMain.on('window-minimize', (event) => {
    BrowserWindow.fromWebContents(event.sender)?.minimize()
  })
  // 窗口关闭
  ipcMain.on('window-close', (event) => {
    BrowserWindow.fromWebContents(event.sender)?.close()
  })
}

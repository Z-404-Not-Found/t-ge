import { ipcMain, BrowserWindow } from 'electron'
import store from '../utils/store'

export default () => {
  if (!store.getItem('windowHandlers')) {
    store.setItem('windowHandlers', {
      isMainWindowMaximized: false,
      darkMode: 'system'
    })
  }

  const mainWindow = BrowserWindow.getAllWindows()[0]

  if (store.getItem('windowHandlers').isMainWindowMaximized) {
    mainWindow?.maximize()
    setTimeout(() => {
      mainWindow?.webContents.send('on-maximize')
    }, 1000)
  } else {
    mainWindow?.unmaximize()
    setTimeout(() => {
      mainWindow?.webContents.send('on-unmaximize')
    }, 1000)
  }

  // 窗口最大化
  ipcMain.on('toggle-window-maximize', () => {
    if (mainWindow?.isMaximized()) {
      mainWindow?.unmaximize()
      mainWindow?.webContents.send('on-unmaximize')
      store.setItem('windowHandlers', {
        ...store.getItem('windowHandlers'),
        isMainWindowMaximized: false
      })
    } else {
      mainWindow?.maximize()
      mainWindow?.webContents.send('on-maximize')
      store.setItem('windowHandlers', {
        ...store.getItem('windowHandlers'),
        isMainWindowMaximized: true
      })
    }
  })
  // 窗口最大化事件
  mainWindow?.on('maximize', () => {
    mainWindow?.webContents.send('on-maximize')
    store.setItem('windowHandlers', {
      ...store.getItem('windowHandlers'),
      isMainWindowMaximized: true
    })
  })
  // 窗口取消最大化事件
  mainWindow?.on('unmaximize', () => {
    mainWindow?.webContents.send('on-unmaximize')
    store.setItem('windowHandlers', {
      ...store.getItem('windowHandlers'),
      isMainWindowMaximized: false
    })
  })
  // 窗口最小化
  ipcMain.on('window-minimize', (event) => {
    BrowserWindow.fromWebContents(event.sender)?.minimize()
  })
  // 窗口关闭
  ipcMain.on('window-close', (event) => {
    BrowserWindow.fromWebContents(event.sender)?.close()
  })
  // 切换暗黑模式
  ipcMain.on('toggle-dark-mode', (_event, mode) => {
    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.send('on-toggle-dark-mode', mode)
    })
    store.setItem('windowHandlers', {
      ...store.getItem('windowHandlers'),
      darkMode: mode
    })
  })
}

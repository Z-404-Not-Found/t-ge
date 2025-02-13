import { ipcMain, shell } from 'electron'

export default () => {
  // 窗口最大化
  ipcMain.on('open-github', () => {
    shell.openExternal('https://github.com/Z-404-Not-Found/t-ge')
  })
}

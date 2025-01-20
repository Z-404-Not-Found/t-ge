import { ipcMain } from 'electron'
import store from '../utils/store'

export default () => {
  ipcMain.on('user-data-setItem', (_event, key, value) => {
    store.setItem(key, value)
  })

  ipcMain.handle('user-data-getItem', (_event, key) => {
    return store.getItem(key)
  })

  ipcMain.on('user-data-removeItem', (_event, key) => {
    store.removeItem(key)
  })

  ipcMain.on('user-data-clear', () => {
    store.clear()
  })
}

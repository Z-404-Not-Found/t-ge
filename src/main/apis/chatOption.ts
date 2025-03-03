// import { ipcMain } from 'electron'
// import logger from '../utils/logger'
import store from '../utils/store'

if (!store.getItem('rememberContextLength')) {
  store.setItem('rememberContextLength', 8)
}

export default () => {}

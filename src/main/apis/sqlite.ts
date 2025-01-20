import { ipcMain } from 'electron'
import logger from '../utils/logger'
import { db } from '../utils/sqlite'

export default () => {
  ipcMain.handle('insert-test', (_event, item) => {
    const stmt = db.prepare('INSERT INTO test (item) VALUES (?)')
    try {
      stmt.run(item)
    } catch (error) {
      logger.error(error)
    }
  })
  ipcMain.handle('select-test', () => {
    const stmt = db.prepare('SELECT * FROM test')
    try {
      return stmt.all()
    } catch (error) {
      logger.error(error)
    }
  })
}

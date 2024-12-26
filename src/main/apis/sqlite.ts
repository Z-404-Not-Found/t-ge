import Database from 'better-sqlite3'
import { app, ipcMain } from 'electron'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'

const userDataPath = join(app.getPath('userData'), './userData')
if (!existsSync(userDataPath)) {
  mkdirSync(userDataPath)
}
const db = new Database(join(userDataPath, 'tGe.db'))

db.exec(`
  CREATE TABLE IF NOT EXISTS test (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    item TEXT NOT NULL
  );
`)

export default () => {
  ipcMain.handle('insert-test', (_event, item) => {
    const stmt = db.prepare('INSERT INTO test (item) VALUES (?)')
    stmt.run(item)
  })
  ipcMain.handle('select-test', () => {
    const stmt = db.prepare('SELECT * FROM test')
    return stmt.all()
  })
}

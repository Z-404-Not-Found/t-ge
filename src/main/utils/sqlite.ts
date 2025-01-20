import Database from 'better-sqlite3'
import { app } from 'electron'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'

const userDataPath = join(app.getPath('userData'), './userData')
if (!existsSync(userDataPath)) {
  mkdirSync(userDataPath)
}
export const db = new Database(join(userDataPath, 'chat.db'))

export const sqliteInit = () => {
  db.exec(`
      CREATE TABLE IF NOT EXISTS test (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        item TEXT NOT NULL
      );
    `)
}

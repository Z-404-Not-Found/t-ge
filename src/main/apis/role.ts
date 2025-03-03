import { ipcMain } from 'electron'
import logger from '../utils/logger'
import { db } from '../utils/sqlite'

export default () => {
  ipcMain.handle('add-role', (_event, { name, description, definition }) => {
    try {
      if (db.prepare(`SELECT * FROM roles WHERE name = ?`).get(name)) {
        return '角色已存在'
      } else {
        return db
          .prepare(`INSERT INTO roles (name, description, definition) VALUES (?, ?, ?)`)
          .run(name, description, definition).lastInsertRowid
      }
    } catch (error) {
      logger.error('[main] Role SQLite Create role failed:' + error)
      return null
    }
  })

  ipcMain.handle('delete-role', (_event, id) => {
    try {
      if (db.prepare(`SELECT COUNT(*) FROM roles`).get()[`COUNT(*)`] === 1) {
        return '不能删除最后一个角色'
      } else {
        db.prepare(`DELETE FROM roles WHERE id = ?`).run(id).changes
        return '删除成功'
      }
    } catch (error) {
      logger.error('[main] Role SQLite Delete role failed:' + error)
      return 0
    }
  })

  ipcMain.handle('get-role', () => {
    try {
      return db.prepare(`SELECT * FROM roles ORDER BY updated_at DESC`).all()
    } catch (error) {
      logger.error('[main] Role SQLite Get roles failed:' + error)
      return []
    }
  })

  ipcMain.handle('update-role', (_event, { id, name, description, definition }) => {
    try {
      db.prepare(`UPDATE roles SET name = ?, description = ?, definition = ? WHERE id = ?`).run(
        name,
        description,
        definition,
        id
      )
      return '更新成功'
    } catch (error) {
      logger.error('[main] Role SQLite Update role failed:' + error)
      return 0
    }
  })

  ipcMain.handle('update-role-updated-at-by-id', (_event, { id: id, updated_at: updated_at }) => {
    try {
      db.prepare(`UPDATE roles SET updated_at = ? WHERE id = ?`).run(updated_at, id)
      return '更新成功'
    } catch (error) {
      logger.error('[main] Role SQLite Update updated_at by id failed:' + error)
      return 0
    }
  })

  ipcMain.handle('get-role-by-name', (_event, name) => {
    try {
      return db
        .prepare(`SELECT * FROM roles WHERE name LIKE ?  ORDER BY updated_at DESC`)
        .all(`%${name}%`)
    } catch (error) {
      logger.error('[main] Role SQLite Get role by name failed:' + error)
      return null
    }
  })
}

import { ipcMain } from 'electron'
import logger from '../utils/logger'
import { db } from '../utils/sqlite'

export default () => {
  ipcMain.handle('add-conversation', (_event, roleId) => {
    try {
      db.prepare(`INSERT INTO conversations (role_id) VALUES (?)`).run(roleId).lastInsertRowid
      return '新建对话成功'
    } catch (error) {
      logger.error('[main] Conversion SQLite Create conversation failed:' + error)
      return null
    }
  })
  ipcMain.handle('update-conversation-title', (_event, { id, title }) => {
    try {
      db.prepare(`UPDATE conversations SET title = ? WHERE id = ?`).run(title, id).changes
      return '更新对话标题成功'
    } catch (error) {
      logger.error('[main] Conversion SQLite Update title failed:' + error)
      return 0
    }
  })
  ipcMain.handle('get-conversation', (_event, roleId) => {
    try {
      return db
        .prepare(
          `
          SELECT 
            c.id,
            c.title,
            c.role_id,
            c.created_at,
            c.updated_at,
            (SELECT m.content 
             FROM messages m 
             WHERE m.conversation_id = c.id 
             ORDER BY m.timestamp DESC, m.id DESC 
             LIMIT 1) AS last_message_content
          FROM conversations c
          WHERE c.role_id = ?
          ORDER BY c.updated_at DESC
          `
        )
        .all(roleId)
    } catch (error) {
      logger.error('[main] Conversion SQLite Get conversation list failed:' + error)
      return []
    }
  })
  ipcMain.handle(
    'update-conversation-updated-at-by-id',
    (_event, { id: id, updated_at: updated_at }) => {
      try {
        db.prepare(`UPDATE conversations SET updated_at = ? WHERE id = ?`).run(updated_at, id)
        return '更新成功'
      } catch (error) {
        logger.error('[main] Conversion SQLite Update updated_at by id failed:' + error)
        return 0
      }
    }
  )
  ipcMain.handle('delete-conversation', (_event, id) => {
    try {
      if (db.prepare(`SELECT COUNT(*) FROM conversations`).get()[`COUNT(*)`] === 1) {
        return '不能删除最后一个对话'
      } else {
        db.prepare(`DELETE FROM conversations WHERE id = ?`).run(id)
        return '删除成功'
      }
    } catch (error) {
      logger.error('[main] Conversion SQLite Delete by id failed:' + error)
      return 0
    }
  })
}

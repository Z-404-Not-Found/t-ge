import { ipcMain } from 'electron'
import logger from '../utils/logger'
import { db } from '../utils/sqlite'

export default () => {
  ipcMain.handle(
    'add-message',
    (
      _event,
      {
        conversationId,
        content,
        reasoningContent = '',
        type = 'text',
        senderRole,
        isReasoning = false
      }
    ) => {
      try {
        return db
          .prepare(
            `
          INSERT INTO messages (
            conversation_id,
            content,
            reasoning_content,
            type,
            sender_role,
            is_reasoning
          ) VALUES (?, ?, ?, ?, ?, ?)
        `
          )
          .run(conversationId, content, reasoningContent, type, senderRole, isReasoning ? 1 : 0)
          .lastInsertRowid
      } catch (error) {
        logger.error('[main] Chat SQLite Create message failed:' + error)
        return null
      }
    }
  )

  ipcMain.handle('update-message-by-id', (_event, { messageId, content }) => {
    try {
      db.prepare(`UPDATE messages SET content = ? WHERE id = ?`).run(content, messageId).changes
      return '更新成功'
    } catch (error) {
      logger.error('[main] Chat SQLite Update message by id failed:' + error)
      return 0
    }
  })

  ipcMain.handle('update-reasoning-message-by-id', (_event, { messageId, reasoningContent }) => {
    try {
      if (
        db.prepare(`SELECT is_reasoning FROM messages WHERE id = ?`).get(messageId)
          ?.is_reasoning === 0
      ) {
        db.prepare(`UPDATE messages SET is_reasoning = 1 WHERE id = ?`).run(messageId).changes
      }
      db
        .prepare(`UPDATE messages SET reasoning_content = ? WHERE id = ?`)
        .run(reasoningContent, messageId).changes
      return '更新成功'
    } catch (error) {
      logger.error('[main] Chat SQLite Update reasoning_content by id failed:' + error)
      return 0
    }
  })

  ipcMain.handle('delete-messages-by-id', (_event, id) => {
    try {
      return db.prepare(`DELETE FROM messages WHERE id = ?`).run(id).changes
    } catch (error) {
      logger.error('[main] Chat SQLite Delete messages failed:' + error)
      return 0
    }
  })

  ipcMain.handle('get-messages-by-conversation-id', (_event, conversationId) => {
    try {
      return db
        .prepare(
          `
          SELECT 
            id,
            content,
            reasoning_content as reasoningContent,
            type,
            sender_role as senderRole,
            is_reasoning as isReasoning,
            timestamp
          FROM messages 
          WHERE conversation_id = ?
          ORDER BY timestamp ASC
        `
        )
        .all(conversationId)
    } catch (error) {
      logger.error('[main] Chat SQLite Get messages failed:' + error)
      return []
    }
  })

  ipcMain.handle('get-last-messages-by-conversation-id', (_event, { conversationId, count }) => {
    try {
      return db
        .prepare(
          `
          SELECT * FROM (
          SELECT 
            id,
            content,
            reasoning_content as reasoningContent,
            type,
            sender_role as senderRole,
            is_reasoning as isReasoning,
            timestamp
          FROM messages 
          WHERE conversation_id = ?
          ORDER BY timestamp DESC
          LIMIT ?
        ) 
        ORDER BY timestamp ASC
        `
        )
        .all(conversationId, count)
    } catch (error) {
      logger.error('[main] Chat SQLite Get messages failed:' + error)
      return []
    }
  })

  ipcMain.handle('get-message-by-id', (_event, id) => {
    try {
      return db
        .prepare(
          `
          SELECT 
            id,
            content,
            reasoning_content as reasoningContent,
            type,
            sender_role as senderRole,
            is_reasoning as isReasoning,
            timestamp
          FROM messages 
          WHERE id = ?
        `
        )
        .get(id)
    } catch (error) {
      logger.error('[main] Chat SQLite Get message failed:' + error)
      return null
    }
  })
}

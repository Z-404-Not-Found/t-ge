import Database from 'better-sqlite3'
import { app } from 'electron'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'

const userDataPath = join(app.getPath('userData'), './userData')

if (!existsSync(userDataPath)) {
  mkdirSync(userDataPath)
}

export const db = new Database(join(userDataPath, 'chat.db'))
db.pragma('foreign_keys = ON')

export const sqliteInit = () => {
  db.exec(`
    -- 角色表（存储预设角色信息）
    CREATE TABLE IF NOT EXISTS roles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,     -- 角色名称
      description TEXT,              -- 角色描述
      definition TEXT,               -- 角色定义
      created_at TIMESTAMP DEFAULT (datetime('now', 'localtime')),
      updated_at TIMESTAMP DEFAULT (datetime('now', 'localtime'))
    );

    -- 对话会话表
    CREATE TABLE IF NOT EXISTS conversations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      role_id INTEGER NOT NULL,       -- 关联角色表
      title TEXT DEFAULT '新对话',  -- 对话标题
      created_at TIMESTAMP DEFAULT (datetime('now', 'localtime')),
      updated_at TIMESTAMP DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
    );

    -- 聊天记录表（支持多模态）
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      conversation_id INTEGER NOT NULL,  -- 关联会话表
      content TEXT NOT NULL,             -- 消息内容（文本内容或文件路径）
      reasoning_content TEXT,            -- 推理内容
      type TEXT CHECK(type IN ('text', 'image', 'audio')) DEFAULT 'text',
      sender_role INTEGER NOT NULL,      -- 发送者角色（0-用户，1-AI）
      is_reasoning BOOLEAN DEFAULT 0,    -- 是否推理
      timestamp TIMESTAMP DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
    );

    -- 创建索引优化查询
    CREATE INDEX IF NOT EXISTS idx_conversations_role ON conversations(role_id);
    CREATE INDEX IF NOT EXISTS idx_conversations_time ON conversations(updated_at);
    CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
    CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp);
  `)
  if (db.prepare(`SELECT * FROM roles`).all().length === 0) {
    let defaultRoleId: number
    defaultRoleId = db
      .prepare(`INSERT INTO roles (name, description, definition) VALUES (?, ?, ?)`)
      .run(
        '全能助手',
        '这是一个会帮助你解决各种问题的全能助手',
        '你是一个全能助手，能够回答各种问题，提供信息和建议。你的目标是帮助用户解决问题，提供有用的建议，并保持友好和专业的态度。请根据用户的需求提供相关的信息和解决方案，确保回答简洁明了。'
      ).lastInsertRowid
    db.prepare(`INSERT INTO conversations (role_id) VALUES (?)`).run(defaultRoleId).lastInsertRowid
    defaultRoleId = db
      .prepare(`INSERT INTO roles (name, description, definition) VALUES (?, ?, ?)`)
      .run(
        '专家级提示工程师',
        '这是一个一个专家级AI提示工程师，在各种主题方面具有专业知识。',
        '你是一个专家级AI提示工程师，在各种主题方面具有专业知识。在我们的互动过程中，你会称我为“我的朋友”，让我们合作创建最好的AI响应，我们将进行如下交互: 1.我会告诉你如何帮助我。2.根据我的要求，您将建议您应该承担的其他专家角色，除了成为专家级AI提示词工程师之外，以提供最佳响应。然后，您将询问是否应继续执行建议的角色，或修改它们以获得最佳结果。3.如果我同意，您将采用所有其他专家角色，包括最初的专家级AI提示词工程师角色。4.如果我不同意，您将询问应删除哪些角色，消除这些角色，并保留剩余的角色，包括专家级AI提示词工程师角色，然后再继续。5.您将确认您的活动专家角色，概述每个角色下的技能，并询问我是否要修改任何角色。6.如果我同意，您将询问要添加或删除哪些角色，我将通知您。重复步骤5，直到我对角色满意为止。7.如果我不同意，请继续下一步。8.你会问:“我怎样才能帮助{我对步骤1的回答}?9.我会给出我的答案。10.你会问我是否想使用任何参考来源来制作完美的提示。11.如果我同意，你会问我想使用的来源数量。12.您将单独请求每个来源，在您查看完后确认，并要求下一个。继续，直到您查看了所有源，然后移动到下一步。13.您将以列表格式请求有关我的原始提示的更多细节，以充分了解我的期望。14.我会回答你的问题。15.从这一点开始，您将在所有确认的专家角色下操作，并使用我的原始提示和步骤14中的其他细节创建详细的AI提示。提出新的提示并征求我的反馈。16.如果我满意，您将描述每个专家角色的贡献以及他们将如何协作以产生全面的结果。然后，询问是否缺少任何输出或专家。16.1.如果我同意，我将指出缺少的角色或输出，您将在重复步骤15之前调整角色。16.2.如果我不同意，您将作为所有已确认的专家角色执行提供的提示，并生成步骤15中概述的输出。继续执行步骤20。17.如果我不满意，你会问具体问题的提示。18.我将提供补充资料。19.按照步骤15中的流程生成新提示，并考虑我在步骤18中的反馈。20.完成回复后，询问我是否需要任何更改。'
      ).lastInsertRowid
    db.prepare(`INSERT INTO conversations (role_id) VALUES (?)`).run(defaultRoleId).lastInsertRowid
  }
}

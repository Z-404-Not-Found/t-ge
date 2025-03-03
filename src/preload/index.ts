import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// 渲染器的自定义 API
const api = {
  onMessage: (listener: (event, severity, summary, detail) => void) =>
    ipcRenderer.on('on-message', listener),
  openLogFile: () => ipcRenderer.send('open-log-file'),
  windowHandlers: {
    toggleMaximized: () => ipcRenderer.send('toggle-window-maximize'),
    isMaximized: (listener: (event, data) => void) => ipcRenderer.on('on-maximize', listener),
    isUnmaximized: (listener: (event, data) => void) => ipcRenderer.on('on-unmaximize', listener),
    minimize: () => ipcRenderer.send('window-minimize'),
    close: () => ipcRenderer.send('window-close')
  },
  update: {
    checkForUpdates: () => ipcRenderer.send('check-for-updates'),
    installUpdate: () => ipcRenderer.send('install-update'),
    downloadUpdate: () => ipcRenderer.send('download-update'),
    onUpdate: (channel, listener: (event, data) => void) => ipcRenderer.on(channel, listener)
  },
  aiProvider: {
    getProviders: async () => await ipcRenderer.invoke('ai-provider-get'),
    getCurrentProvider: async () => await ipcRenderer.invoke('ai-provider-get-current'),
    updateProvider: async (provider) => await ipcRenderer.invoke('ai-provider-update', provider),
    updateProviderModel: async (model) =>
      await ipcRenderer.invoke('ai-provider-update-model', model)
  },
  ai: {
    chat: {
      send: (messages) => ipcRenderer.send('on-chat-send', messages),
      onStream: (listener: (event, data) => void) => {
        ipcRenderer.on('on-chat-stream', listener)
      },
      onReasoningStream: (listener: (event, data) => void) => {
        ipcRenderer.on('on-chat-reasoning-stream', listener)
      },
      onStreamEnd: (listener: (event, data) => void) => {
        ipcRenderer.on('on-chat-stream-end', listener)
      },
      stopChatStream: () => {
        ipcRenderer.send('stop-chat-stream')
      },
      onStreamError: (listener: (event, data) => void) => {
        ipcRenderer.on('on-chat-stream-error', listener)
      },
      offStream: () => {
        ipcRenderer.removeAllListeners('on-chat-stream')
        ipcRenderer.removeAllListeners('on-chat-stream-end')
        ipcRenderer.removeAllListeners('on-chat-stream-error')
      }
    },
    getModelList: async () => await ipcRenderer.invoke('get-model-list')
  },
  sqlite: {
    insertTest: async (data) => await ipcRenderer.invoke('insert-test', data),
    selectTest: async () => await ipcRenderer.invoke('select-test')
  },
  store: {
    setItem: (key, value) => ipcRenderer.send('user-data-setItem', key, value),
    getItem: async (key) => await ipcRenderer.invoke('user-data-getItem', key),
    removeItem: (key) => ipcRenderer.send('user-data-removeItem', key),
    clear: () => ipcRenderer.send('user-data-clear')
  },
  openGithub: () => ipcRenderer.send('open-github'),
  conversation: {
    add: (roleId) => ipcRenderer.invoke('add-conversation', roleId),
    updateTitle: ({ id, title }) => ipcRenderer.invoke('update-conversation-title', { id, title }),
    get: (roleId) => ipcRenderer.invoke('get-conversation', roleId),
    updateUpdatedAtById: ({ id, updated_at }) =>
      ipcRenderer.invoke('update-conversation-updated-at-by-id', { id, updated_at }),
    delete: (id) => ipcRenderer.invoke('delete-conversation', id)
  },
  role: {
    add: ({ name, description, definition }) =>
      ipcRenderer.invoke('add-role', { name, description, definition }),
    delete: (id) => ipcRenderer.invoke('delete-role', id),
    get: () => ipcRenderer.invoke('get-role'),
    update: ({ id, name, description, definition }) =>
      ipcRenderer.invoke('update-role', { id, name, description, definition }),
    updateUpdatedAtById: ({ id, updated_at }) =>
      ipcRenderer.invoke('update-role-updated-at-by-id', { id, updated_at }),
    getRoleByName: (name) => ipcRenderer.invoke('get-role-by-name', name)
  },
  message: {
    addMessage: ({ conversationId, content, reasoningContent, type, senderRole, isReasoning }) =>
      ipcRenderer.invoke('add-message', {
        conversationId,
        content,
        reasoningContent,
        type,
        senderRole,
        isReasoning
      }),
    updateMessageById: ({ messageId, content }) =>
      ipcRenderer.invoke('update-message-by-id', { messageId, content }),
    updateReasoningMessageById: ({ messageId, reasoningContent }) =>
      ipcRenderer.invoke('update-reasoning-message-by-id', { messageId, reasoningContent }),
    deleteMessagesById: (id) => ipcRenderer.invoke('delete-messages-by-id', id),
    getMessagesByConversationId: (conversationId) =>
      ipcRenderer.invoke('get-messages-by-conversation-id', conversationId),
    getLastMessageByConversationId: ({ conversationId, count }) =>
      ipcRenderer.invoke('get-last-messages-by-conversation-id', { conversationId, count }),
    setLastMessageIsFinished: () => ipcRenderer.send('set-last-message-is-finished'),
    getMessageById: (id) => ipcRenderer.invoke('get-message-by-id', id)
  },
  saveImage: (arrayBuffer) => ipcRenderer.invoke('save-image', arrayBuffer)
}

// 仅当启用上下文隔离时，使用 `contextBridge` API 将 Electron API 暴露给渲染器，
// 否则直接添加到 DOM 全局对象。
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (在 dts 中定义)
  window.electron = electronAPI
  // @ts-ignore (在 dts 中定义)
  window.api = api
}

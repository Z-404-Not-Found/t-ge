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
    updateProvider: async (provider) => await ipcRenderer.invoke('ai-provider-update', provider)
  },
  ai: {
    chat: {
      send: (messages) => ipcRenderer.send('on-chat-send', messages),
      onStream: (listener: (event, data) => void) => {
        if (ipcRenderer.listenerCount('on-chat-stream') === 0) {
          ipcRenderer.on('on-chat-stream', listener)
        }
      },
      onStreamEnd: (listener: (event, data) => void) => {
        if (ipcRenderer.listenerCount('on-chat-stream-end') === 0) {
          ipcRenderer.on('on-chat-stream-end', listener)
        }
      },
      onStreamError: (listener: (event, data) => void) => {
        if (ipcRenderer.listenerCount('on-chat-stream-error') === 0) {
          ipcRenderer.on('on-chat-stream-error', listener)
        }
      }
    }
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
  }
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

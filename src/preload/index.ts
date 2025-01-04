import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// 渲染器的自定义 API
const api = {
  onMessage: (listener: (event, ...data) => void) => ipcRenderer.on('on-message', listener),
  openLogFile: () => ipcRenderer.send('open-log-file'),
  windowHandlers: {
    isMainWindowMaximized: async () => await ipcRenderer.invoke('is-mainWindow-maximized'),
    toggleMaximized: async () => await ipcRenderer.invoke('toggle-window-maximize'),
    minimize: () => ipcRenderer.send('window-minimize'),
    close: () => ipcRenderer.send('window-close')
  },
  update: {
    checkForUpdates: () => ipcRenderer.send('check-for-updates'),
    installUpdate: () => ipcRenderer.send('install-update'),
    downloadUpdate: () => ipcRenderer.send('download-update'),
    onUpdate: (channel, listener: (event, data) => void) => ipcRenderer.on(channel, listener)
  },
  openai: {
    chat: {
      send: (messages) => ipcRenderer.send('on-chat-send', messages),
      onStream: (listener: (event, data) => void) => ipcRenderer.on('on-chat-stream', listener),
      onStreamEnd: (listener: (event, data) => void) =>
        ipcRenderer.on('on-chat-stream-end', listener),
      onStreamError: (listener: (event, data) => void) =>
        ipcRenderer.on('on-chat-stream-error', listener)
    }
  },
  sqlite: {
    insertTest: async (data) => await ipcRenderer.invoke('insert-test', data),
    selectTest: async () => await ipcRenderer.invoke('select-test')
  },
  userData: {
    setItem: async (key, value) => await ipcRenderer.invoke('user-data-setItem', key, value),
    getItem: async (key) => await ipcRenderer.invoke('user-data-getItem', key),
    removeItem: async (key) => await ipcRenderer.invoke('user-data-removeItem', key),
    clear: async () => await ipcRenderer.invoke('user-data-clear')
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

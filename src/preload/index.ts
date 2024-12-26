import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// 渲染器的自定义 API
const api = {
  onError: (listener: (event, data) => void) => ipcRenderer.on('on-error', listener),
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
  }
}
// export default () => {
//   ipcMain.on('on-chat-send', async (event, messages) => {
//     await openai.chat.completions
//       .create({
//         messages: messages,
//         model: import.meta.env.MAIN_VITE_OPENAI_API_MODEL,
//         stream: true
//       })
//       .then(async (completion) => {
//         for await (const part of completion) {
//           if (part.choices[0].delta.content) {
//             event.sender.send('on-chat-stream', part.choices[0].delta.content)
//           }
//           if (part.choices[0].finish_reason === 'stop') {
//             event.sender.send('on-chat-stream-end')
//           }
//         }
//       })
//       .catch((error) => {
//         logger.error(error)
//         event.sender.send('on-chat-stream-error', error)
//       })
//   })
// }

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

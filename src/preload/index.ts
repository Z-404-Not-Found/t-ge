import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// 渲染器的自定义 API
const api = {}

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

import { ElectronAPI } from '@electron-toolkit/preload'
import { ProgressInfo, UpdateInfo } from 'electron-updater'

type onUpdateChannel = {
  'check-for-updates': void
  'download-progress': ProgressInfo
  'update-available': UpdateInfo
  'update-not-available': string
  'update-error': string
  'update-downloaded': void
}
type onUpdateChannelKeys = keyof onUpdateChannel
type onUpdateChannelListener<T extends onUpdateChannelKeys> = (
  event: IpcRendererEvent,
  data: onUpdateChannel[T]
) => void

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      /**
       * 获取错误信息
       * @returns 错误信息
       */
      onError: (listener: (event: IpcRendererEvent, error: string) => void) => void
      /**
       * 窗口相关操作
       */
      windowHandlers: {
        /**
         * 获取窗口是否最大化
         * @returns true: 窗口最大化 false: 窗口非最大化
         */
        isMainWindowMaximized: () => Promise<boolean>
        /**
         * 窗口最大化
         * @returns true: 窗口最大化 false: 窗口非最大化
         */
        toggleMaximized: () => Promise<boolean>
        /**
         * 窗口最小化
         * @returns void
         */
        minimize: () => void
        /**
         * 窗口关闭
         * @returns void
         */
        close: () => void
      }
      /**
       * 更新相关操作
       */
      update: {
        /**
         * 检查更新
         * @returns void
         */
        checkForUpdates: () => void
        /**
         * 下载更新
         * @returns void
         */
        downloadUpdate: () => void
        /**
         * 安装更新
         * @returns void
         */
        installUpdate: () => void
        /**
         * 监听更新事件
         * @param channel 事件名，可选值：'check-for-updates' | 'download-progress' | 'update-available' | 'update-not-available' | 'update-error' | 'update-downloaded'
         * @param listener 事件监听器，其中：channel为'update-available'时，回调参数类型为UpdateInfo，'download-progress'为ProgressInfo，'check-for-updates'和 'update-downloaded'为void，其他为string
         */
        onUpdate: <T extends onUpdateChannelKeys>(
          channel: T,
          listener: onUpdateChannelListener<T>
        ) => void
      }
    }
  }
}

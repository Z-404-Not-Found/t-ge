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

type openaiChatMessage = {
  role: 'user' | 'assistant' | 'system'
  content:
    | string
    | {
        type: 'text' | 'image'
        content: string
      }
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      /**
       * 获取错误信息
       * @returns 错误信息
       */
      onMessage: (
        listener: (event: IpcRendererEvent, type: string, message: string) => void
      ) => void
      /**
       * 打开日志文件
       * @returns void
       */
      openLogFile: () => void
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
       * 更新相关接口
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
         * @returns void
         */
        onUpdate: <T extends onUpdateChannelKeys>(
          channel: T,
          listener: onUpdateChannelListener<T>
        ) => void
      }
      /**
       * AI供应商相关接口
       */
      aiProvider: {
        /**
         * 获取AI供应商列表
         * @returns AI供应商列表
         */
        getProviders: () => Promise<AiProvider[]>
        /**
         * 获取当前AI供应商
         * @returns 当前AI供应商
         */
        getCurrentProvider: () => Promise<AiProvider>
        /**
         * 添加AI供应商
         * @param provider AI供应商
         * @returns Update Success
         */
        updateProvider: (provider: AiProvider) => Promise<string>
      }
      /**
       * AI相关接口
       */
      ai: {
        /**
         * 聊天接口
         */
        chat: {
          /**
           * 发送消息
           * @param messages 消息列表
           * @returns void
           */
          send: (messages: openaiChatMessage[]) => void
          /**
           * 接收消息
           * @param listener 接收消息，回调参数类型为string，是流式输出的消息
           * @returns void
           */
          onStream: (listener: (event: IpcRendererEvent, data: string) => void) => void
          /**
           * 接收消息结束
           * @param listener 接收消息结束
           * @returns void
           */
          onStreamEnd: (listener: () => void) => void
          /**
           * 接收消息错误
           * @param listener 接收消息错误，回调参数类型为string
           * @returns void
           */
          onStreamError: (listener: (event: IpcRendererEvent, data: string) => void) => void
        }
      }
      sqlite: {
        insertTest: (data: string) => Promise<void>
        selectTest: () => Promise<string[]>
      }
      userData: {
        /**
         * 设置用户数据
         * @param key 键
         * @param value 值
         * @returns void
         */
        setItem: (key: string, value: string) => void
        /**
         * 获取用户数据
         * @param key 键
         * @returns 值
         */
        getItem: (key: string) => Promise<object | null>
        /**
         * 删除用户数据
         * @param key 键
         * @returns void
         */
        removeItem: (key: string) => void
        /**
         * 清空用户数据
         * @returns void
         */
        clear: () => void
      }
    }
  }
}

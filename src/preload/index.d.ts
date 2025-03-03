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
        listener: (
          event: IpcRendererEvent,
          severity: 'error' | 'success' | 'secondary' | 'info' | 'warn' | 'contrast',
          summary: string,
          detail: string
        ) => void
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
         * 窗口最大化
         * @returns void
         */
        toggleMaximized: () => void
        /**
         * 窗口是否最大化
         * @param listener 窗口是否最大化
         * @returns void
         */
        isMaximized: (listener: (event: IpcRendererEvent, data: void) => void) => void
        /**
         * 窗口是否未最大化
         * @param listener 窗口是否未最大化
         * @returns void
         */
        isUnmaximized: (listener: (event: IpcRendererEvent, data: void) => void) => void
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
        /**
         * 更新AI供应商模型
         * @param model 模型
         * @returns Update Success
         */
        updateProviderModel: (model: string) => Promise<string>
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
           * 接收推理消息
           * @param listener 接收推理消息，回调参数类型为string，是流式输出的推理消息
           * @returns void
           */
          onReasoningStream: (listener: (event: IpcRendererEvent, data: string) => void) => void
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
          /**
           * 停止聊天流
           * @returns void
           */
          stopChatStream: () => void
          /**
           * 移除消息接收事件
           * @returns void
           */
          offStream: () => void
        }
        /**
         * 获取模型列表
         * @returns Promise
         */
        getModelList: () => Promise<[]>
      }
      store: {
        /**
         * 设置用户数据
         * @param key 键
         * @param value 值
         * @returns void
         */
        setItem: (key: string, value) => void
        /**
         * 获取用户数据
         * @param key 键
         * @returns 值
         */
        getItem: (key: string) => Promise<>
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
      /**
       * 打开Github
       * @returns void
       */
      openGithub: () => void
      /**
       * 对话相关接口
       */
      conversation: {
        /**
         * 添加对话
         * @param roleId 角色ID
         * @returns 新建对话成功
         */
        add: (roleId: number) => Promise<string | null>
        /**
         * 更新对话标题
         * @param params 对话参数
         * @returns 更新对话标题成功
         */
        updateTitle: (params: { id: number; title: string }) => Promise<number>
        /**
         * 获取对话列表
         * @param roleId 角色ID
         * @returns 对话列表
         */
        get: (roleId: number) => Promise<
          Array<{
            id: number
            title: string
            role_id: number
            created_at: string
            updated_at: string
            role_name: string
            role_description: string
            role_definition: string
          }>
        >
        /**
         * 更新对话更新时间
         * @param params 对话参数
         * @returns 更新对话成功
         */
        updateUpdatedAtById: (params: {
          id: number
          updated_at: string
        }) => Promise<string | number>
        /**
         * 删除对话
         * @param id 对话ID
         * @returns 删除
         */
        delete: (id: number) => Promise<number | string>
      }
      /**
       * 消息相关接口
       */
      message: {
        /**
         * 添加消息
         * @param params 消息参数
         * @returns 消息ID
         */
        addMessage: (params: {
          conversationId: number
          content: string
          reasoningContent?: string
          type?: 'text' | 'image' | 'audio'
          senderRole: number
          isReasoning?: boolean
        }) => Promise<number | null>
        /**
         * 更新消息
         * @param params 消息参数
         * @returns 更新消息成功
         */
        updateMessageById: (params: {
          messageId: number
          content: string
        }) => Promise<string | number>
        /**
         * 更新推理消息
         * @param params 消息参数
         * @returns 更新推理消息成功
         */
        updateReasoningMessageById: (params: {
          messageId: number
          reasoningContent: string
        }) => Promise<string | number>
        /**
         * 删除消息
         * @param id 消息ID
         * @returns 删除消息数量
         */
        deleteMessagesById: (id: number) => Promise<number>
        /**
         * 获取消息列表
         * @param conversationId 对话ID
         * @returns 消息列表
         */
        getMessagesByConversationId: (conversationId: number) => Promise<
          Array<{
            id: number
            content: string
            reasoningContent: string
            type: 'text' | 'image' | 'audio'
            senderRole: number
            isReasoning: boolean
            timestamp: string
          }>
        >
        /**
         * 获取最新消息
         * @param params 对话ID和数量
         * @returns 消息列表
         */
        getLastMessageByConversationId: (params: {
          conversationId: number
          count: number
        }) => Promise<
          Array<{
            id: number
            content: string
            reasoningContent: string
            type: 'text' | 'image' | 'audio'
            senderRole: number
            isFinished: boolean
            isReasoning: boolean
            timestamp: string
          }>
        >
        /**
         * 设置最新消息已完成
         * @returns void
         */
        setLastMessageIsFinished: () => void
        /**
         * 获取消息
         * @param id 消息ID
         * @returns 消息
         */
        getMessageById: (id: number) => Promise<{
          id: number
          content: string
          reasoningContent: string
          type: 'text' | 'image' | 'audio'
          senderRole: number
          isReasoning: boolean
          timestamp: string
        }>
      }
      /**
       * 角色相关接口
       */
      role: {
        /**
         * 添加角色
         * @param params 角色参数
         * @returns 角色ID
         */
        add: (params: {
          name: string
          description: string
          definition: string
        }) => Promise<string | number | null>
        /**
         * 删除角色
         * @param id 角色ID
         * @returns 删除成功
         */
        delete: (id: number) => Promise<string | number>
        /**
         * 获取角色列表
         * @returns 角色列表
         */
        get: () => Promise<
          Array<{
            id: number
            name: string
            description: string
            definition: string
            created_at: string
          }>
        >
        /**
         * 更新角色
         * @param params 角色参数
         * @returns 更新角色成功
         */
        update: (params: {
          id: number
          name: string
          description: string
          definition: string
        }) => Promise<string | number>
        /**
         * 更新角色更新时间
         * @param params 角色参数
         * @returns 更新角色成功
         */
        updateUpdatedAtById: (params: {
          id: number
          updated_at: string
        }) => Promise<string | number>
        /**
         * 获取角色
         * @param name 角色名称
         * @returns 角色
         */
        getRoleByName: (name: string) => Promise<{
          id: number
          name: string
          description: string
          definition: string
          created_at: string
        }>
      }
      saveImage: (arrayBuffer: ArrayBuffer) => Promise<string>
    }
  }
}

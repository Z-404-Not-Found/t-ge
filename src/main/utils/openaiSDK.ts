import { ipcMain } from 'electron'
import { OpenAI } from 'openai'
import logger from '../utils/logger'

const chatInit = (openai: OpenAI, model: string) => {
  ipcMain.removeAllListeners('on-chat-send')
  ipcMain.on('on-chat-send', async (event, messages) => {
    try {
      const completion = await openai.chat.completions.create({
        messages: messages,
        model: model,
        stream: true
      })
      ipcMain.removeAllListeners('stop-chat-stream')
      ipcMain.on('stop-chat-stream', () => {
        completion.controller.abort()
      })
      for await (const chunk of completion) {
        // @ts-ignore openai包的问题，delta.reasoning_content是可选的
        if (chunk.choices[0].delta.reasoning_content) {
          // @ts-ignore openai包的问题，delta.reasoning_content是可选的
          event.sender.send('on-chat-reasoning-stream', chunk.choices[0].delta.reasoning_content)
        } else if (chunk.choices[0].delta.content !== null) {
          event.sender.send('on-chat-stream', chunk.choices[0].delta.content)
        }
        if (chunk.choices[0].finish_reason === 'stop') {
          event.sender.send('on-chat-stream-end')
        }
      }
    } catch (error) {
      event.sender.send('on-chat-stream-error', error)
      logger.error('openai SDK chat API Error: ' + error)
    }
  })
}

const getModelListInit = (openai: OpenAI) => {
  ipcMain.removeHandler('get-model-list')
  ipcMain.handle('get-model-list', async () => {
    return (await openai.models.list()).data
  })
}

export default (aiProviderRequiredValues: AiProviderRequiredValues) => {
  const openai = new OpenAI({
    apiKey: aiProviderRequiredValues.apiKey,
    baseURL: aiProviderRequiredValues.baseURL
  })
  chatInit(openai, aiProviderRequiredValues.model)
  getModelListInit(openai)
}

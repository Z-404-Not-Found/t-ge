import { ipcMain } from 'electron'
import { OpenAI } from 'openai'
import logger from '../utils/logger'

const chatInit = (openai: OpenAI, model: string) => {
  ipcMain.removeAllListeners('on-chat-send')
  ipcMain.on('on-chat-send', async (event, messages) => {
    await openai.chat.completions
      .create({
        messages: messages,
        model: model,
        stream: true
      })
      .then(async (completion) => {
        for await (const part of completion) {
          if (part.choices[0].delta.content) {
            event.sender.send('on-chat-stream', part.choices[0].delta.content)
          }
          if (part.choices[0].finish_reason === 'stop') {
            event.sender.send('on-chat-stream-end')
          }
        }
      })
      .catch((error) => {
        logger.error('openai SDK chat API Error: ' + error)
        event.sender.send('on-chat-stream-error', error)
      })
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

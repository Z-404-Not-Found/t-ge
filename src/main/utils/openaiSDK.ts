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
        logger.error('openai SDK API Error: ' + error)
        event.sender.send('on-chat-stream-error', error)
      })
  })
}

export default (baseURL: string, apiKey: string, model: string) => {
  const openai = new OpenAI({
    apiKey: apiKey,
    baseURL: baseURL
  })
  chatInit(openai, model)
}

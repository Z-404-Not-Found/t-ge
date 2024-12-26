import { ipcMain } from 'electron'
import { OpenAI } from 'openai'
import logger from '../utils/logger'

const openai = new OpenAI({
  apiKey: import.meta.env.MAIN_VITE_OPENAI_API_KEY,
  baseURL: import.meta.env.MAIN_VITE_OPENAI_API_BASE_URL
})

export default () => {
  ipcMain.on('on-chat-send', async (event, messages) => {
    await openai.chat.completions
      .create({
        messages: messages,
        model: import.meta.env.MAIN_VITE_OPENAI_API_MODEL,
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
        logger.error('openai接口错误:' + error)
        event.sender.send('on-chat-stream-error', error)
      })
  })
}

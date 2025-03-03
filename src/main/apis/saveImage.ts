import { ipcMain, app } from 'electron'
import { promises as fs } from 'fs'
import path from 'path'
import logger from '../utils/logger'

export default () => {
  ipcMain.handle('save-image', async (_event, arrayBuffer) => {
    try {
      const buffer = Buffer.from(arrayBuffer)
      const downloadsPath = app.getPath('downloads')
      const fileName = `chat_${Date.now()}.png`
      const filePath = path.join(downloadsPath, fileName)

      await fs.writeFile(filePath, buffer)
      return 'success'
    } catch (error) {
      logger.error(error)
      return 0
    }
  })
}

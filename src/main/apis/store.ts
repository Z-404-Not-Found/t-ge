import { app, ipcMain } from 'electron'
import { join } from 'path'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import logger from '../utils/logger'

const userDataPath = join(app.getPath('userData'), './userData')
const dataFilePath = join(userDataPath, 'data.json')

if (!existsSync(userDataPath)) {
  mkdirSync(userDataPath)
}

if (!existsSync(dataFilePath)) {
  writeFileSync(dataFilePath, JSON.stringify({}))
}

const readData = () => {
  try {
    const data = readFileSync(dataFilePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    logger.error('[main] store读取Json错误' + error)
    return {}
  }
}

const writeData = (data) => {
  try {
    writeFileSync(dataFilePath, JSON.stringify(data, null, 2))
  } catch (error) {
    logger.error('[main] store写入Json错误' + error)
  }
}

export default () => {
  ipcMain.handle('user-data-setItem', (_event, key, value) => {
    const data = readData()
    data[key] = value
    writeData(data)
    return '保存成功'
  })

  ipcMain.handle('user-data-getItem', (_event, key) => {
    const data = readData()
    return data[key] || null
  })

  ipcMain.handle('user-data-removeItem', (_event, key) => {
    const data = readData()
    if (data[key]) {
      delete data[key]
      writeData(data)
      return '删除成功'
    } else {
      return '该键不存在'
    }
  })

  ipcMain.handle('user-data-clear', () => {
    writeData({})
    return '清空成功'
  })
}

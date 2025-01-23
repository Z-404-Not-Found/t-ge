import { app } from 'electron'
import { join } from 'path'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import logger from '../utils/logger'

const userDataPath = join(app.getPath('userData'), './userData')
const dataFilePath = join(userDataPath, 'userData.json')

export const storeInit = () => {
  if (!existsSync(userDataPath)) {
    mkdirSync(userDataPath)
  }
  if (!existsSync(dataFilePath)) {
    writeFileSync(dataFilePath, JSON.stringify({}))
  }
}

const readData = () => {
  try {
    const data = readFileSync(dataFilePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    logger.error('Store READ Json Error: ' + error)
    return {}
  }
}

const writeData = (data) => {
  try {
    writeFileSync(dataFilePath, JSON.stringify(data, null, 2))
  } catch (error) {
    logger.error('Store WRITE Json Error: ' + error)
  }
}

export default {
  setItem: (key, value) => {
    const data = readData()
    data[key] = value
    writeData(data)
  },
  getItem: (key) => {
    const data = readData()
    return data[key] || null
  },
  removeItem: (key) => {
    const data = readData()
    if (data[key]) {
      delete data[key]
      writeData(data)
    } else {
      return
    }
  },
  clear: () => {
    writeData({})
  }
}

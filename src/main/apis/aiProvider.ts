import { ipcMain } from 'electron'
import store from '../utils/store'
import { aiProviders } from '../../configs/aiProviders'
import chatInit from './chat'

if (!store.getItem('currentAiProvider')) {
  store.setItem('aiProviders', aiProviders)
}

if (store.getItem('aiProviders').length < aiProviders.length) {
  const existingAiProviders = store.getItem('aiProviders')
  aiProviders.forEach((item) => {
    if (!existingAiProviders.find((item2) => item2.key === item.key)) {
      existingAiProviders.push(item)
    }
  })
  store.setItem('aiProviders', existingAiProviders)
}

if (store.getItem('currentAiProvider')) {
  chatInit(store.getItem('currentAiProvider'))
}

export default () => {
  ipcMain.handle('ai-provider-update', (_event, aIProvider: AiProvider) => {
    chatInit(aIProvider)
    store.setItem('currentAiProvider', aIProvider)
    const existingAiProviders = store.getItem('aiProviders')
    existingAiProviders.forEach((item, index, arr) => {
      if (item.key === aIProvider.key) {
        arr[index] = aIProvider
      }
    })
    store.setItem('aiProviders', existingAiProviders)
    return 'Update Success'
  })
  ipcMain.handle('ai-provider-get', () => {
    return store.getItem('aiProviders')
  })
  ipcMain.handle('ai-provider-get-current', () => {
    return store.getItem('currentAiProvider')
  })
}

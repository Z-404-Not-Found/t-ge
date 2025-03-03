import windowHandlersInit from './windowHandlers'
import updaterInit from './update'
import storeInit from './store'
import aiProviderInit from './aiProvider'
import openGithub from './openGithub'
import roleInit from './role'
import conversationInit from './conversation'
import chatInit from './chat'
import chatOptionInit from './chatOption'
import saveImageInit from './saveImage'

export default () => {
  windowHandlersInit()
  updaterInit()
  storeInit()
  aiProviderInit()
  openGithub()
  roleInit()
  conversationInit()
  chatInit()
  chatOptionInit()
  saveImageInit()
}

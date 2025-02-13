import windowHandlersInit from './windowHandlers'
import updaterInit from './update'
import sqliteInit from './sqlite'
import storeInit from './store'
import aiProviderInit from './aiProvider'
import openGithub from './openGithub'

export default () => {
  windowHandlersInit()
  updaterInit()
  sqliteInit()
  storeInit()
  aiProviderInit()
  openGithub()
}

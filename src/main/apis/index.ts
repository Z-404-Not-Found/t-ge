import windowHandlersInit from './windowHandlers'
import updaterInit from './update'
import openaiInit from './openai'
import sqliteInit from './sqlite'
import storeInit from './store'

export default () => {
  windowHandlersInit()
  updaterInit()
  openaiInit()
  sqliteInit()
  storeInit()
}

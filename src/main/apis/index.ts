import windowHandlersInit from './windowHandlers'
import updaterInit from './update'
import openaiInit from './openai'
import sqliteInit from './sqlite'

export default () => {
  windowHandlersInit()
  updaterInit()
  openaiInit()
  sqliteInit()
}

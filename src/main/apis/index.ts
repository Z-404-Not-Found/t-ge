import windowHandlersInit from './windowHandlers'
import updaterInit from './update'
import openaiInit from './openai'

export default () => {
  windowHandlersInit()
  updaterInit()
  openaiInit()
}

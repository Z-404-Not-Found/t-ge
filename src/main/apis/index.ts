import windowHandlersInit from './windowHandlers'
import updaterInit from './update'

export default () => {
  windowHandlersInit()
  updaterInit()
}

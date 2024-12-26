import log from 'electron-log/renderer'

export default {
  info: (param) => log.info('[renderer] ' + param),
  error: (param) => log.error('[renderer] ' + param),
  warn: (param) => log.warn('[renderer] ' + param),
  debug: (param) => log.debug('[renderer] ' + param)
}

import log from 'electron-log/main'

export const loggerInit = () => {
  log.initialize()
  log.transports.file.level = 'info'
  log.transports.console.level = 'debug'
  log.transports.file.maxSize = 1024 * 1024 * 10
  log.transports.file.fileName = 'logs.log'
}

export default {
  info: (param) => log.info('[main] ' + param),
  error: (param) => log.error('[main] ' + param),
  warn: (param) => log.warn('[main] ' + param),
  debug: (param) => log.debug('[main] ' + param)
}

import openAiInit from './openaiSDK'

export default (aiProvider: AiProvider) => {
  if (aiProvider.supportsOpenAI) {
    openAiInit(aiProvider.requiredValues)
  } else if (aiProvider.key === 'ernie') {
    console.log('ernie', aiProvider.requiredValues.secretKey, aiProvider.requiredValues.accessKey)
    return
  }
}

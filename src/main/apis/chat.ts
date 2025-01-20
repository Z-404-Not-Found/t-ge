import openaiInit from '../utils/openaiSDK'

export default (aIProvider: AiProvider) => {
  if (aIProvider.supportsOpenAI) {
    openaiInit(
      aIProvider.requiredValues.baseURL,
      aIProvider.requiredValues.apiKey!,
      aIProvider.requiredValues.model
    )
  } else if (aIProvider.key === 'ernie') {
    console.log('ernie', aIProvider.requiredValues.secretKey, aIProvider.requiredValues.accessKey)
    return
  }
}

/// <reference types="vite/client" />

interface AiProvider {
  name: string
  key: string
  supportsOpenAI: boolean
  requiredValues: {
    baseURL: string
    model: string
    apiKey?: string
    secretKey?: string
    accessKey?: string
  }
}

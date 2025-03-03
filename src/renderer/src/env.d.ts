/// <reference types="vite/client" />

interface AiProvider {
  name: string
  key: string
  supportsOpenAI: boolean
  icon: string
  requiredValues: {
    baseURL: string
    model: string
    apiKey?: string
    secretKey?: string
    accessKey?: string
  }
}

type openaiChatMessage = {
  role: 'user' | 'assistant' | 'system'
  content:
    | string
    | {
        type: 'text' | 'image'
        content: string
      }
}

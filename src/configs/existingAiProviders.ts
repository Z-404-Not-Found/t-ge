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

export const aiProviders: AiProvider[] = [
  {
    name: 'OpenAI',
    key: 'openai',
    supportsOpenAI: true,
    icon: 'openai.svg',
    requiredValues: {
      baseURL: 'https://api.openai.com/v1',
      apiKey: 'your-apiKey',
      model: 'gpt-4o-mini'
    }
  },
  {
    name: '通义千问',
    key: 'qwen',
    supportsOpenAI: true,
    icon: 'qwen.svg',
    requiredValues: {
      baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
      apiKey: 'your-apiKey',
      model: 'qwen-turbo'
    }
  },
  // {
  //   name: '文心一言',
  //   key: 'ernie',
  //   supportsOpenAI: false,
  //   reasoner: [],
  //   requiredValues: {
  //     baseURL: 'baseURL',
  //     accessKey: 'your-accessKey',
  //     secretKey: 'your-secretKey',
  //     model: 'ernie-bot-turbo'
  //   }
  // },
  {
    name: 'deepseek深度求索',
    key: 'deepseek',
    supportsOpenAI: true,
    icon: 'deepseek.svg',
    requiredValues: {
      baseURL: 'https://api.deepseek.com/v1',
      apiKey: 'your-apiKey',
      model: 'deepseek-chat'
    }
  }
]

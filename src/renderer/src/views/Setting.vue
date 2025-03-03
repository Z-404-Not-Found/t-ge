<template>
  <div class="h-full w-full overflow-y-auto pr-1 flex flex-col gap-1">
    <Fieldset legend="主题">
      <div class="flex justify-between">
        <div class="flex-1">
          <div class="font-black">颜色模式</div>
          <div class="text-sm text-gray-500">设置暗黑模式，默认跟随系统</div>
        </div>
        <div>
          <SelectButton
            v-model="toggleDarkModeModel"
            :options="toggleDarkModeOptions"
            optionLabel="name"
            optionValue="value"
            :allowEmpty="false"
            @change="toggleDarkModeChange"
          />
        </div>
      </div>
      <Divider />
      <div class="flex justify-between">
        <div class="flex-1">
          <div class="font-black">主题风格</div>
          <div class="text-sm text-gray-500">设置主题风格</div>
        </div>
        <div>
          <SelectButton
            v-model="toggleThemeModel"
            :options="toggleThemeOptions"
            optionLabel="name"
            optionValue="value"
            :allowEmpty="false"
            @change="toggleThemeChange"
          />
        </div>
      </div>
    </Fieldset>
    <Fieldset legend="AI">
      <div class="flex justify-between">
        <div class="flex-1">
          <div class="font-black">AI服务商</div>
          <div class="text-sm text-gray-500">选择AI服务商（其他服务商陆续更新中……）</div>
        </div>
        <div>
          <Select
            v-model="aiProviderSelectedKey"
            :options="aiProviderOptions"
            optionLabel="name"
            optionValue="key"
            placeholder="AI Provider"
            @change="changeProvider"
          ></Select>
          <Button
            class="ml-2"
            severity="contrast"
            :disabled="!aiProviderSelected"
            @click="updateAiProvider"
            >更新</Button
          >
        </div>
      </div>
      <div
        v-for="(value, key, index) in aiProviderList?.find(
          (item) => item.key === aiProviderSelectedKey
        )?.requiredValues"
        :key="index"
      >
        <Divider />
        <div class="flex justify-between">
          <div class="flex-1">
            <div class="font-black">
              {{
                key === 'baseURL'
                  ? 'API地址'
                  : key === 'model'
                    ? '模型'
                    : key === 'apiKey'
                      ? 'API Key'
                      : key === 'secretKey'
                        ? 'Secret Key'
                        : key === 'accessKey'
                          ? 'Access Key'
                          : 'Unknown'
              }}
            </div>
            <div class="text-sm text-gray-500">
              {{
                key === 'baseURL'
                  ? 'API地址，例如：https://api.openai.com/v1'
                  : key === 'model'
                    ? '模型，例如：gpt-4o-mini，（注：暂不支持多模态模型，多模态功能正在陆续更新……）'
                    : key === 'apiKey'
                      ? 'API Key，例如：sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
                      : key === 'secretKey'
                        ? 'Secret Key，请填写从AI服务商获得的Secret Key'
                        : key === 'accessKey'
                          ? 'Access Key，请填写从AI服务商获得的Access Key'
                          : 'Unknown'
              }}
            </div>
          </div>
          <div>
            <div v-if="key === 'model'">
              <Select
                v-model="aiProviderSelected.requiredValues[key]"
                :options="aiProviderModelOptions"
                optionLabel="name"
                optionValue="key"
                placeholder="AI Model"
                :loading="isGettingModelList"
                @focus="focusModelListSelect"
              ></Select>
            </div>
            <div v-else>
              <InputText
                v-model="aiProviderSelected.requiredValues[key]"
                :placeholder="value"
              ></InputText>
            </div>
          </div>
        </div>
      </div>
    </Fieldset>
    <Fieldset legend="对话参数">
      <div class="flex justify-between">
        <div class="flex-1">
          <div class="font-black">上下文长度</div>
          <div class="text-sm text-gray-500">
            每次对话一同发送的历史消息数，次参数会影响对话的记忆长度
          </div>
        </div>
        <div>
          <InputNumber
            v-model="rememberContextLength"
            showButtons
            :min="1"
            :max="32"
            fluid
            @update:modelValue="setRememberContextLength"
          />
        </div>
      </div>
      <!-- <Divider /> -->
    </Fieldset>
    <Fieldset legend="关于">
      <div class="flex justify-between">
        <div class="flex-1">
          <div class="font-black">检查更新</div>
          <div class="text-sm text-gray-500">检查是否有新版本</div>
        </div>
        <div>
          <Button
            :icon="checkUpdateInfo"
            :label="checkUpdateStatus"
            :loading="isCheckingForUpdate"
            severity="contrast"
            @click="userCheckUpdate"
          ></Button>
        </div>
      </div>
      <Divider />
      <div class="flex justify-between">
        <div class="flex-1">
          <div class="font-black">GitHub</div>
          <div class="text-sm text-gray-500">
            访问GitHub仓库，如果此项目对你有帮助，请点击star🌟，谢谢
          </div>
        </div>
        <div>
          <Button
            icon="pi pi-github"
            label="GitHub"
            severity="contrast"
            @click="openGithub"
          ></Button>
        </div>
      </div>
    </Fieldset>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, onMounted, toRaw } from 'vue'
import toggleDarkMode from '@renderer/utils/toggleDarkMode'
import toggleTheme from '@renderer/utils/toggleTheme'

const onMessage = inject('onMessage') as (data: {
  severity: 'error' | 'success' | 'secondary' | 'info' | 'warn' | 'contrast'
  summary: string
  detail: string
}) => void

const isNoAvailableUpdate = ref(false)
const isCheckingForUpdate = ref(false)
const checkUpdateStatus = ref('检查更新')
const checkUpdateInfo = ref('pi pi-sync')
const userCheckUpdate = () => {
  window.api.update.onUpdate('update-not-available', () => {
    isCheckingForUpdate.value = false
    checkUpdateStatus.value = '已经是最新版本'
    checkUpdateInfo.value = 'pi pi-check'
    isNoAvailableUpdate.value = true
  })
  window.api.update.onUpdate('update-available', () => {
    isCheckingForUpdate.value = false
    checkUpdateStatus.value = '发现新版本'
    checkUpdateInfo.value = 'pi pi-arrow-circle-up'
    isCheckingForUpdate.value = false
  })
  window.api.onMessage(() => {
    isCheckingForUpdate.value = false
  })
  window.api.update.checkForUpdates()
  isCheckingForUpdate.value = true
  checkUpdateStatus.value = '检查中...'
}

const toggleDarkModeModel = ref('system')
const toggleDarkModeOptions = ref([
  {
    name: '跟随系统',
    value: 'system'
  },
  {
    name: '深色模式',
    value: 'dark'
  },
  {
    name: '浅色模式',
    value: 'light'
  }
])
const toggleDarkModeChange = (event) => {
  toggleDarkMode(event.value)
}

const toggleThemeModel = ref('Aura')
const toggleThemeOptions = ref([
  {
    name: 'Aura',
    value: 'Aura'
  },
  {
    name: 'Nora',
    value: 'Nora'
  },
  {
    name: 'Lara',
    value: 'Lara'
  },
  {
    name: 'Material',
    value: 'Material'
  }
])
const toggleThemeChange = (event) => {
  toggleTheme(event.value)
}

const aiProviderList = ref<AiProvider[]>()
const aiProviderOptions = ref()
const aiProviderSelectedKey = ref<string>()
const aiProviderSelected = ref()
const aiProviderModelList = ref()
const aiProviderModelOptions = ref()
const isGettingModelList = ref(false)

const changeProvider = async () => {
  aiProviderModelOptions.value = []
  aiProviderSelected.value = aiProviderList.value!.find(
    (item) => item.key === aiProviderSelectedKey.value
  )
  await updateAiProvider()
  getModelList()
}

const updateAiProvider = async () => {
  if (
    !aiProviderSelected.value.requiredValues.baseURL.endsWith('/v1') &&
    aiProviderSelected.value.supportsOpenAI
  ) {
    if (aiProviderSelected.value.requiredValues.baseURL.endsWith('/')) {
      aiProviderSelected.value.requiredValues.baseURL =
        aiProviderSelected.value.requiredValues.baseURL + 'v1'
    } else {
      aiProviderSelected.value.requiredValues.baseURL =
        aiProviderSelected.value.requiredValues.baseURL + '/v1'
    }
  }
  await window.api.aiProvider.updateProvider(toRaw(aiProviderSelected.value)).then((data) => {
    onMessage({
      severity: 'success',
      summary: data,
      detail: '更新成功'
    })
  })
}

const openGithub = () => {
  window.api.openGithub()
}

const getModelList = () => {
  if (aiProviderModelList.value?.length !== 0) {
    isGettingModelList.value = true
    if (
      aiProviderSelected.value.requiredValues.secretKey
        ? /^your-.*Key$/.test(aiProviderSelected.value.requiredValues.secretKey)
        : aiProviderSelected.value.requiredValues.accessKey
          ? /^your-.*Key$/.test(aiProviderSelected.value.requiredValues.accessKey)
          : /^your-.*Key$/.test(aiProviderSelected.value.requiredValues.apiKey)
    ) {
      onMessage({
        severity: 'warn',
        summary: '获取模型列表失败',
        detail: '请填写API Key、Secret Key或Access Key'
      })
      isGettingModelList.value = false
    } else {
      window.api.ai
        .getModelList()
        .then((data) => {
          isGettingModelList.value = false
          aiProviderModelList.value = data
          aiProviderModelOptions.value = aiProviderModelList.value.map((item) => {
            return {
              name: item.id,
              key: item.id
            }
          })
        })
        .catch((err) => {
          isGettingModelList.value = false
          onMessage({
            severity: 'error',
            summary: '获取模型列表失败',
            detail: err
          })
        })
    }
  }
}

const focusModelListSelect = async () => {
  if (
    !aiProviderSelected.value.requiredValues.baseURL.endsWith('/v1') &&
    aiProviderSelected.value.supportsOpenAI
  ) {
    aiProviderSelected.value.requiredValues.baseURL =
      aiProviderSelected.value.requiredValues.baseURL + '/v1'
  }
  aiProviderModelOptions.value = []
  await window.api.aiProvider.updateProvider(toRaw(aiProviderSelected.value))
  getModelList()
}

const rememberContextLength = ref()

const setRememberContextLength = () => {
  window.api.store.setItem('rememberContextLength', rememberContextLength.value)
}

onMounted(async () => {
  window.api.aiProvider.getProviders().then((data) => {
    aiProviderList.value = data
    aiProviderOptions.value = data.map((item) => {
      return {
        name: item.name,
        key: item.key
      }
    })
  })
  window.api.aiProvider.getCurrentProvider().then((data) => {
    aiProviderSelectedKey.value = data?.key
    aiProviderSelected.value = data
    if (data) {
      getModelList()
    }
  })
  window.api.store.getItem('theme').then((theme) => {
    toggleDarkModeModel.value = theme.darkMode
    toggleThemeModel.value = theme.theme
  })
  rememberContextLength.value = await window.api.store.getItem('rememberContextLength')
})
</script>

<style scoped lang="scss"></style>

<template>
  <div>
    <div>Setting</div>
    <Button class="mr-4" icon="pi pi-sync" @click="userCheckUpdate"></Button>
    <SelectButton
      v-model="toggleDarkMode"
      :options="toggleDarkModeOptions"
      optionLabel="name"
      optionValue="value"
      @change="toggleDarkModeChange"
    />
    <div>
      <Select
        v-model="aiProviderSelectedKey"
        :options="aiProviderOptions"
        optionLabel="name"
        optionValue="key"
        placeholder="AI Provider"
        @change="
          () => {
            aiProviderSelected = aiProviderList!.find((item) => item.key === aiProviderSelectedKey)
          }
        "
      ></Select>
      <div
        v-for="(value, key, index) in aiProviderList?.find(
          (item) => item.key === aiProviderSelectedKey
        )?.requiredValues"
        :key="index"
      >
        <label :for="key"> {{ key }}</label>
        <InputText
          :id="key"
          v-model="aiProviderSelected.requiredValues[key]"
          :placeholder="value"
        ></InputText>
      </div>
      <Button @click="updateAiProvider">updateAiProvider</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, onMounted, toRaw } from 'vue'

const onMessage = inject('onMessage') as (type: string, message: string) => void

const isNoAvailableUpdate = ref<boolean>(false)
const isCheckingForUpdate = ref<boolean>(false)
const updateStatus = ref<string>('')
const userCheckUpdate = () => {
  window.api.update.onUpdate('update-not-available', () => {
    isCheckingForUpdate.value = false
    updateStatus.value = '已经是最新版本！'
    isNoAvailableUpdate.value = true
  })
  window.api.update.onUpdate('update-available', () => {
    isCheckingForUpdate.value = false
  })
  window.api.onMessage(() => {
    isCheckingForUpdate.value = false
  })
  window.api.update.checkForUpdates()
  isCheckingForUpdate.value = true
}

const aiProviderList = ref<AiProvider[]>()
const aiProviderOptions = ref()
const aiProviderSelectedKey = ref<string>()
const aiProviderSelected = ref()
const updateAiProvider = () => {
  window.api.aiProvider.updateProvider(toRaw(aiProviderSelected.value)).then((data) => {
    onMessage('info', data)
  })
}

const toggleDarkMode = ref('system')
const toggleDarkModeOptions = ref([
  {
    name: '跟随系统',
    value: 'system'
  },
  {
    name: '暗黑模式',
    value: 'dark'
  },
  {
    name: '白天模式',
    value: 'light'
  }
])
const toggleDarkModeChange = (event) => {
  window.api.windowHandlers.toggleDarkMode(event.value)
}
onMounted(() => {
  window.api.store.getItem('windowHandlers').then((data) => {
    if (data.darkMode === 'dark') {
      toggleDarkMode.value = 'dark'
    } else if (data.darkMode === 'light') {
      toggleDarkMode.value = 'light'
    } else {
      toggleDarkMode.value = 'system'
    }
  })
  window.api.aiProvider.getProviders().then((data) => {
    aiProviderList.value = data
    aiProviderOptions.value = data.map((item) => {
      return {
        name: item.name,
        key: item.key
      }
    })
  })
})
</script>

<style lang="scss" scoped></style>

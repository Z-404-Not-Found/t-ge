<template>
  <div>
    <div>Setting</div>
    <Button
      class="mr-4"
      :icon="checkUpdateInfo"
      :label="checkUpdateStatus"
      :loading="isCheckingForUpdate"
      @click="userCheckUpdate"
    ></Button>
    <SelectButton
      v-model="toggleDarkModeModel"
      :options="toggleDarkModeOptions"
      optionLabel="name"
      optionValue="value"
      :allowEmpty="false"
      @change="toggleDarkModeChange"
    />
    <SelectButton
      v-model="toggleThemeModel"
      :options="toggleThemeOptions"
      optionLabel="name"
      optionValue="value"
      :allowEmpty="false"
      @change="toggleThemeChange"
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
import toggleDarkMode from '@renderer/utils/toggleDarkMode'
import toggleTheme from '@renderer/utils/toggleTheme'

const onMessage = inject('onMessage') as (type: string, message: string) => void

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
    name: '暗黑模式',
    value: 'dark'
  },
  {
    name: '白天模式',
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
const updateAiProvider = () => {
  window.api.aiProvider.updateProvider(toRaw(aiProviderSelected.value)).then((data) => {
    onMessage('info', data)
  })
}

onMounted(() => {
  window.api.aiProvider.getProviders().then((data) => {
    aiProviderList.value = data
    aiProviderOptions.value = data.map((item) => {
      return {
        name: item.name,
        key: item.key
      }
    })
  })
  window.api.store.getItem('theme').then((theme) => {
    toggleDarkModeModel.value = theme.darkMode
    toggleThemeModel.value = theme.theme
  })
})
</script>

<style scoped lang="scss"></style>

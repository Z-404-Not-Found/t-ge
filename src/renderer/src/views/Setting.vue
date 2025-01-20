<template>
  <div>
    <div>Setting</div>
    <v-btn class="mr-4" icon="mdi-update" variant="text" @click="userCheckUpdate"></v-btn>
    <v-snackbar v-model="isCheckingForUpdate" timeout="-1">
      <div>正在检查更新</div>
      <v-progress-linear indeterminate></v-progress-linear>
    </v-snackbar>
    <v-snackbar v-model="isNoAvailableUpdate">
      {{ updateStatus }}
      <template #actions>
        <v-btn color="blue" variant="text" @click="isNoAvailableUpdate = false"> 知道了 </v-btn>
      </template>
    </v-snackbar>
    <div>
      <v-select
        v-model="aiProviderSelectedKey"
        :items="aiProviderOptions"
        label="AI Provider"
        @update:modelValue="
          () => {
            aiProviderSelected = aiProviderList!.find((item) => item.key === aiProviderSelectedKey)
          }
        "
      ></v-select>
      <v-text-field
        v-for="(value, key, index) in aiProviderList?.find(
          (item) => item.key === aiProviderSelectedKey
        )?.requiredValues"
        :key="index"
        v-model="aiProviderSelected.requiredValues[key]"
        :label="key"
        :placeholder="value"
      ></v-text-field>
      <v-btn icon="mdi-update" variant="text" @click="updateAiProvider">updateAiProvider</v-btn>
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
  console.log(aiProviderSelected.value)

  window.api.aiProvider.updateProvider(toRaw(aiProviderSelected.value)).then((data) => {
    onMessage('info', data)
  })
}
onMounted(() => {
  window.api.aiProvider.getProviders().then((data) => {
    aiProviderList.value = data
    aiProviderOptions.value = data.map((item) => {
      return {
        title: item.name,
        value: item.key
      }
    })
  })
})
</script>

<style scoped></style>

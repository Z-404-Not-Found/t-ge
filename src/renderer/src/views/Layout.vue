<template>
  <div class="h-full flex flex-col overflow-hidden">
    <div>
      <!-- 拖动区域 -->
      <div class="text-gray-500" style="-webkit-app-region: drag">Layout</div>
      <v-btn icon="mdi-chat" variant="text" @click="router.push('/chat')"></v-btn>
      <v-btn icon="mdi-cog" variant="text" @click="router.push('/setting')"></v-btn>
      <v-btn icon="mdi-window-minimize" variant="text" @click="minimizeWindow"></v-btn>
      <v-btn :icon="maximizedIcon" variant="text" @click="toggleMaximized"></v-btn>
      <v-btn icon="mdi-window-close" variant="text" @click="closeWindow"></v-btn>
    </div>
    <div class="flex-1 overflow-hidden">
      <RouterView />
    </div>
    <!-- 错误处理 -->
    <v-snackbar
      v-model="isOnMessage"
      max-height="100"
      timeout="3000"
      :timer="isOnError ? 'red' : isOnWarn ? 'yellow' : 'green'"
    >
      <div class="flex items-center">
        <div class="mr-4">
          <v-icon v-if="isOnError" color="red"> mdi-alert </v-icon>
          <v-icon v-if="isOnWarn" color="yellow"> mdi-alert-circle </v-icon>
          <v-icon v-if="isOnInfo" color="green"> mdi-information </v-icon>
        </div>
        <div
          v-if="isOnError"
          class="max-w-96"
          style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
        >
          {{ errorMessage }}
        </div>
        <div v-if="isOnWarn" class="max-w-96">{{ warnMessage }}</div>
        <div v-if="isOnInfo" class="max-w-96">{{ infoMessage }}</div>
      </div>
      <template #actions>
        <v-btn v-if="isOnError" color="red" variant="text" @click="checkError"> 查看详情 </v-btn>
        <v-btn v-if="isOnWarn" color="yellow" variant="text" @click="isOnMessage = false">
          知道了
        </v-btn>
        <v-btn v-if="isOnInfo" color="green" variant="text" @click="isOnMessage = false">
          查看详情
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, provide, watch } from 'vue'
import router from '@renderer/routers'

const maximizedIcon = ref<string>('')

const minimizeWindow = () => {
  window.api.windowHandlers.minimize()
}

const toggleMaximized = () => {
  window.api.windowHandlers.toggleMaximized().then((isMaximized) => {
    maximizedIcon.value = isMaximized ? 'mdi-window-restore' : 'mdi-window-maximize'
  })
}

const closeWindow = () => {
  window.api.windowHandlers.close()
}

const checkUpdate = () => {
  window.api.update.checkForUpdates()
}

const isOnMessage = ref(false)
const isOnInfo = ref(false)
const infoMessage = ref('')
const isOnWarn = ref(false)
const warnMessage = ref('')
const isOnError = ref(false)
const errorMessage = ref('')

const onMessage = (type, message) => {
  isOnMessage.value = true
  switch (type) {
    case 'info':
      isOnInfo.value = true
      infoMessage.value = message
      break
    case 'warn':
      isOnWarn.value = true
      warnMessage.value = message
      break
    case 'error':
      isOnError.value = true
      errorMessage.value = message
      break
  }
}

provide('onMessage', onMessage)

watch(isOnMessage, (value) => {
  if (!value) {
    isOnInfo.value = false
    isOnWarn.value = false
    isOnError.value = false
    infoMessage.value = ''
    warnMessage.value = ''
    errorMessage.value = ''
  }
})

const checkError = () => {
  isOnMessage.value = false
  window.api.openLogFile()
}

onMounted(() => {
  window.api.windowHandlers.isMainWindowMaximized().then((isMaximized) => {
    maximizedIcon.value = isMaximized ? 'mdi-window-restore' : 'mdi-window-maximize'
  })
  window.api.onMessage((_event, type, message) => {
    onMessage(type, message)
  })
  checkUpdate()
})
</script>

<style scoped></style>

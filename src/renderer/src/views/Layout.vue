<template>
  <div class="h-full flex flex-col overflow-hidden">
    <div>
      <div class="text-gray-500">Layout</div>
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
    <v-snackbar v-model="isOnError" max-height="100">
      <div class="flex items-center">
        <div class="mr-4">
          <v-icon color="red"> mdi-alert </v-icon>
        </div>
        <div>
          {{ errorMessage }}
        </div>
      </div>
      <template #actions>
        <v-btn color="red" variant="text" @click="isOnError = false"> 知道了 </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
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

const isOnError = ref(false)
const errorMessage = ref('')

onMounted(() => {
  window.api.windowHandlers.isMainWindowMaximized().then((isMaximized) => {
    maximizedIcon.value = isMaximized ? 'mdi-window-restore' : 'mdi-window-maximize'
  })
  window.api.onError((_event, data) => {
    isOnError.value = true
    errorMessage.value = data
  })
  checkUpdate()
})
</script>

<style scoped></style>

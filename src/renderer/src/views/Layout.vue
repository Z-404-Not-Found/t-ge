<template>
  <div class="h-full flex flex-col overflow-hidden">
    <div>
      <!-- 拖动区域 -->
      <div class="text-gray-500" style="-webkit-app-region: drag">Layout</div>
      <Button label="Success" severity="success" />
      <Button icon="pi pi-comment" @click="router.push('/chat')"></Button>
      <Button icon=" pi pi-cog" @click="router.push('/setting')"></Button>
      <Button icon="pi pi-minus" @click="minimizeWindow"></Button>
      <Button :icon="maximizedIcon" @click="toggleMaximized"></Button>
      <Button icon="pi pi-times" @click="closeWindow"></Button>
    </div>
    <div class="flex-1 overflow-hidden">
      <RouterView />
    </div>
    <!-- 全局消息 -->
    <Toast v-if="!isOnError" class="mt-8" />
    <Toast v-else class="mt-8" @close="isOnError = false">
      <template #message="slotProps">
        <div class="flex flex-1">
          <i class="pi pi-times-circle"></i>
          <div class="ml-2 text-sm">
            <div class="text-sm">{{ slotProps.message.summary }}</div>
            <div class="text-xs mt-2">
              {{ slotProps.message.detail }}
            </div>
            <div class="flex justify-end mt-2">
              <Button
                severity="danger"
                size="small"
                variant="text"
                label="查看详情"
                @click="checkError"
              />
              <Button
                severity="secondary"
                size="small"
                variant="text"
                label="关闭"
                @click="
                  () => {
                    toast.remove(slotProps.message)
                    isOnError = false
                  }
                "
              />
            </div>
          </div>
        </div>
      </template>
    </Toast>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, provide } from 'vue'
import router from '@renderer/routers'
import { useToast } from 'primevue/usetoast'
import toggleDarkMode from '@renderer/utils/toggleDarkMode'

const toast = useToast()

const maximizedIcon = ref('pi pi-window-maximize')

const minimizeWindow = () => {
  window.api.windowHandlers.minimize()
}

const toggleMaximized = () => {
  window.api.windowHandlers.toggleMaximized()
}

const closeWindow = () => {
  window.api.windowHandlers.close()
}

const checkUpdate = () => {
  window.api.update.checkForUpdates()
}

const isOnMessage = ref(false)
const isOnError = ref(false)

const onMessage = (data: {
  severity: 'error' | 'success' | 'secondary' | 'info' | 'warn' | 'contrast'
  summary: string
  detail: string
}) => {
  if (data.severity === 'error') {
    isOnError.value = true
    setTimeout(() => {
      toast.add({
        severity: data.severity,
        summary: data.summary,
        detail: data.detail
      })
    }, 1)
  } else {
    toast.add({
      severity: data.severity,
      summary: data.summary,
      detail: data.detail,
      life: 3000
    })
  }
}

provide('onMessage', onMessage)

const checkError = () => {
  isOnMessage.value = false
  window.api.openLogFile()
}

onMounted(() => {
  window.api.windowHandlers.isMaximized(() => {
    maximizedIcon.value = 'pi pi-window-minimize'
  })
  window.api.windowHandlers.isUnmaximized(() => {
    maximizedIcon.value = 'pi pi-window-maximize'
  })
  window.api.windowHandlers.onToggleDarkMode((_event, mode) => {
    toggleDarkMode(mode)
  })
  window.api.onMessage((_event, severity, summary, detail) => {
    onMessage({
      severity,
      summary,
      detail
    })
  })
  window.api.store.getItem('windowHandlers').then((data) => {
    if (data.darkMode === 'dark') {
      toggleDarkMode('dark')
    } else if (data.darkMode === 'light') {
      toggleDarkMode('light')
    } else {
      toggleDarkMode('system')
    }
  })
  checkUpdate()
})
</script>

<style scoped lang="scss"></style>

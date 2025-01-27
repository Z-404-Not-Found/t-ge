<template>
  <div class="h-full flex overflow-hidden select-none">
    <div class="h-full w-20 lg:w-48 hidden sm:block bg-surface-200 dark:bg-surface-700">
      <div class="p-4 flex flex-col items-center gap-4">
        <div
          class="w-full h-12 hidden !border-0 sm:flex justify-center items-center rounded-xl p-button p-button-contrast p-button-text"
          data-path="/chat"
          @click="router.push('/chat')"
        >
          <i class="pi pi-comment !hidden sm:!block"></i>
          <span class="hidden ml-4 lg:block">聊天</span>
        </div>
        <div
          class="w-full h-12 hidden !border-0 sm:flex justify-center items-center rounded-xl p-button p-button-contrast p-button-text"
          data-path="/setting"
          @click="router.push('/setting')"
        >
          <i class="pi pi-cog !hidden sm:!block"></i>
          <span class="hidden ml-4 lg:block">设置</span>
        </div>
      </div>
    </div>
    <div class="flex-1 h-full flex flex-col">
      <div class="w-full h-16">
        <div class="w-full flex justify-end">
          <div class="flex-1" style="-webkit-app-region: drag"></div>
          <div>
            <Button
              icon="pi pi-minus"
              size="small"
              variant="text"
              :dt="{
                root: {
                  border: {
                    radius: '0px'
                  }
                }
              }"
              @click="minimizeWindow"
            ></Button>
            <Button
              :icon="maximizedIcon"
              size="small"
              variant="text"
              :dt="{
                root: {
                  border: {
                    radius: '0px'
                  }
                }
              }"
              @click="toggleMaximized"
            ></Button>
            <Button
              class="hover:!text-white"
              icon="pi pi-times"
              size="small"
              variant="text"
              :dt="{
                root: {
                  border: {
                    radius: '0px'
                  },
                  text: {
                    primary: {
                      hover: {
                        background: 'var(--p-red-500)'
                      }
                    }
                  }
                }
              }"
              @click="closeWindow"
            ></Button>
          </div>
        </div>
        <div>
          {{ title }}
        </div>
      </div>
      <div class="flex-1">
        <RouterView />
      </div>
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
import { ref, onMounted, provide, watch } from 'vue'
import router from '@renderer/routers'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

const maximizedIcon = ref('pi pi-window-maximize')

const title = ref('聊天')

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

watch(router.currentRoute, (to, from) => {
  document.querySelector(`div[data-path='${from.path}']`)?.classList.add('p-button-text')
  document.querySelector(`div[data-path='${to.path}']`)?.classList.remove('p-button-text')
  title.value = to.meta.title as string
})

onMounted(() => {
  window.api.windowHandlers.isMaximized(() => {
    maximizedIcon.value = 'pi pi-window-minimize'
  })
  window.api.windowHandlers.isUnmaximized(() => {
    maximizedIcon.value = 'pi pi-window-maximize'
  })
  window.api.onMessage((_event, severity, summary, detail) => {
    onMessage({
      severity,
      summary,
      detail
    })
  })
  document.querySelector("div[data-path='/chat']")?.classList.remove('p-button-text')
  checkUpdate()
})
</script>

<style scoped lang="scss"></style>

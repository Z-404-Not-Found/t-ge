<template>
  <div class="h-full flex overflow-hidden select-none p-4">
    <div
      id="sidebar"
      class="h-full w-20 p-fieldset !p-0 transition-all lg:w-48 hidden sm:block !bg-surface-100 dark:!bg-surface-900"
    >
      <div class="p-4 flex flex-col items-center gap-4">
        <div class="w-full h-12 hidden !border-0 sm:flex justify-center items-center rounded-xl">
          <img class="w-10 h-10" src="../assets/icon.png" />
          <div class="ml-4 text-2xl font-semibold hidden lg:block">t哥</div>
        </div>
        <Divider class="!my-0" />
        <div
          v-tooltip="'聊天'"
          class="w-full h-12 !border-0 sm:flex rounded-xl p-button p-button-contrast p-button-text"
          data-path="/chat"
          @click="router.push('/chat')"
        >
          <i class="pi pi-comment !hidden sm:!block"></i>
          <span class="hidden ml-4 lg:block">聊天</span>
        </div>
        <div
          v-tooltip="'设置'"
          class="w-full h-12 !border-0 sm:flex rounded-xl p-button p-button-contrast p-button-text"
          data-path="/setting"
          @click="router.push('/setting')"
        >
          <i class="pi pi-cog !hidden sm:!block"></i>
          <span class="hidden ml-4 lg:block">设置</span>
        </div>
      </div>
    </div>
    <div class="flex-1 h-full flex flex-col">
      <div class="w-full h-20 flex flex-col">
        <div class="w-full flex-1 flex justify-end">
          <Button
            class="sm:!hidden ml-1"
            size="large"
            icon="pi pi-bars"
            severity="contrast"
            variant="text"
            @click="toggleSideBar"
          />
          <div class="flex-1 -mt-4" style="-webkit-app-region: drag"></div>
          <div>
            <Button
              class="hover:!bg-primary-100 dark:hover:!bg-primary-900"
              icon="pi pi-minus"
              size="small"
              variant="text"
              @click="minimizeWindow"
            ></Button>
            <Button
              class="hover:!bg-primary-100 dark:hover:!bg-primary-900"
              :icon="maximizedIcon"
              size="small"
              variant="text"
              @click="toggleMaximized"
            ></Button>
            <Button
              class="hover:!text-white hover:!bg-red-500"
              icon="pi pi-times"
              size="small"
              variant="text"
              @click="closeWindow"
            ></Button>
          </div>
        </div>
        <div class="ml-4 text-2xl font-semibold">
          {{ title }}
        </div>
      </div>
      <div class="flex-1 px-4 pt-4 overflow-hidden">
        <RouterView />
      </div>
    </div>
    <Drawer v-model:visible="sideBarVisible" class="!w-48">
      <template #container>
        <div class="flex flex-col items-center gap-4 p-4">
          <div class="w-full h-12 mt-1 !border-0 flex justify-center items-center rounded-xl">
            <img class="w-10 h-10" src="../assets/icon.png" />
            <div class="ml-4 text-xl font-semibold">t哥</div>
          </div>
          <Divider class="!my-0" />
          <div
            class="w-full h-12 !border-0 flex rounded-xl p-button p-button-contrast p-button-text"
            data-path="/chat"
            @click="
              () => {
                router.push('/chat')
                toggleSideBar()
              }
            "
          >
            <i class="pi pi-comment !block"></i>
            <span class="ml-4 block">聊天</span>
          </div>
          <div
            class="w-full h-12 !border-0 flex rounded-xl p-button p-button-contrast p-button-text"
            data-path="/setting"
            @click="
              () => {
                router.push('/setting')
                toggleSideBar()
              }
            "
          >
            <i class="pi pi-cog sm:!block"></i>
            <span class="ml-4 block">设置</span>
          </div>
        </div>
      </template>
    </Drawer>
    <!-- 全局消息 -->
    <Toast class="mt-8">
      <template #message="slotProps">
        <div class="flex flex-1">
          <i
            :class="
              slotProps.message.severity === 'error'
                ? 'pi pi-times-circle'
                : slotProps.message.severity === 'success'
                  ? 'pi pi-check'
                  : slotProps.message.severity === 'info'
                    ? 'pi pi-info-circle'
                    : slotProps.message.severity === 'warn'
                      ? 'pi pi-exclamation-triangle'
                      : ''
            "
          ></i>
          <div class="ml-2 text-sm">
            <div class="text-sm">{{ slotProps.message.summary }}</div>
            <div class="text-xs mt-2">
              {{ slotProps.message.detail }}
            </div>
            <div v-if="slotProps.message.severity === 'error'" class="flex justify-end mt-2">
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
import logger from '@renderer/utils/logger'

const toast = useToast()

const maximizedIcon = ref('pi pi-window-maximize')

const sideBarVisible = ref(false)

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

const onMessage = (data: {
  severity: 'error' | 'success' | 'secondary' | 'info' | 'warn' | 'contrast'
  summary: string
  detail: string
}) => {
  if (data.severity === 'error') {
    logger.error(data.detail)
    setTimeout(() => {
      toast.add({
        severity: data.severity,
        summary: data.summary,
        detail: data.detail,
        life: 3000
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

const toggleSideBar = () => {
  sideBarVisible.value = !sideBarVisible.value
  setTimeout(() => {
    document
      .querySelectorAll(`div[data-path='${router.currentRoute.value.path}']`)
      ?.forEach((element) => {
        element.classList.remove('p-button-text')
      })
  }, 100)
}

watch(router.currentRoute, (to, from) => {
  document.querySelectorAll(`div[data-path='${to.path}']`)?.forEach((element) => {
    element.classList.remove('p-button-text')
  })
  document.querySelectorAll(`div[data-path='${from.path}']`)?.forEach((element) => {
    element.classList.add('p-button-text')
  })
  title.value = to.meta.title as string
})

onMounted(() => {
  router.push('/chat')
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
  document.querySelector("div[data-path='/chat']")?.classList.toggle('p-button-text')
  checkUpdate()
})
</script>

<style scoped lang="scss"></style>

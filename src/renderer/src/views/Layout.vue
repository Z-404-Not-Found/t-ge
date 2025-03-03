<template>
  <div class="h-full w-full flex overflow-hidden select-none p-4">
    <div
      id="sidebar"
      :class="
        'h-full w-20 rounded-[var(--p-panel-border-radius)] !p-0 transition-all xl:w-52 hidden sm:block !bg-surface-100 dark:!bg-surface-900' +
        (sideBarShrink ? ' !w-20' : '')
      "
    >
      <div class="p-4 flex flex-col h-full items-center gap-4">
        <div class="w-full h-12 hidden !border-0 sm:flex justify-center items-center rounded-xl">
          <img class="w-10 h-10" src="../assets/icon.png" />
          <div
            :class="
              'ml-4 text-2xl font-semibold hidden xl:block' + (sideBarShrink ? ' !hidden' : '')
            "
          >
            t哥
          </div>
        </div>
        <Divider class="!my-0" />
        <div class="flex-1 w-full flex flex-col justify-between">
          <div class="flex flex-col w-full gap-4">
            <div
              v-tooltip="'聊天'"
              :class="
                'w-full h-12 !border-0 sm:flex rounded-xl p-button p-button-contrast' +
                (activateSidebar === '/chat' ? '' : ' p-button-text')
              "
              @click="changeActiveSidebar('/chat', '聊天')"
            >
              <i class="pi pi-comment !hidden sm:!block"></i>
              <span :class="'hidden ml-4 xl:block' + (sideBarShrink ? ' !hidden' : '')">聊天</span>
            </div>
            <div
              v-tooltip="'角色'"
              :class="
                'w-full h-12 !border-0 sm:flex rounded-xl p-button p-button-contrast' +
                (activateSidebar === '/role' ? '' : ' p-button-text')
              "
              @click="changeActiveSidebar('/role', '角色')"
            >
              <i class="pi pi-user !hidden sm:!block"></i>
              <span :class="'hidden ml-4 xl:block' + (sideBarShrink ? ' !hidden' : '')">角色</span>
            </div>
          </div>
          <div class="flex flex-col w-full gap-4">
            <div
              v-tooltip="'设置'"
              :class="
                'w-full h-12 !border-0 sm:flex rounded-xl p-button p-button-contrast' +
                (activateSidebar === '/setting' ? '' : ' p-button-text')
              "
              @click="changeActiveSidebar('/setting', '设置')"
            >
              <i class="pi pi-cog !hidden sm:!block"></i>
              <span :class="'hidden ml-4 xl:block' + (sideBarShrink ? ' !hidden' : '')">设置</span>
            </div>
            <Divider class="!my-0 !hidden xl:!block" />
            <div
              v-tooltip="'展开/收缩侧边栏'"
              class="w-full h-12 !border-0 !hidden xl:!flex rounded-xl p-button p-button-contrast p-button-text"
              @click="toggleSideBarBut"
            >
              <i
                :class="
                  'pi !hidden sm:!block' + (sideBarShrink ? ' pi-angle-right' : ' pi-angle-left')
                "
              ></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex-1 h-full flex flex-col">
      <div class="w-full h-8 flex flex-col">
        <div class="w-full flex-1 flex justify-end">
          <Button
            class="sm:!hidden"
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
      </div>
      <div class="flex-1 sm:pl-4 pt-4 overflow-hidden">
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
            :class="
              'w-full h-12 !border-0 sm:flex rounded-xl p-button p-button-contrast' +
              (activateSidebar === '/chat' ? '' : ' p-button-text')
            "
            @click="
              () => {
                changeActiveSidebar('/chat', '聊天')
                toggleSideBar()
              }
            "
          >
            <i class="pi pi-comment !block"></i>
            <span class="ml-4 block">聊天</span>
          </div>
          <div
            :class="
              'w-full h-12 !border-0 sm:flex rounded-xl p-button p-button-contrast' +
              (activateSidebar === '/role' ? '' : ' p-button-text')
            "
            @click="
              () => {
                changeActiveSidebar('/role', '角色')
                toggleSideBar()
              }
            "
          >
            <i class="pi pi-user sm:!block"></i>
            <span class="ml-4 lg:block">角色</span>
          </div>
          <div
            :class="
              'w-full h-12 !border-0 sm:flex rounded-xl p-button p-button-contrast' +
              (activateSidebar === '/setting' ? '' : ' p-button-text')
            "
            @click="
              () => {
                changeActiveSidebar('/setting', '设置')
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
    <Panel class="hidden"></Panel>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, provide } from 'vue'
import router from '@renderer/routers'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

const maximizedIcon = ref('pi pi-window-maximize')

const sideBarVisible = ref(false)

const currentTitle = ref('聊天')

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
    setTimeout(() => {
      toast.add({
        severity: data.severity,
        summary: data.summary,
        detail: data.detail,
        life: 5000
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

const activateSidebar = ref()

const changeActiveSidebar = (path: string, title: string) => {
  router.push(path)
  activateSidebar.value = path
  currentTitle.value = title
}

const sideBarShrink = ref(false)

const toggleSideBarBut = () => {
  sideBarShrink.value = !sideBarShrink.value
}

onMounted(() => {
  changeActiveSidebar('/chat', '聊天')
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
  checkUpdate()
})
</script>

<style scoped lang="scss"></style>

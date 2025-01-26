<template>
  <div class="h-svh w-svw">
    <!-- 骨架 -->
    <Card v-if="isLoading" class="h-full w-full">
      <template #content>
        <div class="p-2">
          <Skeleton class="mb-4" height="1.6rem" width="50%" />
          <Skeleton class="mb-2" height="1.2rem" width="80%" />
          <Skeleton class="mb-4" height="1.2rem" width="60%" />
          <Skeleton class="mb-4" height="7.2rem" />
          <div class="flex gap-4 mt-1">
            <Skeleton height="3rem" />
            <Skeleton height="3rem" />
          </div>
        </div>
      </template>
    </Card>
    <!-- 加载完成 -->
    <Card v-else-if="!isOnError" class="h-full w-full">
      <template #title>
        <div class="flex items-center">
          <i class="pi pi-arrow-circle-up mr-2 !text-2xl"></i>
          <span class="font-bold">发现新版本！！</span>
        </div>
      </template>
      <template #subtitle>
        <div class="font-bold">
          <span>v{{ newVersion }}</span>
          <span class="ml-2">发布日期：{{ releaseDate }}</span>
        </div>
        <div class="font-bold">原始安装包大小：{{ totalBytes }}MB</div></template
      >
      <template #content>
        <!-- 更新日志 -->
        <ScrollPanel v-if="!isDownloading" class="mt-2 h-32 rounded bg-gray-100 dark:bg-black">
          <MdPreview class="!bg-transparent" :editorId="id" :modelValue="releaseNotes"></MdPreview>
        </ScrollPanel>
        <!-- 下载进度 -->
        <div v-else-if="!isDownloaded" class="mt-2 h-32 flex flex-col justify-center">
          <div class="mb-4 font-semibold">正在下载。。。</div>
          <ProgressBar :value="downloadingPercentage"></ProgressBar>
          <div class="flex justify-between mt-2">
            <div>{{ downloadingBytesPerSecond }}KB/s</div>
            <div>{{ downloadingTransferredBytes }}MB / {{ downloadingTotalBytes }}MB</div>
          </div>
        </div>
        <!-- 下载完成 -->
        <div v-else class="mt-2 h-32 font-semibold flex items-center justify-center">
          下载完成，点击安装将退出并安装！
        </div>
      </template>
      <template #footer>
        <div v-if="!isDownloading" class="flex gap-4 mt-1">
          <Button
            label="稍后再说"
            severity="secondary"
            outlined
            class="w-full"
            @click="closeWindow"
          />
          <Button label="现在下载" class="w-full" @click="downloadUpdate" />
        </div>
        <div v-else class="flex gap-4 mt-1 justify-end">
          <Button :disabled="!isDownloaded" @click="installUpdate">安装</Button>
        </div>
      </template>
    </Card>
    <!-- 错误 -->
    <Card v-else class="h-full w-full">
      <template #title>
        <div class="flex items-center">
          <i class="pi pi-times-circle mr-2 !text-2xl text-red-500"></i>
          <span class="font-bold text-red-500"> {{ errorTitle + '！！！' }}</span>
        </div>
      </template>
      <template #subtitle>
        <div class="font-bold">请检查网络链接或重试！</div>
      </template>
      <template #content>
        <ScrollPanel class="mt-2 h-36 p-2 rounded bg-gray-100 dark:bg-black">
          {{ errorMessage }}
        </ScrollPanel>
      </template>
      <template #footer>
        <div class="flex gap-4 mt-1">
          <Button label="关闭" severity="secondary" outlined class="w-full" @click="closeWindow" />
          <Button label="重试" class="w-full" @click="downloadUpdate" />
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import moment from 'moment'
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'

const id = 'preview-only'
const isLoading = ref(true)
const newVersion = ref()
const releaseNotes = ref()
const releaseDate = ref()
const totalBytes = ref()
const isDownloading = ref(false)
const isDownloaded = ref(false)
const downloadingBytesPerSecond = ref(0)
const downloadingPercentage = ref(0)
const downloadingTotalBytes = ref(0)
const downloadingTransferredBytes = ref(0)
const isOnError = ref(false)
const errorTitle = ref()
const errorMessage = ref()

const closeWindow = () => {
  window.api.windowHandlers.close()
}

const downloadUpdate = () => {
  isDownloading.value = true
  isOnError.value = false
  window.api.update.downloadUpdate()
}

const installUpdate = () => {
  isDownloaded.value = true
  window.api.update.installUpdate()
}

const onUpdateInit = () => {
  window.api.update.onUpdate('update-available', (_event, data) => {
    isLoading.value = false
    newVersion.value = data.version
    releaseNotes.value = data.releaseNotes
    releaseDate.value = moment(data.releaseDate).format('YYYY-MM-DD HH:mm')
    totalBytes.value = ((data.files[0].size as number) / 1000 / 1000).toFixed(2)
  })
  window.api.update.onUpdate('download-progress', (_event, data) => {
    downloadingBytesPerSecond.value = Number((data.bytesPerSecond / 1000).toFixed(2))
    downloadingPercentage.value = Number(data.percent.toFixed(2))
    downloadingTransferredBytes.value = Number((data.transferred / 1000 / 1000).toFixed(2))
    downloadingTotalBytes.value = Number((data.total / 1000 / 1000).toFixed(2))
  })
  window.api.update.onUpdate('update-downloaded', () => {
    isDownloaded.value = true
  })
  window.api.onMessage((_event, severity, summary, detail) => {
    if (severity === 'error') {
      isOnError.value = true
      errorTitle.value = summary
      errorMessage.value = detail
    }
  })
}

onMounted(() => {
  onUpdateInit()
})
</script>

<style scoped lang="scss">
.md-editor-preview-wrapper {
  padding: 0.5rem;
}
.md-editor-preview {
  h2 {
    margin: 0 !important;
    font-size: larger;
    color: #000 !important;
  }
  ul {
    padding-left: 1.2em;
    li {
      margin: 0 !important;
      font-size: 16px;
      list-style-type: disc;
      color: #000 !important;
    }
  }
}
.dark {
  .md-editor-preview h2 {
    color: #fff !important;
  }
  .md-editor-preview ul li {
    color: #fff !important;
  }
}
</style>

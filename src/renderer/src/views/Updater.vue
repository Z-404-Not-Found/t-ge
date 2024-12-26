<template>
  <div class="h-svh w-svw">
    <v-skeleton-loader
      v-if="isLoading"
      class="h-full"
      type="avatar,article,text,text,text,actions"
    ></v-skeleton-loader>
    <v-card v-else-if="!isErrored" class="h-full w-full">
      <template #prepend>
        <v-icon size="32">mdi-update</v-icon>
      </template>
      <template #title>
        <span class="font-bold">发现新版本！！</span>
      </template>
      <template #subtitle>
        <div class="font-bold">
          <span>v{{ newVersion }}</span>
          <span class="ml-2">发布日期：{{ releaseDate }}</span>
        </div>
        <div class="font-bold">原始安装包大小：{{ totalBytes }}MB</div>
      </template>
      <template #text>
        <div v-if="!isDownloading" class="mt-2 h-32 overflow-y-auto bg-gray-100 rounded p-3">
          <div class="updateNote" v-html="releaseNotes"></div>
        </div>
        <div v-else-if="!isDownloaded" class="mt-2 h-32 flex flex-col justify-center">
          <div class="mb-4 text-gray-500 font-semibold">正在下载。。。</div>
          <div class="mb-2 text-gray-500 font-semibold text-center">
            {{ downloadingPercentage }}%
          </div>
          <v-progress-linear v-model="downloadingPercentage"> </v-progress-linear>
          <div class="flex justify-between text-gray-500 mt-2">
            <div>{{ downloadingBytesPerSecond }}KB/s</div>
            <div>{{ downloadingTransferredBytes }}MB / {{ downloadingTotalBytes }}MB</div>
          </div>
        </div>
        <div v-else class="mt-2 h-32 font-semibold flex items-center justify-center">
          下载完成，点击安装将退出并安装！
        </div>
      </template>
      <template #actions>
        <div class="w-full flex justify-end">
          <div v-if="!isDownloading">
            <v-btn @click="closeWindow">稍后再说</v-btn>
            <v-btn @click="downloadUpdate">下载更新</v-btn>
          </div>
          <div v-else>
            <v-btn :disabled="!isDownloaded" @click="installUpdate">安装</v-btn>
          </div>
        </div>
      </template>
    </v-card>
    <v-card v-else class="h-full w-full">
      <template #prepend>
        <v-icon size="32" color="red">mdi-alert</v-icon>
      </template>
      <template #title>
        <span class="font-bold">更新失败！！</span>
      </template>
      <template #subtitle>
        <div class="font-bold">请检查网络链接或重试！</div>
      </template>
      <template #text>
        <div class="mt-2 h-36 overflow-y-auto bg-gray-100 rounded p-3">
          <div class="text-lg font-semibold">错误信息：</div>
          <div>{{ error }}</div>
        </div>
      </template>
      <template #actions>
        <div class="w-full flex justify-end">
          <v-btn @click="downloadUpdate">重试</v-btn>
          <v-btn @click="closeWindow">关闭</v-btn>
        </div>
      </template>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import moment from 'moment'
import MarkdownIt from 'markdown-it'

const isErrored = ref(false)
const error = ref()
const isLoading = ref(true)
const isDownloading = ref(false)
const isDownloaded = ref(false)
const newVersion = ref()
const releaseNotes = ref()
const releaseDate = ref()
const totalBytes = ref()
const downloadingBytesPerSecond = ref(0)
const downloadingPercentage = ref(0)
const downloadingTotalBytes = ref(0)
const downloadingTransferredBytes = ref(0)

const md = new MarkdownIt()

const closeWindow = () => {
  window.api.windowHandlers.close()
}

const downloadUpdate = () => {
  isDownloading.value = true
  isErrored.value = false
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
    releaseNotes.value = md.render(data.releaseNotes)
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
  window.api.onError((_event, data) => {
    isErrored.value = true
    error.value = data
  })
}

onMounted(() => {
  onUpdateInit()
})
</script>

<style>
.updateNote h2 {
  font-size: 20px;
  font-weight: 600;
}
.updateNote li {
  list-style: disc;
  margin-left: 24px;
}
</style>

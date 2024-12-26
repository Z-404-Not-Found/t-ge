<template>
  <div>
    <div>Setting</div>
    <v-btn class="mr-4" icon="mdi-update" variant="text" @click="userCheckUpdate"></v-btn>
    <v-snackbar v-model="isNoAvailableUpdate">
      {{ updateStatus }}
      <template #actions>
        <v-btn color="blue" variant="text" @click="isNoAvailableUpdate = false"> 知道了 </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar v-model="isCheckingForUpdate">
      <div>正在检查更新</div>
      <v-progress-linear indeterminate></v-progress-linear>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const isNoAvailableUpdate = ref<boolean>(false)
const isCheckingForUpdate = ref<boolean>(false)
const updateStatus = ref<string>('')
const userCheckUpdate = () => {
  window.api.update.onUpdate('update-not-available', (_event, data) => {
    isCheckingForUpdate.value = false
    updateStatus.value = data
    isNoAvailableUpdate.value = true
  })
  window.api.update.onUpdate('update-available', () => {
    isCheckingForUpdate.value = false
  })
  window.api.onError(() => {
    isCheckingForUpdate.value = false
  })
  window.api.update.checkForUpdates()
  isCheckingForUpdate.value = true
}
</script>

<style scoped></style>

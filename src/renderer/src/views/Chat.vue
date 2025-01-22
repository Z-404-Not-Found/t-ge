<template>
  <div class="h-full w-full overflow-y-auto p-4">
    <div class="py-2">
      <div>聊天测试</div>
      <InputText v-model="message" placeholder="输入聊天内容"></InputText>
      <Button icon="pi pi-comment" @click="chat"></Button>
      <div>res: {{ resMessage }}</div>
      <div>isEnd: {{ isEnd }}</div>
      <div>isError: {{ isError }}</div>
      <div>error: {{ errorMessage }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, inject } from 'vue'

const onMessage = inject('onMessage') as (type: string, message: string) => void

const message = ref('')
const resMessage = ref('')
const isEnd = ref(false)
const isError = ref(false)
const errorMessage = ref('')

let messageList

const chat = () => {
  resMessage.value = ''
  isEnd.value = false
  isError.value = false
  messageList = [
    {
      role: 'system',
      content: '你是一个助手'
    },
    {
      role: 'user',
      content: message.value
    }
  ]
  if (!message.value) {
    onMessage('warn', '请输入聊天内容')
    return
  }
  window.api.ai.chat.send(messageList)
}

onMounted(() => {
  window.api.ai.chat.onStream((_event, data) => {
    resMessage.value += data
  })
  window.api.ai.chat.onStreamEnd(() => {
    isEnd.value = true
  })
  window.api.ai.chat.onStreamError((_event, data) => {
    isError.value = true
    errorMessage.value = data
  })
})
</script>

<style lang="scss" scoped></style>

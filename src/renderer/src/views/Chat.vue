<template>
  <div>
    <div>Chat</div>
    <div class="flex items-center">
      <v-textarea v-model="message" label="输入聊天内容"></v-textarea>
      <v-btn icon="mdi-chat" @click="chat"></v-btn>
    </div>
    <div>
      <div>res: {{ resMessage }}</div>
      <div>isEnd: {{ isEnd }}</div>
      <div>isError: {{ isError }}</div>
      <div>error: {{ errorMessage }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

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
  window.api.openai.chat.send(messageList)
}

onMounted(() => {
  window.api.openai.chat.onStream((_event, data) => {
    resMessage.value += data
  })
  window.api.openai.chat.onStreamEnd(() => {
    isEnd.value = true
  })
  window.api.openai.chat.onStreamError((_event, data) => {
    isError.value = true
    errorMessage.value = data
    console.log(data)
  })
})
</script>

<style scoped></style>

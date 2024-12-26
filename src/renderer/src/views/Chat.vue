<template>
  <div class="h-full w-full overflow-y-auto">
    <div>Chat</div>
    <div>
      <v-textarea v-model="message" label="输入聊天内容"></v-textarea>
      <v-btn icon="mdi-chat" @click="chat"></v-btn>
      <div>res: {{ resMessage }}</div>
      <div>isEnd: {{ isEnd }}</div>
      <div>isError: {{ isError }}</div>
      <div>error: {{ errorMessage }}</div>
    </div>
    <div>
      <v-text-field v-model="insertTestItem" label="输入sqlite测试内容"></v-text-field>
      <v-btn icon="mdi-plus" @click="insertTest"></v-btn>
      <v-btn icon="mdi-magnify" @click="selecteTest"></v-btn>
      <div>插入的内容：</div>
      <div v-for="(item, index) in selectTestItem" :key="index">{{ index }}:{{ item }}</div>
    </div>
  </div>
  <div></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const message = ref('')
const resMessage = ref('')
const isEnd = ref(false)
const isError = ref(false)
const errorMessage = ref('')

const insertTestItem = ref()
const selectTestItem = ref()

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

const insertTest = () => {
  window.api.sqlite.insertTest(insertTestItem.value).then(() => {
    console.log('insertTest success')
  })
}

const selecteTest = () => {
  window.api.sqlite.selectTest().then((res) => {
    selectTestItem.value = res
  })
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

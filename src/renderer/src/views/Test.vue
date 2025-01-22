<template>
  <div></div>
  <!-- <div class="h-full w-full overflow-y-auto p-4">
    <div class="py-2">
      <div>聊天测试</div>
      <v-textarea v-model="message" label="输入聊天内容"></v-textarea>
      <v-btn icon="mdi-chat" @click="chat"></v-btn>
      <div>res: {{ resMessage }}</div>
      <div>isEnd: {{ isEnd }}</div>
      <div>isError: {{ isError }}</div>
      <div>error: {{ errorMessage }}</div>
    </div>
    <v-divider :thickness="2" class="my-1 border-opacity-100"></v-divider>
    <div class="py-2">
      <div>sqlite测试</div>
      <div class="text-sm text-gray-500">
        (先不输入内容点加号插入按钮，弹出报错并查看日志；然后输入测试字符串，点击加号插入按钮，再点放大镜查询按钮，看是否成功查出)
      </div>
      <v-text-field v-model="insertTestItem" label="输入sqlite测试内容"></v-text-field>
      <v-btn icon="mdi-plus" @click="insertTest"></v-btn>
      <v-btn icon="mdi-magnify" @click="selectTest"></v-btn>
      <div>插入的内容：</div>
      <div v-for="(item, index) in selectTestItem" :key="index">{{ index }}:{{ item }}</div>
    </div>
    <v-divider :thickness="2" class="my-1 border-opacity-100"></v-divider>
    <div class="py-2">
      <div>Json测试</div>
      <div class="text-sm text-gray-500">
        (输入key和value，点击加号插入按钮，再点放大镜查询按钮，看是否成功查出，然后删除该key，再点放大镜查询按钮，看是否删除成功，如果没有查出则删除成功)
      </div>
      <div>插入Json测试</div>
      <v-text-field v-model="insertJsonKey" label="输入插入Json测试内容key"></v-text-field>
      <v-text-field v-model="insertJsonValue" label="输入插入Json测试内容value"></v-text-field>
      <div>查询Json测试</div>
      <v-text-field v-model="getJsonKey" label="输入查询Json测试内容key"></v-text-field>
      <div>删除Json测试</div>
      <v-text-field v-model="deleteJsonKey" label="输入删除Json测试内容key"></v-text-field>
      <v-btn icon="mdi-plus" @click="insertJsonTest"></v-btn>
      <v-btn icon="mdi-magnify" @click="getJsonTest"></v-btn>
      <v-btn icon="mdi-delete" @click="delJsonTest"></v-btn>
      <div>获取到的json</div>
      <div>{{ getJson }}</div>
    </div>
  </div> -->
</template>

<script setup lang="ts">
// import { ref, onMounted, inject } from 'vue'

// const onMessage = inject('onMessage') as (type: string, message: string) => void

// const message = ref('')
// const resMessage = ref('')
// const isEnd = ref(false)
// const isError = ref(false)
// const errorMessage = ref('')

// const insertTestItem = ref()
// const selectTestItem = ref()

// const insertJsonKey = ref()
// const insertJsonValue = ref()
// const getJsonKey = ref()
// const getJson = ref()
// const deleteJsonKey = ref()

// let messageList

// const chat = () => {
//   resMessage.value = ''
//   isEnd.value = false
//   isError.value = false
//   messageList = [
//     {
//       role: 'system',
//       content: '你是一个助手'
//     },
//     {
//       role: 'user',
//       content: message.value
//     }
//   ]
//   if (!message.value) {
//     onMessage('warn', '请输入聊天内容')
//     return
//   }
//   window.api.ai.chat.send(messageList)
// }

// const insertTest = () => {
//   window.api.sqlite.insertTest(insertTestItem.value).then(() => {})
// }

// const selectTest = () => {
//   window.api.sqlite.selectTest().then((res) => {
//     selectTestItem.value = res
//   })
// }

// const insertJsonTest = () => {
//   window.api.userData.setItem(insertJsonKey.value, insertJsonValue.value)
// }

// const getJsonTest = () => {
//   if (!getJsonKey.value) {
//     onMessage('warn', '请输入获取Json测试内容key')
//     return
//   }
//   window.api.userData.getItem(getJsonKey.value).then((res) => {
//     getJson.value = res
//   })
// }

// const delJsonTest = () => {
//   if (!deleteJsonKey.value) {
//     onMessage('warn', '请输入删除Json测试内容key')
//     return
//   }
//   window.api.userData.removeItem(deleteJsonKey.value)
// }

// onMounted(() => {
//   window.api.ai.chat.onStream((_event, data) => {
//     resMessage.value += data
//   })
//   window.api.ai.chat.onStreamEnd(() => {
//     isEnd.value = true
//   })
//   window.api.ai.chat.onStreamError((_event, data) => {
//     isError.value = true
//     errorMessage.value = data
//   })
// })
</script>

<style lang="scss" scoped></style>

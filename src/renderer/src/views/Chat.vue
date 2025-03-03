<template>
  <div class="h-full w-full flex p-panel">
    <!-- 角色列表 -->
    <div
      class="w-52 h-full hidden lg:block xl:w-56 border-r-[1px] border-r-[var(--p-panel-border-color)]"
    >
      <div class="w-full h-full flex flex-col py-1 px-2">
        <div class="w-full h-12 flex justify-between items-center text-xl mb-2 mx-1 font-semibold">
          角色
          <Button
            v-tooltip.bottom="'添加角色'"
            icon="pi pi-plus"
            class="w-1/4"
            severity="contrast"
            variant="text"
            @click="showAddRole"
          ></Button>
        </div>
        <div class="mb-4 mx-2">
          <InputGroup class="h-8">
            <InputText
              v-model="searchRoleName"
              placeholder="搜索"
              @update:modelValue="getRoleByName"
            />
            <InputGroupAddon>
              <Button icon="pi pi-search" severity="secondary" @click="getRoleByName"></Button>
            </InputGroupAddon>
          </InputGroup>
        </div>
        <div class="flex-1 overflow-y-auto scroll-transparent flex flex-col gap-2">
          <div
            v-for="item in roleList"
            :key="item?.id"
            :class="
              'w-full flex flex-col  cursor-pointer rounded-[var(--p-panel-border-radius)] p-2 !transition-all  duration-300 border-[1px]' +
              (activeRole?.id === item?.id
                ? ' bg-emphasis '
                : ' border-[var(--p-panel-border-color)]')
            "
            @contextmenu="onRoleRightClick($event, item.id)"
            @click="changeRole(item.id)"
          >
            <div class="flex justify-between">
              <div class="flex-1 single-line">{{ item.name }}</div>
              <div class="text-xs w-18 mt-1">
                {{ moment(item.updated_at).format('MM-DD HH:mm') }}
              </div>
            </div>
            <div class="single-line text-sm mt-1 text-gray-400">{{ item.description }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 聊天内容 -->
    <div class="flex-1 w-0 h-full flex flex-col">
      <!-- 角色信息 -->
      <div
        class="w-full p-3 border-b-[1px] border-b-[var(--p-panel-border-color)] flex justify-between"
      >
        <div class="flex flex-col w-full gap-2">
          <div class="flex justify-between items-center text-xl font-semibold">
            {{ activeRole?.name }}
            <div class="flex items-center gap-2">
              <Button
                v-tooltip.bottom="'截图保存'"
                icon="pi pi-camera"
                severity="contrast"
                variant="text"
                @click="captureChat"
              ></Button>
              <Button
                v-tooltip.bottom="'编辑角色'"
                icon="pi pi-user-edit"
                severity="contrast"
                variant="text"
                @click="showEditRole(activeRole.id)"
              />
              <Button
                v-tooltip.bottom="'选择角色'"
                class="lg:!hidden"
                icon="pi pi-users"
                severity="contrast"
                variant="text"
                @click="roleSelectVisible = true"
              />
              <Button
                v-tooltip.bottom="'历史对话'"
                class="sm:!hidden"
                icon="pi pi-history"
                severity="contrast"
                variant="text"
                @click="historySelectVisible = true"
              />
            </div>
          </div>
          <div>
            <div class="text-sm text-gray-400">
              {{ activeRole?.description }}
            </div>
          </div>
        </div>
      </div>
      <!-- 聊天区域 -->
      <div ref="chatContent" class="flex-1 w-full overflow-y-auto flex flex-col gap-2 p-2">
        <div class="w-full flex justify-center items-center my-2">
          <div
            class="bg-emphasis mx-2 py-1 px-2 max-h-48 overflow-auto rounded-[var(--p-panel-border-radius)] text-sm text-center text-[#999]"
          >
            角色定义：{{ activeRole?.definition }}
          </div>
        </div>
        <div v-if="currentAiProvider === null">
          <div class="flex justify-center items-center my-2">
            <Message severity="warn">
              <div class="flex items-center justify-center gap-2 text-sm">
                <i class="pi pi-exclamation-triangle"></i>
                <div class="font-semibold">注意：</div>
                <div>
                  请前往<router-link to="/setting" class="text-blue-500 underline">设置</router-link
                  >配置AI服务商
                </div>
              </div>
            </Message>
          </div>
        </div>
        <chatBox
          v-for="item in messageList"
          :key="item.id"
          :senderRole="item.senderRole"
          :content="item.content"
          :currentAi="currentAiProvider"
          :isReasoning="item.isReasoning"
          :reasoningContent="item.reasoningContent"
          :timestamp="item.timestamp"
          :type="item.type"
        >
          <template #actionButton>
            <Button
              v-if="isEnd && item.id === currentMessageId"
              v-tooltip.top="'重新生成'"
              icon="pi pi-refresh"
              severity="contrast"
              size="small"
              variant="text"
              class="!p-0 !w-4 !h-4 !text-[#999]"
              @click="resendMessage"
            ></Button>
          </template>
        </chatBox>
      </div>
      <!-- 发送区域 -->
      <div
        class="p-3 flex flex-col h-40 justify-between border-t-[1px] border-t-[var(--p-panel-border-color)]"
      >
        <Textarea
          v-model="message"
          class="flex-1 !overflow-y-auto resize-none"
          placeholder="输入聊天内容"
          autoResize
          cols="30"
          @keydown="handleKeyDown"
        ></Textarea>
        <div class="flex justify-between mt-2">
          <Button
            v-tooltip.top="'更改模型\n当前模型：' + currentAiProvider?.requiredValues.model"
            icon="pi pi-microchip-ai"
            severity="contrast"
            label=""
            size="small"
            variant="text"
            @click="showSelectModel"
          ></Button>
          <div>
            <Button
              v-if="!isEnd"
              class="mr-2"
              icon="pi pi-power-off"
              severity="contrast"
              label="停止"
              size="small"
              @click="stopChatStream"
            ></Button>
            <Button
              icon="pi pi-comment"
              severity="contrast"
              label="发送"
              size="small"
              :disabled="!message || currentAiProvider === null"
              @click="sendMessage"
            ></Button>
          </div>
        </div>
      </div>
    </div>
    <!-- 历史对话 -->
    <div
      class="w-48 h-full hidden sm:block xl:w-56 border-l-[1px] border-l-[var(--p-panel-border-color)] py-1 px-2"
    >
      <div class="w-full h-12 flex justify-between items-center text-xl mb-2 mx-1 font-semibold">
        历史对话
        <Button
          v-tooltip.left="'新建对话'"
          icon="pi pi-plus"
          class="w-1/4"
          severity="contrast"
          variant="text"
          @click="addConversation"
        ></Button>
      </div>
      <div class="h-full overflow-y-auto scroll-transparent flex flex-col gap-2">
        <div
          v-for="item in conversationList"
          :key="item?.id"
          :class="
            'w-full flex flex-col  cursor-pointer rounded-[var(--p-panel-border-radius)] p-2 !transition-all duration-300 border-[1px]' +
            (activeConversation?.id === item?.id
              ? ' bg-emphasis'
              : ' border-[var(--p-panel-border-color)]')
          "
          @contextmenu="onConversationRightClick($event, item.id)"
          @click="changeConversation(item.id)"
        >
          <div class="flex justify-between">
            <div class="flex-1 single-line">{{ item.title }}</div>
            <div class="text-xs w-18 mt-1">
              {{ moment(item.updated_at).format('MM-DD HH:mm') }}
            </div>
          </div>
          <div class="single-line text-sm mt-1 text-gray-400">
            {{
              item.last_message_content !== null
                ? item.last_message_content
                : activeRole.description
            }}
          </div>
        </div>
      </div>
    </div>
    <Dialog v-model:visible="addRoleShow" modal header="添加角色" :style="{ width: '25rem' }">
      <div class="flex flex-col gap-4 mt-1 mb-2">
        <div class="flex items-center gap-4">
          <label for="roleName" class="font-semibold w-12">角色名</label>
          <InputText
            id="roleName"
            v-model="addRoleName"
            class="flex-auto"
            autocomplete="off"
            placeholder="角色名，如：全能助手"
          />
        </div>
        <div class="flex items-center gap-4">
          <label for="description" class="font-semibold w-12">描述</label>
          <Textarea
            id="description"
            v-model="addRoleDescription"
            class="flex-auto"
            autocomplete="off"
            placeholder="描述（给自己看），如：这是一个会帮助你解决各种问题的全能助手"
          />
        </div>
        <div class="flex items-center gap-4 mb-4">
          <label for="description" class="font-semibold w-12">定义</label>
          <Textarea
            id="description"
            v-model="addRoleDefinition"
            class="flex-auto"
            autocomplete="off"
            placeholder="定义（给AI看），如：你是一个全能助手，需要以专业的知识储备帮助用户解决各种问题"
          />
        </div>
      </div>
      <div class="flex justify-end gap-2">
        <Button type="button" label="取消" severity="secondary" @click="hideAddRole"></Button>
        <Button
          type="button"
          label="添加"
          :disabled="!addRoleName || !addRoleDescription || !addRoleDefinition"
          @click="addRole"
        ></Button>
      </div>
    </Dialog>
    <Dialog v-model:visible="editRoleShow" modal header="修改角色" :style="{ width: '25rem' }">
      <div class="flex flex-col gap-4 mt-1 mb-2">
        <div class="flex items-center gap-4">
          <label for="roleName" class="font-semibold w-12">角色名</label>
          <InputText
            id="roleName"
            v-model="editRoleName"
            class="flex-auto"
            autocomplete="off"
            placeholder="角色名，如：全能助手"
          />
        </div>
        <div class="flex items-center gap-4">
          <label for="description" class="font-semibold w-12">描述</label>
          <Textarea
            id="description"
            v-model="editRoleDescription"
            class="flex-auto"
            autocomplete="off"
            placeholder="描述（给自己看），如：这是一个会帮助你解决各种问题的全能助手"
          />
        </div>
        <div class="flex items-center gap-4 mb-4">
          <label for="description" class="font-semibold w-12">定义</label>
          <Textarea
            id="description"
            v-model="editRoleDefinition"
            class="flex-auto"
            autocomplete="off"
            placeholder="定义（给AI看），如：你是一个全能助手，需要以专业的知识储备帮助用户解决各种问题"
          />
        </div>
      </div>
      <div class="flex justify-end gap-2">
        <Button type="button" label="取消" severity="secondary" @click="hideEditRole"></Button>
        <Button
          type="button"
          label="修改"
          :disabled="!editRoleName || !editRoleDescription || !editRoleDefinition"
          @click="editRole"
        ></Button>
      </div>
    </Dialog>
    <Dialog
      v-model:visible="editConversationShow"
      modal
      header="修改标题"
      :style="{ width: '25rem' }"
    >
      <div class="flex flex-col mt-1 mb-4">
        <div class="flex items-center gap-4">
          <label for="conversationTitle" class="font-semibold w-12">标题</label>
          <InputText
            id="conversationTitle"
            v-model="editingConversationTitle"
            class="flex-auto"
            autocomplete="off"
            placeholder="请输入该对话的自定义标题"
          />
        </div>
      </div>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="取消"
          severity="secondary"
          @click="hideEditConversationTitle"
        ></Button>
        <Button
          type="button"
          label="修改"
          :disabled="!editingConversationTitle"
          @click="editConversationTitle"
        ></Button>
      </div>
    </Dialog>
    <Dialog
      v-model:visible="selectModelVisible"
      modal
      header="选择模型"
      :style="{ width: '25rem' }"
    >
      <Listbox
        v-model="selectedModel"
        :options="modalListOptions"
        optionLabel="name"
        class="w-full"
      />
      <div class="flex justify-end gap-2">
        <Button type="button" label="取消" severity="secondary" @click="hideSelectModel"></Button>
        <Button type="button" label="确定" @click="changeModel"></Button>
      </div>
    </Dialog>
    <Drawer v-model:visible="roleSelectVisible" class="!w-48" position="right">
      <template #container>
        <div class="w-full h-full flex flex-col py-1 px-2">
          <div class="w-full h-8"></div>
          <div
            class="w-full h-12 flex justify-between items-center text-xl mb-2 mx-1 font-semibold"
          >
            角色
            <Button
              v-tooltip.left="'添加角色'"
              icon="pi pi-plus"
              class="w-1/4"
              severity="contrast"
              variant="text"
              @click="showAddRole"
            ></Button>
          </div>
          <div class="mb-4 mx-2">
            <InputGroup class="h-8">
              <InputText v-model="searchRoleName" placeholder="搜索" />
              <InputGroupAddon>
                <Button icon="pi pi-search" severity="secondary"></Button>
              </InputGroupAddon>
            </InputGroup>
          </div>
          <div class="flex-1 overflow-y-auto scroll-transparent flex flex-col gap-2">
            <div
              v-for="item in roleList"
              :key="item?.id"
              :class="
                'w-full flex flex-col  cursor-pointer rounded-[var(--p-panel-border-radius)] p-2 !transition-all  duration-300 border-[1px]' +
                (activeRole?.id === item?.id
                  ? ' bg-emphasis '
                  : ' border-[var(--p-panel-border-color)]')
              "
              @click="changeRole(item.id)"
            >
              <div class="flex justify-between">
                <div class="flex-1 single-line">{{ item.name }}</div>
                <div class="text-xs w-18 mt-1">
                  {{ moment(item.updated_at).format('MM-DD HH:mm') }}
                </div>
              </div>
              <div class="single-line text-sm mt-1 text-gray-400">{{ item.description }}</div>
            </div>
          </div>
        </div>
      </template>
    </Drawer>
    <Drawer v-model:visible="historySelectVisible" class="!w-48" position="right">
      <template #container>
        <div class="w-full h-8"></div>
        <div class="w-full h-full py-1 px-2">
          <div
            class="w-full h-12 flex justify-between items-center text-xl mb-2 mx-1 font-semibold"
          >
            历史对话
            <Button
              v-tooltip.left="'新建对话'"
              icon="pi pi-plus"
              class="w-1/4"
              severity="contrast"
              variant="text"
              @click="addConversation"
            ></Button>
          </div>
          <div class="h-full overflow-y-auto scroll-transparent flex flex-col gap-2">
            <div
              v-for="item in conversationList"
              :key="item?.id"
              :class="
                'w-full flex flex-col  cursor-pointer rounded-[var(--p-panel-border-radius)] p-2 !transition-all duration-300 border-[1px]' +
                (activeConversation?.id === item?.id
                  ? ' bg-emphasis'
                  : ' border-[var(--p-panel-border-color)]')
              "
              @contextmenu="onConversationRightClick($event, item.id)"
              @click="changeConversation(item.id)"
            >
              <div class="flex justify-between">
                <div class="flex-1 single-line">{{ item.title }}</div>
                <div class="text-xs w-18 mt-1">
                  {{ moment(item.updated_at).format('MM-DD HH:mm') }}
                </div>
              </div>
              <div class="single-line text-sm mt-1 text-gray-400">
                {{
                  item.last_message_content !== null
                    ? item.last_message_content
                    : activeRole.description
                }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </Drawer>
    <ContextMenu ref="roleRightClickMenu" :model="roleRightClickItems" />
    <ContextMenu ref="conversationRightClickMenu" :model="conversationRightClickItems" />
    <ConfirmDialog></ConfirmDialog>
  </div>
</template>

<script setup lang="ts">
import moment from 'moment'
import { ref, onMounted, inject, onUnmounted, watch, onActivated, nextTick } from 'vue'
import { useConfirm } from 'primevue/useconfirm'

const confirm = useConfirm()

const onMessage = inject('onMessage') as (data: {
  severity: 'error' | 'success' | 'secondary' | 'info' | 'warn' | 'contrast'
  summary: string
  detail: string
}) => void

import chatBox from '@renderer/components/chatBox.vue'

const roleSelectVisible = ref(false)
const historySelectVisible = ref(false)

const messageList = ref()
const message = ref('')
const resMessage = ref('')
const resReasoningMessage = ref('')
const isEnd = ref(true)
const currentAiProvider = ref()

const roleList = ref()
const activeRole = ref()
const addRoleShow = ref(false)
const addRoleName = ref()
const addRoleDescription = ref('')
const addRoleDefinition = ref('')
const searchRoleName = ref()

const getRoleByName = () => {
  window.api.role.getRoleByName(searchRoleName.value).then((res) => {
    roleList.value = res
  })
}

const editRoleShow = ref(false)
const editRoleId = ref()
const editRoleName = ref()
const editRoleDescription = ref()
const editRoleDefinition = ref()

const showEditRole = (editingId) => {
  editRoleId.value = editingId
  roleList.value.forEach((item) => {
    if (item.id === editRoleId.value) {
      editRoleName.value = item.name
      editRoleDescription.value = item.description
      editRoleDefinition.value = item.definition
    }
  })
  editRoleShow.value = true
}

const hideEditRole = () => {
  editRoleShow.value = false
  editRoleId.value = ''
  editRoleName.value = ''
  editRoleDescription.value = ''
  editRoleDefinition.value = ''
}

const editRole = () => {
  window.api.role
    .update({
      id: editRoleId.value,
      name: editRoleName.value,
      description: editRoleDescription.value,
      definition: editRoleDefinition.value
    })
    .then(() => {
      editRoleShow.value = false
      window.api.role.get().then((res) => {
        roleList.value = res
        activeRole.value = roleList.value.find((item) => item.id === editRoleId.value)
      })
    })
}

const showAddRole = () => {
  addRoleShow.value = true
}

const hideAddRole = () => {
  addRoleShow.value = false
  addRoleName.value = ''
  addRoleDescription.value = ''
  addRoleDefinition.value = ''
}

const addRole = () => {
  window.api.role
    .add({
      name: addRoleName.value,
      description: addRoleDescription.value,
      definition: addRoleDefinition.value
    })
    .then((res) => {
      if (typeof res === 'number') {
        onMessage({ severity: 'success', summary: '添加成功', detail: '添加成功' })
        window.api.role.get().then((roleListRes) => {
          roleList.value = roleListRes
          window.api.conversation.add(res)
          changeRole(res)
          addRoleShow.value = false
        })
      } else {
        onMessage({ severity: 'warn', summary: '添加失败', detail: res as string })
      }
    })
    .finally(() => {
      addRoleName.value = ''
      addRoleDescription.value = ''
      addRoleDefinition.value = ''
      roleSelectVisible.value = false
    })
}

const changeRole = (id) => {
  conversationList.value = []
  activeRole.value = roleList.value.find((item) => item.id === id)
  window.api.conversation.get(id).then((res) => {
    conversationList.value = res
    activeConversation.value = conversationList.value[0]
  })
  roleSelectVisible.value = false
}

const clickingRoleId = ref()
const roleRightClickMenu = ref()
const roleRightClickItems = ref([
  {
    label: '修改角色',
    icon: 'pi pi-user-edit',
    command: () => {
      showEditRole(clickingRoleId.value)
    }
  },
  {
    label: '删除角色',
    icon: 'pi pi-trash',
    command: () => {
      confirm.require({
        message: '删除角色将会删除该角色下的所有历史对话和聊天记录，确认删除？',
        header: '确认删除？？',
        icon: 'pi pi-info-circle',
        rejectLabel: '取消',
        rejectProps: {
          label: '取消',
          severity: 'secondary',
          outlined: true
        },
        acceptProps: {
          label: '删除',
          severity: 'danger'
        },
        accept: () => {
          window.api.role.delete(clickingRoleId.value).then((res) => {
            if (res === '不能删除最后一个角色') {
              onMessage({
                severity: 'warn',
                summary: '删除失败',
                detail: '不能删除最后一个角色'
              })
            } else {
              window.api.role.get().then((res) => {
                roleList.value = res
                changeRole(roleList.value[0].id)
                window.api.conversation.get(activeRole.value.id).then((res) => {
                  conversationList.value = res
                  activeConversation.value = conversationList.value[0]
                  window.api.message
                    .getMessagesByConversationId(activeConversation.value.id)
                    .then((res) => {
                      messageList.value = res
                      currentMessageId.value = messageList.value[messageList.value.length - 1].id
                    })
                })
              })
              onMessage({
                severity: 'success',
                summary: '删除成功',
                detail: '删除成功'
              })
            }
          })
        },
        reject: () => {}
      })
    }
  }
])

const onRoleRightClick = (event, id) => {
  roleRightClickMenu.value.show(event)
  clickingRoleId.value = id
}

const conversationList = ref()
const activeConversation = ref()

const editConversationId = ref()
const conversationRightClickMenu = ref()
const editingConversationTitle = ref()
const editConversationShow = ref(false)

const conversationRightClickItems = ref([
  {
    label: '修改标题',
    icon: 'pi pi-pencil',
    command: () => {
      showEditConversation()
    }
  },
  {
    label: '删除对话',
    icon: 'pi pi-trash',
    command: () => {
      confirm.require({
        message: '删除对话将会删除该对话下的所有聊天记录，确认删除？',
        header: '确认删除？？',
        icon: 'pi pi-info-circle',
        rejectLabel: '取消',
        rejectProps: {
          label: '取消',
          severity: 'secondary',
          outlined: true
        },
        acceptProps: {
          label: '删除',
          severity: 'danger'
        },
        accept: () => {
          window.api.conversation.delete(editConversationId.value).then((res) => {
            if (res === '不能删除最后一个对话') {
              onMessage({
                severity: 'warn',
                summary: '删除失败',
                detail: '不能删除最后一个对话'
              })
            } else {
              window.api.conversation.get(activeRole.value.id).then((res) => {
                conversationList.value = res
                activeConversation.value = conversationList.value[0]
                window.api.message
                  .getMessagesByConversationId(activeConversation.value.id)
                  .then((res) => {
                    messageList.value = res
                    currentMessageId.value = messageList.value[messageList.value.length - 1].id
                  })
              })
            }
          })
        }
      })
    }
  },
  {
    label: '导出对话',
    icon: 'pi pi-file-export',
    command: () => {
      captureChat()
    }
  }
])

const onConversationRightClick = (event, id) => {
  conversationRightClickMenu.value.show(event)
  editConversationId.value = id
}

const showEditConversation = () => {
  editConversationShow.value = true
  editingConversationTitle.value = conversationList.value.find(
    (item) => item.id === editConversationId.value
  ).title
}

const editConversationTitle = () => {
  window.api.conversation
    .updateTitle({ id: editConversationId.value, title: editingConversationTitle.value })
    .then(() => {
      window.api.conversation.get(activeRole.value.id).then((res) => {
        conversationList.value = res
        activeConversation.value = conversationList.value[0]
        window.api.message.getMessagesByConversationId(activeConversation.value.id).then((res) => {
          messageList.value = res
          editConversationShow.value = false
        })
      })
    })
}

const hideEditConversationTitle = () => {
  editConversationShow.value = false
  editingConversationTitle.value = ''
}

const changeConversation = (id) => {
  activeConversation.value = conversationList.value.find((item) => item.id === id)
  historySelectVisible.value = false
}

const addConversation = () => {
  window.api.conversation.add(activeRole.value.id).then((res) => {
    onMessage({ severity: 'success', summary: '添加成功', detail: res as string })
    window.api.conversation.get(activeRole.value.id).then((res) => {
      conversationList.value = res
      activeConversation.value = conversationList.value[0]
      historySelectVisible.value = false
    })
  })
}

const selectModelVisible = ref(false)
const modelList = ref()
const modalListOptions = ref()
const selectedModel = ref()

const showSelectModel = async () => {
  selectModelVisible.value = true
  await window.api.ai.getModelList().then((res) => {
    modelList.value = res
    modalListOptions.value = modelList.value.map((item) => {
      return {
        name: item.id,
        code: item.id
      }
    })
  })
  selectedModel.value = {
    name: currentAiProvider.value.model,
    code: currentAiProvider.value.model
  }
}

// 更改模型

const hideSelectModel = () => {
  selectModelVisible.value = false
}

const changeModel = () => {
  window.api.aiProvider.updateProviderModel(selectedModel.value.code).then((res) => {
    onMessage({ severity: 'success', summary: '切换成功', detail: res as string })
    selectModelVisible.value = false
  })
}

const currentMessageId = ref()

const sendMessage = async () => {
  resMessage.value = ''
  resReasoningMessage.value = ''
  isEnd.value = false
  const sendMessageList = [
    {
      role: 'system',
      content: activeRole.value.definition
    }
  ] as openaiChatMessage[]
  const historyMessages = await window.api.message.getLastMessageByConversationId({
    conversationId: activeConversation.value.id as number,
    count: (await window.api.store.getItem('rememberContextLength')) as number
  })
  historyMessages.forEach((item) => {
    sendMessageList.push({
      role: item.senderRole === 0 ? 'user' : 'assistant',
      content: item.content
    })
  })
  sendMessageList.push({
    role: 'user',
    content: message.value
  })
  window.api.ai.chat.send(sendMessageList)
  await window.api.message.addMessage({
    conversationId: activeConversation.value.id,
    content: message.value,
    senderRole: 0
  })
  await messageList.value.push(
    (
      await window.api.message.getLastMessageByConversationId({
        conversationId: activeConversation.value.id,
        count: 1
      })
    )[0]
  )
  if (activeConversation.value.title === '新对话') {
    window.api.conversation.updateTitle({ id: activeConversation.value.id, title: message.value })
    activeConversation.value.title = message.value
  }
  message.value = ''
  scrollToBottom()
  currentMessageId.value = await window.api.message.addMessage({
    conversationId: activeConversation.value.id,
    content: '',
    senderRole: 1
  })
  await messageList.value.push(await window.api.message.getMessageById(currentMessageId.value))
  scrollToBottom()
  window.api.role.updateUpdatedAtById({
    id: activeRole.value.id,
    updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
  })
  activeRole.value.updated_at = moment().format('YYYY-MM-DD HH:mm:ss')
  window.api.conversation.updateUpdatedAtById({
    id: activeConversation.value.id,
    updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
  })
  activeConversation.value.updated_at = moment().format('YYYY-MM-DD HH:mm:ss')
}

const resendMessage = async () => {
  await window.api.message.deleteMessagesById(currentMessageId.value)
  messageList.value = messageList.value.filter((item) => item.id !== currentMessageId.value)
  resMessage.value = ''
  resReasoningMessage.value = ''
  isEnd.value = false
  const sendMessageList = [
    {
      role: 'system',
      content: activeRole.value.definition
    }
  ] as openaiChatMessage[]
  const historyMessages = await window.api.message.getLastMessageByConversationId({
    conversationId: activeConversation.value.id as number,
    count: (await window.api.store.getItem('rememberContextLength')) as number
  })
  historyMessages.forEach((item) => {
    sendMessageList.push({
      role: item.senderRole === 0 ? 'user' : 'assistant',
      content: item.content
    })
  })
  sendMessageList.push({
    role: 'user',
    content: messageList.value[messageList.value.length - 1].content
  })
  window.api.ai.chat.send(sendMessageList)
  currentMessageId.value = await window.api.message.addMessage({
    conversationId: activeConversation.value.id,
    content: '',
    senderRole: 1
  })
  await messageList.value.push(await window.api.message.getMessageById(currentMessageId.value))
  scrollToBottom()
  window.api.role.updateUpdatedAtById({
    id: activeRole.value.id,
    updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
  })
  activeRole.value.updated_at = moment().format('YYYY-MM-DD HH:mm:ss')
  window.api.conversation.updateUpdatedAtById({
    id: activeConversation.value.id,
    updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
  })
  activeConversation.value.updated_at = moment().format('YYYY-MM-DD HH:mm:ss')
}

const stopChatStream = () => {
  window.api.ai.chat.stopChatStream()
  isEnd.value = true
}

const handleKeyDown = (event) => {
  if (event.key === 'Enter') {
    if (event.ctrlKey || event.shiftKey) {
      if (event.ctrlKey) {
        message.value += '\n'
      }
      return
    } else {
      event.preventDefault()
      if (!message.value || currentAiProvider.value === null) {
        return false
      } else {
        return sendMessage()
      }
    }
  }
  return
}

const chatContent = ref()

// 截图
import html2canvas from 'html2canvas'

const captureChat = async () => {
  let clonedElement: HTMLElement | null = null
  try {
    const originalElement = chatContent.value

    // 创建副本元素
    clonedElement = originalElement.cloneNode(true) as HTMLElement

    // 设置副本样式
    Object.assign(clonedElement.style, {
      position: 'fixed',
      top: '-9999px',
      width: `${originalElement.offsetWidth}px`,
      height: 'auto',
      maxHeight: 'none',
      overflow: 'visible'
    })

    // 设置实际高度为滚动高度
    clonedElement.style.height = `${originalElement.scrollHeight}px`

    // 添加到DOM
    document.body.appendChild(clonedElement)

    // 等待DOM更新
    await nextTick()

    // 使用副本截图
    const canvas = await html2canvas(clonedElement, {
      useCORS: true,
      logging: true,
      scale: 2
    })

    // 转换为Blob并保存
    canvas.toBlob(async (blob) => {
      if (!blob) {
        onMessage({ severity: 'error', summary: '截图失败', detail: '无法生成图片数据' })
        return
      }

      try {
        const reader = new FileReader()
        reader.onload = async () => {
          const result = await window.api.saveImage(reader.result as ArrayBuffer)
          if (result === 'success') {
            onMessage({
              severity: 'success',
              summary: '截图成功',
              detail: '图片已保存至下载文件夹'
            })
          }
        }
        reader.readAsArrayBuffer(blob)
      } catch (error) {
        console.error('截图保存失败:', error)
      }
    }, 'image/png')
  } catch (error) {
    console.error('截图失败:', error)
  } finally {
    // 确保删除副本
    if (clonedElement && document.body.contains(clonedElement)) {
      document.body.removeChild(clonedElement)
    }
  }
}

const scrollToBottom = () => {
  setTimeout(() => {
    chatContent.value?.scrollTo({ top: chatContent.value!.scrollHeight })
  }, 1)
}

watch(
  () => activeConversation.value,
  (newValue) => {
    scrollToBottom()
    resMessage.value = ''
    isEnd.value = true
    window.api.message.getMessagesByConversationId(newValue.id).then((res) => {
      messageList.value = res
    })
  }
)

onMounted(() => {
  window.api.ai.chat.onStream((_event, data) => {
    if (data !== undefined) {
      resMessage.value += data
      window.api.message.updateMessageById({
        messageId: currentMessageId.value,
        content: resMessage.value
      })
      messageList.value[messageList.value.length - 1].content = resMessage.value
      scrollToBottom()
    }
  })
  window.api.ai.chat.onReasoningStream(async (_event, data) => {
    resReasoningMessage.value += data
    window.api.message.updateReasoningMessageById({
      messageId: currentMessageId.value,
      reasoningContent: resReasoningMessage.value
    })
    messageList.value[messageList.value.length - 1].isReasoning = 1
    messageList.value[messageList.value.length - 1].reasoningContent = resReasoningMessage.value
    scrollToBottom()
  })
  window.api.ai.chat.onStreamEnd(() => {
    isEnd.value = true
  })
  window.api.ai.chat.onStreamError(async () => {
    messageList.value.pop()
    await window.api.message.deleteMessagesById(currentMessageId.value)
    resMessage.value = ''
    isEnd.value = true
    messageList.value.pop()
    await window.api.message.deleteMessagesById(
      (
        await window.api.message.getLastMessageByConversationId({
          conversationId: activeConversation.value.id,
          count: 1
        })
      )[0].id
    )
  })
  window.api.role.get().then((res) => {
    roleList.value = res
    changeRole(roleList.value[0].id)
    window.api.conversation.get(activeRole.value.id).then((res) => {
      conversationList.value = res
      activeConversation.value = conversationList.value[0]
      window.api.message.getMessagesByConversationId(activeConversation.value.id).then((res) => {
        messageList.value = res
        currentMessageId.value = messageList.value[messageList.value.length - 1].id
      })
    })
  })
  window.api.aiProvider.getCurrentProvider().then((res) => {
    currentAiProvider.value = res
  })
})

onActivated(() => {
  scrollToBottom()
})

onUnmounted(() => {
  stopChatStream()
  window.api.ai.chat.offStream()
})
</script>

<style scoped lang="scss"></style>

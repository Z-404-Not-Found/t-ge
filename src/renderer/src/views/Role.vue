<template>
  <div class="h-full w-full flex p-panel">
    <div class="w-full h-full">
      <div class="w-full h-full flex flex-col py-1 px-2">
        <div
          class="w-full h-12 flex justify-between items-center text-xl mb-2 mx-1 py-10 font-semibold border-b-[1px] border-b-[var(--p-panel-border-color)]"
        >
          角色一览
        </div>
        <div class="mb-4 px-48 flex">
          <InputGroup>
            <InputText
              v-model="searchRoleName"
              placeholder="搜索"
              @update:modelValue="getRoleByName"
            />
            <InputGroupAddon>
              <Button icon="pi pi-search" severity="secondary" @click="getRoleByName"></Button>
            </InputGroupAddon>
          </InputGroup>
          <Button
            v-tooltip.bottom="'添加角色'"
            icon="pi pi-plus"
            class="w-1/4 ml-2"
            severity="contrast"
            variant="text"
            @click="showAddRole"
          ></Button>
        </div>
        <div class="flex-1 overflow-y-auto scroll-transparent flex flex-col gap-2 mx-48">
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
          >
            <div class="flex justify-between">
              <div class="flex-1 text-xl font-semibold mb-2">{{ item.name }}</div>
              <div>
                <Button
                  v-tooltip.bottom="'修改角色'"
                  icon="pi pi-user-edit"
                  class="w-1/4 ml-2"
                  severity="contrast"
                  variant="text"
                  @click="showEditRole(item.id)"
                ></Button>
                <Button
                  v-tooltip.bottom="'删除角色'"
                  icon="pi pi-trash"
                  class="w-1/4 ml-2"
                  severity="danger"
                  variant="text"
                  @click="showDeleteRole(item.id)"
                ></Button>
              </div>
            </div>
            <div class="mt-1 text-gray-400">描述：{{ item.description }}</div>
            <div class="mt-1 text-gray-400">定义：{{ item.definition }}</div>
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
    <ContextMenu ref="roleRightClickMenu" :model="roleRightClickItems" />
    <ConfirmDialog></ConfirmDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, inject, onUnmounted, onActivated } from 'vue'
import { useConfirm } from 'primevue/useconfirm'

const confirm = useConfirm()

const onMessage = inject('onMessage') as (data: {
  severity: 'error' | 'success' | 'secondary' | 'info' | 'warn' | 'contrast'
  summary: string
  detail: string
}) => void

const roleSelectVisible = ref(false)

const roleList = ref()
const activeRole = ref()
const searchRoleName = ref()
const addRoleShow = ref(false)
const addRoleName = ref()
const addRoleDescription = ref('')
const addRoleDefinition = ref('')

const editRoleShow = ref(false)
const editRoleId = ref()
const editRoleName = ref()
const editRoleDescription = ref()
const editRoleDefinition = ref()

const getRoleByName = () => {
  window.api.role.getRoleByName(searchRoleName.value).then((res) => {
    roleList.value = res
  })
}

const editingRoleId = ref()
const roleRightClickMenu = ref()

const roleRightClickItems = ref([
  {
    label: '修改角色',
    icon: 'pi pi-user-edit',
    command: () => {
      showEditRole(editingRoleId.value)
    }
  },
  {
    label: '删除角色',
    icon: 'pi pi-trash',
    command: () => {
      showDeleteRole(editingRoleId.value)
    }
  }
])

const showDeleteRole = (id) => {
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
      window.api.role.delete(id).then((res) => {
        if (res === '不能删除最后一个角色') {
          onMessage({
            severity: 'warn',
            summary: '删除失败',
            detail: '不能删除最后一个角色'
          })
        } else {
          window.api.role.get().then((res) => {
            roleList.value = res
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

const onRoleRightClick = (event, id) => {
  roleRightClickMenu.value.show(event)
  editingRoleId.value = id
}

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

const showAddRole = () => {
  addRoleShow.value = true
}

const hideAddRole = () => {
  addRoleShow.value = false
  addRoleName.value = ''
  addRoleDescription.value = ''
  addRoleDefinition.value = ''
}

const chatContent = ref()

const scrollToBottom = () => {
  setTimeout(() => {
    chatContent.value!.scrollTo({ top: chatContent.value!.scrollHeight })
  }, 1)
}

onMounted(() => {
  window.api.role.get().then((res) => {
    roleList.value = res
  })
})

onActivated(() => {
  scrollToBottom()
})

onUnmounted(() => {})
</script>

<style scoped lang="scss"></style>

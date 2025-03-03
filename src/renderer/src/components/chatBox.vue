<template>
  <div ref="chatItem" class="px-2 py-1 w-full" @mouseenter="showButton" @mouseleave="hideButton">
    <div v-if="senderRole === 0" class="flex justify-end w-full pl-11">
      <div class="flex flex-col items-end">
        <div class="text-xs flex text-[#999] mb-1 items-center">
          <div id="actionButton" class="gap-1 ml-2 flex h-4 transition-all opacity-0">
            <Button
              v-tooltip.top="'复制'"
              icon="pi pi-copy"
              severity="contrast"
              size="small"
              variant="text"
              class="!p-0 !w-4 !h-4 !text-[#999]"
              @click="copyContent"
            ></Button>
          </div>
          <div class="text-xs text-[#999] ml-1">{{ timestamp }}</div>
        </div>
        <div
          class="w-fit max-w-full border-[1px] border-[var(--p-panel-border-color)] rounded-[var(--p-panel-border-radius)] dark:bg-black select-text"
        >
          <div class="md-editor-preview-wrapper dark:text-[#999]">
            <div class="md-editor-preview default-theme md-editor-scrn">
              <p>
                {{ content }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="flex w-full">
      <div class="bg-white w-8 h-8 flex justify-center items-center rounded-full mr-3">
        <Avatar
          :image="getAssetsSource(`assets/${currentAi!.icon}`)"
          shape="circle"
          size="normal"
        />
      </div>
      <div class="flex-1 w-0">
        <div class="flex items-center mb-1">
          <div class="text-xs text-[#999] mr-1">{{ timestamp }}</div>
          <div id="actionButton" class="gap-1 ml-2 h-4 flex transition-all opacity-0">
            <slot name="actionButton"></slot>
            <Button
              v-tooltip.top="'复制'"
              icon="pi pi-copy"
              severity="contrast"
              size="small"
              variant="text"
              class="!p-0 !w-4 !h-4 !text-[#999]"
              @click="copyContent"
            ></Button>
          </div>
        </div>
        <div
          class="w-fit max-w-full border-[1px] border-[var(--p-panel-border-color)] rounded-[var(--p-panel-border-radius)] dark:bg-black select-text"
        >
          <div v-if="isReasoning === 1">
            <Accordion value="0">
              <AccordionPanel value="0">
                <AccordionHeader>深度思考</AccordionHeader>
                <AccordionContent>
                  <p class="text-sm text-[#999]">
                    {{ reasoningContent }}
                  </p>
                </AccordionContent>
              </AccordionPanel>
            </Accordion>
          </div>
          <MdPreview
            v-if="content.length > 0"
            class="rounded-[var(--p-panel-border-radius)]"
            :editorId="id"
            :modelValue="content"
            :theme="darkMode"
          />
          <div v-else>
            <i class="pi pi-spin pi-spinner my-2 mx-2.5 text-base"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MdPreview } from 'md-editor-v3'
import getAssetsSource from '@renderer/utils/getAssetsSource'
import 'md-editor-v3/lib/preview.css'
const id = 'preview-only'
const props = defineProps({
  senderRole: {
    type: Number
  },
  content: {
    type: String,
    default: ''
  },
  currentAi: {
    type: Object
  },
  isReasoning: {
    type: Number,
    default: 0
  },
  reasoningContent: {
    type: String,
    default: ''
  },
  timestamp: {
    type: String,
    default: '0000-00-00 00:00:00'
  },
  type: {
    type: String,
    default: 'text'
  }
})

const darkMode = ref()

window.api.store.getItem('theme').then((theme) => {
  if (theme.darkMode === 'system') {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      darkMode.value = 'dark'
    } else {
      darkMode.value = 'light'
    }
  } else {
    darkMode.value = theme.darkMode
  }
})

const chatItem = ref()

const showButton = () => {
  const actionBtn = chatItem.value.querySelector('#actionButton')
  actionBtn?.classList.toggle('opacity-0')
}

const hideButton = () => {
  const actionBtn = chatItem.value.querySelector('#actionButton')
  actionBtn?.classList.toggle('opacity-0')
}

const copyContent = () => {
  navigator.clipboard.writeText(props.content)
}
</script>

<style lang="scss">
.md-editor-preview-wrapper {
  padding: 0 16px;
}
.p-accordionheader {
  padding: 10px 16px !important;
  font-size: 14px !important;
  font-weight: normal !important;
}
</style>

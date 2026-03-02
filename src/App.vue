<script setup lang="ts">
import FileInput from '@/components/FileInput.vue';
import Queue from '@/components/Queue.vue';
import { ref, useTemplateRef } from 'vue';
import { provideQueue } from './composables/queue';
import { useLocalStorage } from './composables/localStorage';

const dragActive = ref(false)
const token = useLocalStorage('tkn', '')

const fileInput = useTemplateRef('fileInput')
const queue = provideQueue(token)

const openFileDialog = () => {
  fileInput.value?.click()
}

const onDrop = (event: DragEvent) => {
  dragActive.value = false
  const files = Array.from(event.dataTransfer?.files || [])
  queue.addFiles(files)
}

const onFileInput = () => {
  const files = Array.from(fileInput.value?.files || [])
  queue.addFiles(files)
}

</script>

<template>
  <div>
    <div
      class="text-slate-100"
      @dragenter.prevent="dragActive = true"
      @dragover.prevent="dragActive = true"
      @dragleave.prevent="dragActive = false"
      @drop.prevent="onDrop"
    >
      <div class="min-h-dvh w-full flex flex-col items-center select-none gap-3">
        <div>
          <img src="/assets/logo.png" alt="logo" class="max-h-12 mt-[20vh] mb-4 pointer-events-none select-none">
        </div>
        <FileInput @open="openFileDialog" :active="dragActive" />
        <div class="min-w-64 text-base">
          <input v-model="token" type="text" placeholder="Token" class="px-2 py-1 border border-slate-300/20 rounded w-full text-xs" />
        </div>
        <Queue />
      </div>
      <input ref="fileInput" accept="application/pdf" type="file" class="hidden" multiple @change="onFileInput" />
    </div>
  </div>
</template>

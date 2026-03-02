<script setup lang="ts">
import FileInput from '@/components/FileInput.vue'
import Queue from '@/components/Queue.vue'
import Dropdown from '@/components/Dropdown.vue'
import { computed, ref, useTemplateRef } from 'vue'
import { provideQueue } from './composables/queue'
import { useLocalStorage } from './composables/localStorage'
import { readJWTData } from './composables/jwt'

const dragActive = ref(false)
const token = useLocalStorage('tkn', '')
const preset = useLocalStorage('preset', 'printer')

const tokenValid = computed<boolean>(() => {
  const data = readJWTData(token.value)
  if(!data || !('quack' in data) || data['quack'] !== 'Quack!') return false
  return true
})

const fileInput = useTemplateRef('fileInput')
const queue = provideQueue(token, preset)

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

const qualityPresets = {
  screen: 'Tiny',
  ebook: 'Small',
  printer: 'Normal',
  prepress: 'Large'
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
        <div class="flex gap-2 text-xs">
          <div class="relative min-w-64">
            <input v-model="token" type="text" placeholder="Token" class="px-2 py-1 border border-slate-300/20 rounded w-full backdrop-blur" />
            <img v-if="tokenValid" title="I make sure the token is Quack!" src="/assets/check.png" alt="check" class="absolute top-1/2 -translate-y-1/2 size-4 -left-6 rounded-md select-none">
          </div>
          <Dropdown :options="qualityPresets" v-model="preset" />
        </div>
        <Queue />
      </div>
      <input ref="fileInput" accept="application/pdf" type="file" class="hidden" multiple @change="onFileInput" />
    </div>
  </div>
</template>

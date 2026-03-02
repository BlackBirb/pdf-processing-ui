<script setup lang="ts">
import { formatBytes } from '@/utils'
import { ref, useTemplateRef, watch } from 'vue';

const props = defineProps({
  item: {
    type: Object as () => {
      file: File
      progress: number
      done: boolean
      error: boolean
      url?: string
    },
    required: true,
  },
})

const emit = defineEmits(['remove'])

</script>

<template>
  <div class="flex items-center">
    <div class="w-4 me-2">
      <div v-if="props.item.progress > 99">
        <svg v-if="props.item.error" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.736-3L13.739 4c-.768-1.333-2.687-1.333-3.457 0L3.344 16c-.766 1.333.195 3 1.735 3z" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    </div>
    <div class="w-full relative flex items-center gap-3 px-3 py-2 text-sm">
      <p class="truncate text-slate-100">
        {{ props.item.file.name }}
      </p>
      <div class="grow" />
      <p class="text-xs text-slate-400 whitespace-nowrap">
        {{ formatBytes(props.item.file.size) }}
      </p>
      <a
        v-if="props.item.done && !props.item.error"
        class="shrink-0 rounded-md border border-slate-600 px-2 py-1 text-xs text-slate-200 hover:border-slate-400 hover:text-white cursor-pointer"
        :href="props.item.url"
        :download="props.item.file.name.replace('.pdf', 'c.pdf')"
      >
        Download
      </a>
      <button class="shrink-0 rounded-md border border-slate-600 px-2 py-1 text-xs text-slate-200 hover:border-slate-400 hover:text-white cursor-pointer" @click="emit('remove')">
        ×
      </button>
      <div class="absolute top-0 left-0 w-full rounded-lg overflow-hidden h-full pointer-events-none select-none">
        <div class="h-full" :class="props.item.error ? 'bg-red-400/10' : 'bg-blue-400/10'" :style="{ width: `${props.item.progress}%` }"></div>
      </div>
    </div>
  </div>
</template>

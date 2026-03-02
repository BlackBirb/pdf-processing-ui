<script setup lang="ts">
import { useQueue } from '@/composables/queue';
import QueueItem from './QueueItem.vue';

const { removeFile, items } = useQueue()
</script>

<template>
  <div class="mt-6 w-full max-w-md mx-auto text-left">
    <p class="hiddentext-xs uppercase tracking-wide text-slate-400">Files</p>
    <ul class="mt-2 space-y-4">
      <li v-for="item in items" :key="item.file.name" class="relative">
        <QueueItem
          :item="item"
          @remove="removeFile(item.file)"
        />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['open'])
const props = defineProps<{
  active: boolean
}>()


</script>

<template>
  <div class="px-6 py-6 cursor-pointer text-center rounded-xl border border-dashed backdrop-blur"
    :class="[
      props.active ? 'border-blue-400' : 'border-transparent',
    ]"
    @click="emit('open')">
    <p class="text-lg sm:text-xl font-semibold tracking-tight">
      Drop a file to compress
    </p>
    <div class="mt-2 text-sm text-slate-300">
      <span>Drag & drop anywhere, or click</span>
      <div class="inline px-2 mx-1 py-0.5 border-dashed border border-slate-300 rounded-lg">here</div>
      <span>to choose a file.</span>
    </div>
  </div>
</template>

<template>
  <div class="relative w-18">
    <div
      class="flex justify-between items-center px-2 py-1 border border-slate-300/20 rounded cursor-pointer select-none"
      :class="open ? 'rounded-b-none' : ''"
      @click="open = !open"
    >
      <div>{{ options[model] }}</div>
      <div>
        <svg
          class="pointer-events-none absolute right-0.5 top-1/2 size-4 -translate-y-1/2 transition-transform"
          :class="open ? 'rotate-180' : 'rotate-0'"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08z" clip-rule="evenodd"/>
        </svg>
      </div>
    </div>
    <ul v-if="open" class="absolute top-full left-0 right-0 cursor-pointer border border-slate-300/20 border-t-0 rounded-b bg-neutral-700/80" @mousedown.stop="onSelect">
      <li
        v-for="(label, key) in props.options"
        :key="key"
        :data-value="key"
        class="px-2 py-1 hover:bg-neutral-800"
      >{{ label }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

const props = defineProps({
  options: {
    type: Object,
    required: true
  }
})

const model = defineModel<string>({
  required: true
})

const open = ref(false)

const onSelect = (evn: MouseEvent) => {
  if(!evn.target) return
  const el = evn.target as HTMLHtmlElement
  if(!el.dataset.value) return
  model.value = el.dataset.value
  open.value = false
}

const onMouseDown = () => {
  open.value = false
}

onMounted(() => {
  window.document.body.addEventListener('mousedown', onMouseDown)
})
onBeforeUnmount(() => {
  window.document.body.removeEventListener('mousedown', onMouseDown)
})
</script>
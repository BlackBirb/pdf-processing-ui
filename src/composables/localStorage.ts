import { computed, onBeforeUnmount, onMounted, shallowReactive, shallowRef, watch, type ShallowRef } from "vue";

export const useLocalStorage = <T = null>(key: string, defaultValue?: T): ShallowRef<T> => {

  const data = shallowRef<T>(JSON.stringify(defaultValue || null) as T)

  const onStorageEvent = (evn: StorageEvent) => {
    if(evn.storageArea !== localStorage || evn.key !== key)
      return
    if(data.value !== evn.newValue)
      data.value = localStorage.getItem(key)
  }

  onMounted(() => {
    window.addEventListener('storage', onStorageEvent, { passive: true })
    const storedValue = localStorage.getItem(key)
    if(storedValue)
      data.value = storedValue
  })

  onBeforeUnmount(() => {
    window.removeEventListener('storage', onStorageEvent)
  })

  return computed<T>({
    get: () => JSON.parse(data.value),
    set: (val) => {
      const newValue = JSON.stringify(val)
      localStorage.setItem(key, newValue)
      window.dispatchEvent(new StorageEvent('storage', {
        key,
        newValue,
        storageArea: window.localStorage
      }))
    }
  })
}
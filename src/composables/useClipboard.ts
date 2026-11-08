import { onUnmounted, ref } from 'vue'

function fallbackCopy(text: string): boolean {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()

  try {
    return document.execCommand('copy')
  } finally {
    document.body.removeChild(textarea)
  }
}

export function useClipboard(resetDelay = 2000) {
  const copiedKey = ref<string | null>(null)
  let timeout: ReturnType<typeof setTimeout> | null = null

  async function copy(text: string, key = text): Promise<boolean> {
    let copied = false

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
        copied = true
      } else {
        copied = fallbackCopy(text)
      }
    } catch {
      copied = fallbackCopy(text)
    }

    if (!copied) {
      return false
    }

    copiedKey.value = key
    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(() => {
      copiedKey.value = null
      timeout = null
    }, resetDelay)

    return true
  }

  function isCopied(key: string): boolean {
    return copiedKey.value === key
  }

  onUnmounted(() => {
    if (timeout) {
      clearTimeout(timeout)
    }
  })

  return { copiedKey, copy, isCopied }
}

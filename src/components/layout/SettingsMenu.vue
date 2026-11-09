<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { Check, Globe, Monitor, Moon, Settings, Sun } from '@lucide/vue'
import type { Component } from 'vue'
import { usePreferences } from '@/composables/usePreferences'
import { useI18n } from '@/i18n'
import type { LocaleMode, ThemeMode } from '@/types/portfolio'

const { t } = useI18n()
const { themeMode, localeMode, setTheme, setLocale } = usePreferences()

const open = ref(false)
const rootRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLButtonElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)

interface ThemeOption {
  readonly value: ThemeMode
  readonly labelKey: 'settings.system' | 'settings.dark' | 'settings.light'
  readonly icon: Component
}

const themeOptions: readonly ThemeOption[] = [
  { value: 'system', labelKey: 'settings.system', icon: Monitor },
  { value: 'dark', labelKey: 'settings.dark', icon: Moon },
  { value: 'light', labelKey: 'settings.light', icon: Sun },
]

interface LocaleOption {
  readonly value: LocaleMode
  readonly labelKey: 'settings.system' | 'settings.spanish' | 'settings.english'
}

const localeOptions: readonly LocaleOption[] = [
  { value: 'system', labelKey: 'settings.system' },
  { value: 'es', labelKey: 'settings.spanish' },
  { value: 'en', labelKey: 'settings.english' },
]

function toggle(): void {
  open.value = !open.value
}

function close(returnFocus = false): void {
  if (!open.value) {
    return
  }

  open.value = false

  if (returnFocus) {
    triggerRef.value?.focus()
  }
}

function onDocumentPointerDown(event: PointerEvent): void {
  if (!open.value || !rootRef.value) {
    return
  }

  const target = event.target

  if (target instanceof Node && !rootRef.value.contains(target)) {
    close()
  }
}

function onDocumentKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && open.value) {
    event.preventDefault()
    close(true)
  }
}

watch(open, async (isOpen) => {
  if (isOpen) {
    await nextTick()
    panelRef.value?.focus()
  }
})

onMounted(() => {
  document.addEventListener('pointerdown', onDocumentPointerDown)
  document.addEventListener('keydown', onDocumentKeydown)
})

onUnmounted(() => {
  document.removeEventListener('pointerdown', onDocumentPointerDown)
  document.removeEventListener('keydown', onDocumentKeydown)
})
</script>

<template>
  <div ref="rootRef" class="relative">
    <button
      ref="triggerRef"
      type="button"
      class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-border text-muted transition-colors hover:border-border-hover hover:text-cyan-accent"
      :class="open ? 'border-border-hover text-cyan-accent' : ''"
      aria-haspopup="dialog"
      :aria-expanded="open"
      aria-controls="settings-panel"
      :aria-label="t('settings.ariaLabel')"
      @click="toggle"
    >
      <Settings :size="17" aria-hidden="true" />
    </button>

    <Transition name="settings">
      <div
        v-if="open"
        id="settings-panel"
        ref="panelRef"
        role="dialog"
        tabindex="-1"
        aria-labelledby="settings-panel-title"
        class="absolute right-0 top-[calc(100%+0.6rem)] z-50 w-60 overflow-hidden rounded-xl border border-border bg-surface/95 shadow-[0_18px_50px_-12px_rgba(0,0,0,0.7)] backdrop-blur-xl focus:outline-none"
      >
        <div class="border-b border-border/70 px-4 py-3">
          <p id="settings-panel-title" class="font-sans text-sm font-semibold text-foreground">{{ t('settings.title') }}</p>
          <p class="mt-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-muted">
            {{ t('settings.subtitle') }}
          </p>
        </div>

        <div class="p-2">
          <div role="group" :aria-label="t('settings.language')">
            <p
              class="px-2 pb-1 pt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-muted/80"
            >
              {{ t('settings.language') }}
            </p>
            <button
              v-for="option in localeOptions"
              :key="option.value"
              type="button"
              class="flex w-full cursor-pointer items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left font-sans text-xs transition-colors"
              :class="
                localeMode === option.value
                  ? 'bg-cyan-accent/10 text-cyan-accent'
                  : 'text-muted hover:bg-surface-card hover:text-foreground'
              "
              :aria-pressed="localeMode === option.value"
              @click="setLocale(option.value)"
            >
              <span class="flex items-center gap-2">
                <Globe :size="13" aria-hidden="true" class="shrink-0 opacity-70" />
                {{ t(option.labelKey) }}
              </span>
              <Check
                v-if="localeMode === option.value"
                :size="13"
                aria-hidden="true"
                class="shrink-0"
              />
            </button>
          </div>

          <div class="my-2 h-px bg-border/70" aria-hidden="true" />

          <div role="group" :aria-label="t('settings.theme')">
            <p
              class="px-2 pb-1 pt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-muted/80"
            >
              {{ t('settings.theme') }}
            </p>
            <button
              v-for="option in themeOptions"
              :key="option.value"
              type="button"
              class="flex w-full cursor-pointer items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left font-sans text-xs transition-colors"
              :class="
                themeMode === option.value
                  ? 'bg-cyan-accent/10 text-cyan-accent'
                  : 'text-muted hover:bg-surface-card hover:text-foreground'
              "
              :aria-pressed="themeMode === option.value"
              @click="setTheme(option.value)"
            >
              <span class="flex items-center gap-2">
                <component :is="option.icon" :size="13" aria-hidden="true" class="shrink-0 opacity-70" />
                {{ t(option.labelKey) }}
              </span>
              <Check
                v-if="themeMode === option.value"
                :size="13"
                aria-hidden="true"
                class="shrink-0"
              />
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.settings-enter-active,
.settings-leave-active {
  transition:
    opacity 150ms ease,
    transform 150ms ease;
}

.settings-enter-from,
.settings-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}
</style>

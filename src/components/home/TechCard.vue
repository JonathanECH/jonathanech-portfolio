<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import TechIcon from '@/components/ui/TechIcon.vue'
import { useI18n } from '@/i18n'
import type { Technology } from '@/types/portfolio'

const props = defineProps<{
  technology: Technology
  index: number
}>()

const { t } = useI18n()

const paddedIndex = computed(() => String(props.index + 1).padStart(2, '0'))

// iOS does not apply :active to non-interactive elements, so the tap feedback
// is driven by pointer events while ignoring touch-scroll gestures.
const pressed = ref(false)
let pressTimer: number | undefined
let activateTimer: number | undefined
let startX = 0
let startY = 0
let scrollCancelled = false

function clearTimers(): void {
  if (activateTimer !== undefined) {
    window.clearTimeout(activateTimer)
    activateTimer = undefined
  }

  if (pressTimer !== undefined) {
    window.clearTimeout(pressTimer)
    pressTimer = undefined
  }
}

function showPressedState(): void {
  pressed.value = true

  if (pressTimer !== undefined) {
    window.clearTimeout(pressTimer)
  }

  pressTimer = window.setTimeout(() => {
    pressed.value = false
    pressTimer = undefined
  }, 240)
}

function triggerTapFeedback(event?: PointerEvent): void {
  clearTimers()
  scrollCancelled = false

  if (event?.pointerType === 'touch') {
    startX = event.clientX
    startY = event.clientY
    activateTimer = window.setTimeout(() => {
      activateTimer = undefined
      if (!scrollCancelled) {
        showPressedState()
      }
    }, 65)
    return
  }

  showPressedState()
}

function handlePointerMove(event: PointerEvent): void {
  if (event.pointerType !== 'touch' || scrollCancelled) {
    return
  }

  if (Math.hypot(event.clientX - startX, event.clientY - startY) > 6) {
    cancelTapFeedback()
  }
}

function handlePointerUp(event: PointerEvent): void {
  if (event.pointerType === 'touch' && activateTimer !== undefined && !scrollCancelled) {
    window.clearTimeout(activateTimer)
    activateTimer = undefined
    showPressedState()
  }
}

function cancelTapFeedback(): void {
  scrollCancelled = true
  clearTimers()
  pressed.value = false
}

onBeforeUnmount(() => {
  clearTimers()
})
</script>

<template>
  <div class="reveal reveal--stack h-full" role="listitem">
    <article
      class="group relative flex h-full touch-manipulation select-none flex-col overflow-hidden rounded-xl border border-border bg-surface-card/60 p-4 transition-[transform,border-color,background-color] duration-300 motion-safe:hover:-translate-y-1 hover:border-border-hover hover:bg-surface-card-hover hover:shadow-[0_0_30px_-8px_rgba(var(--ech-accent-rgb),0.35)] active:border-accent-hover active:bg-accent-hover/10"
      :style="
        pressed
          ? {
              borderColor: 'var(--ech-accent)',
              backgroundColor: 'rgba(var(--ech-accent-rgb), 0.1)',
              boxShadow: '0 0 26px -8px rgba(var(--ech-accent-rgb), 0.45)',
              transform: 'translateY(-1px) scale(0.99)',
            }
          : undefined
      "
      @pointerdown="triggerTapFeedback"
      @pointermove="handlePointerMove"
      @pointerup="handlePointerUp"
      @pointercancel="cancelTapFeedback"
    >
      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-x-4 top-0 h-px bg-linear-to-r from-transparent via-cyan-accent/60 to-transparent opacity-0 transition-opacity duration-400 group-hover:opacity-100"
      />

      <div class="flex items-start justify-between gap-3">
        <span class="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-accent">
          {{ technology.label }}
        </span>

        <span class="transition-transform duration-400 motion-safe:group-hover:scale-110">
          <TechIcon
            :icon="technology.iconKey"
            :color="technology.brandColor"
            :size="24"
            class="text-muted transition-colors duration-400 [@media(hover:hover)]:group-hover:text-(--brand) group-active:text-(--brand)"
          />
        </span>
      </div>

      <h3
        class="mt-4 font-mono text-base font-bold tracking-wide text-foreground transition-colors duration-400 group-hover:text-accent-hover"
      >
        {{ technology.name }}
      </h3>

      <div class="mt-auto flex items-end justify-between gap-3 pt-5">
        <ul class="flex flex-wrap gap-1.5" :aria-label="t('tech.specialtiesAria')">
          <li
            v-for="specialty in technology.specialties"
            :key="specialty"
            class="rounded border border-cyan-accent/15 bg-cyan-accent/5 px-1.5 py-0.5 font-mono text-[10px] leading-relaxed text-cyan-accent"
          >
            {{ specialty }}
          </li>
        </ul>

        <span
          class="shrink-0 font-mono text-[10px] tabular-nums text-muted transition-colors duration-400 group-hover:text-muted"
          aria-hidden="true"
        >
          {{ paddedIndex }}
        </span>
      </div>
    </article>
  </div>
</template>

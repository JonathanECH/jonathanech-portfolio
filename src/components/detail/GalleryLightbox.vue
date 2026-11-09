<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { ChevronLeft, ChevronRight, X } from '@lucide/vue'
import { useFocusTrap } from '@/composables/useFocusTrap'
import { useScrollLock } from '@/composables/useScrollLock'
import { useSwipeNavigation } from '@/composables/useSwipeNavigation'
import { useI18n } from '@/i18n'
import type { GallerySlide } from '@/types/portfolio'

const props = defineProps<{
  open: boolean
  slide: GallerySlide | null
  index: number
  total: number
  projectName: string
}>()

const emit = defineEmits<{
  close: []
  previous: []
  next: []
}>()

const { t } = useI18n()

const dialogRef = ref<HTMLElement | null>(null)
const locked = ref(false)

const swipe = useSwipeNavigation({
  threshold: 45,
  enabled: computed(() => props.total > 1),
  onNext: () => emit('next'),
  onPrevious: () => emit('previous'),
})

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      locked.value = true
    }
  },
  { immediate: true },
)

watch(
  () => props.slide,
  () => {
    swipe.reset()
  },
)

useScrollLock(locked)
useFocusTrap(dialogRef, computed(() => props.open))

function handleAfterLeave(): void {
  if (!props.open) {
    locked.value = false
    swipe.reset()
  }
}

function handleBackdropClick(): void {
  if (swipe.justSwiped.value) {
    return
  }
  emit('close')
}

function onKeydown(event: KeyboardEvent): void {
  if (!props.open) {
    return
  }

  if (event.key === 'Escape') {
    event.preventDefault()
    emit('close')
    return
  }

  if (event.key === 'ArrowRight') {
    event.preventDefault()
    emit('next')
    return
  }

  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    emit('previous')
  }
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <Transition name="lightbox" @after-leave="handleAfterLeave">
      <div
        v-if="open && slide"
        class="fixed inset-0 z-[120] bg-black/90 backdrop-blur-xl"
        @click.self="handleBackdropClick"
      >
        <div
          ref="dialogRef"
          role="dialog"
          aria-modal="true"
          :aria-label="t('gallery.fullTitle', { title: slide.title, name: projectName })"
          tabindex="-1"
          class="lightbox-panel flex h-full min-h-0 flex-col focus:outline-none"
        >
          <div class="flex shrink-0 items-start justify-between gap-3 px-4 pb-2 pt-4 sm:px-6">
            <div class="min-w-0">
              <p class="truncate font-mono text-[10px] uppercase tracking-[0.18em] text-white/60">
                {{ projectName }} // {{ index + 1 }} / {{ total }}
              </p>
              <h2
                id="detail-lightbox-title"
                class="mt-1 truncate font-sans text-sm font-bold text-white sm:text-lg"
              >
                {{ slide.title }}
              </h2>
            </div>

            <button
              type="button"
              class="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-lg transition-all duration-200 hover:border-cyan-accent hover:bg-cyan-accent hover:text-black focus-visible:outline-white active:scale-95"
              :aria-label="t('gallery.closeFull')"
              @click="emit('close')"
            >
              <X :size="22" aria-hidden="true" />
            </button>
          </div>

          <div
            class="relative flex min-h-0 flex-1 select-none items-center justify-center px-2 py-2 sm:px-16 sm:py-4"
            :class="total > 1 ? (swipe.isDragging.value ? 'cursor-grabbing' : 'cursor-grab') : ''"
            style="touch-action: pan-y"
            @pointerdown="swipe.onPointerDown"
            @pointermove="swipe.onPointerMove"
            @pointerup="swipe.onPointerUp"
            @pointercancel="swipe.onPointerCancel"
            @click.self="handleBackdropClick"
          >
            <button
              v-if="total > 1"
              type="button"
              class="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/45 text-white backdrop-blur-sm transition-all duration-200 hover:border-cyan-accent hover:bg-cyan-accent hover:text-black active:scale-95 sm:left-5 sm:h-12 sm:w-12"
              :aria-label="t('gallery.previous')"
              @click.stop="emit('previous')"
            >
              <ChevronLeft :size="24" aria-hidden="true" />
            </button>

            <div
              class="relative flex max-h-full max-w-full items-center justify-center will-change-transform"
              :style="{
                transform: `translateX(${swipe.offsetX.value}px)`,
                transition: swipe.isDragging.value
                  ? 'none'
                  : 'transform 260ms cubic-bezier(0.16, 1, 0.3, 1), opacity 260ms ease',
                opacity: 1 - Math.min(Math.abs(swipe.offsetX.value) / 800, 0.35),
              }"
            >
              <img
                :key="slide.id"
                :src="slide.image"
                :alt="slide.alt ?? slide.title"
                draggable="false"
                class="max-h-full w-full max-w-full select-none rounded-lg object-contain shadow-[0_24px_90px_-24px_rgba(0,0,0,0.95)] sm:w-auto"
                style="touch-action: pan-y"
              />
            </div>

            <button
              v-if="total > 1"
              type="button"
              class="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/45 text-white backdrop-blur-sm transition-all duration-200 hover:border-cyan-accent hover:bg-cyan-accent hover:text-black active:scale-95 sm:right-5 sm:h-12 sm:w-12"
              :aria-label="t('gallery.next')"
              @click.stop="emit('next')"
            >
              <ChevronRight :size="24" aria-hidden="true" />
            </button>
          </div>

          <div class="shrink-0 px-4 pb-5 pt-1 sm:px-6">
            <div
              class="mx-auto flex max-w-4xl flex-col items-center gap-2 border-t border-white/10 pt-3 text-center"
            >
              <p class="text-sm leading-relaxed text-white/85">{{ slide.caption }}</p>
              <div
                class="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.16em] text-white/60"
              >
                <span aria-live="polite">{{ index + 1 }} / {{ total }}</span>
                <span aria-hidden="true">//</span>
                <span>{{ t('gallery.fullHint') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 220ms ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}

.lightbox-enter-active .lightbox-panel,
.lightbox-leave-active .lightbox-panel {
  transition:
    transform 240ms cubic-bezier(0.16, 1, 0.3, 1),
    opacity 220ms ease;
}

.lightbox-enter-from .lightbox-panel,
.lightbox-leave-to .lightbox-panel {
  opacity: 0;
  transform: scale(0.98);
}
</style>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from '@lucide/vue'
import { useFocusTrap } from '@/composables/useFocusTrap'
import { useScrollLock } from '@/composables/useScrollLock'
import { useSwipeNavigation } from '@/composables/useSwipeNavigation'
import { useZoom } from '@/composables/useZoom'
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
const stageRef = ref<HTMLElement | null>(null)
const imageRef = ref<HTMLElement | null>(null)
const locked = ref(false)

const zoom = useZoom({
  stage: stageRef,
  target: imageRef,
})

const swipe = useSwipeNavigation({
  threshold: 45,
  enabled: computed(
    () => props.total > 1 && !zoom.isZoomed.value && !zoom.isPinching.value,
  ),
  onNext: () => goNext(),
  onPrevious: () => goPrevious(),
})

// Pinch and swipe must never run at the same time: as soon as a second finger
// lands, the in-flight horizontal drag is discarded and zoom takes over.
watch(
  zoom.isPinching,
  (isPinching) => {
    if (isPinching) {
      swipe.reset()
    }
  },
  { flush: 'sync' },
)

watch(
  zoom.isZoomed,
  (isZoomed) => {
    if (isZoomed) {
      swipe.reset()
    }
  },
  { flush: 'sync' },
)

const stageCursor = computed(() => {
  if (zoom.isInteracting.value || swipe.isDragging.value) return 'cursor-grabbing'
  if (zoom.isZoomed.value || props.total > 1) return 'cursor-grab'
  return ''
})

const swipeTrackStyle = computed(() => ({
  transform: `translateX(${swipe.offsetX.value}px)`,
  transition: swipe.isDragging.value
    ? 'none'
    : 'transform 260ms cubic-bezier(0.16, 1, 0.3, 1), opacity 260ms ease',
  opacity: 1 - Math.min(Math.abs(swipe.offsetX.value) / 800, 0.35),
}))

const imageStyle = computed(() => ({
  ...zoom.transformStyle.value,
  transition: zoom.transitionEnabled.value
    ? 'transform 280ms cubic-bezier(0.22, 1, 0.36, 1), transform-origin 280ms cubic-bezier(0.22, 1, 0.36, 1)'
    : 'none',
}))

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      locked.value = true
      swipe.reset()
      zoom.resetZoom(true)
    }
  },
  { immediate: true },
)

watch(
  () => props.slide?.id,
  () => {
    swipe.reset()
    zoom.resetZoom(true)
  },
)

useScrollLock(locked)
useFocusTrap(dialogRef, computed(() => props.open))

function goNext(): void {
  if (zoom.isZoomed.value) {
    return
  }

  emit('next')
}

function goPrevious(): void {
  if (zoom.isZoomed.value) {
    return
  }

  emit('previous')
}

function handleAfterLeave(): void {
  if (!props.open) {
    locked.value = false
    swipe.reset()
    zoom.resetZoom(true)
  }
}

function handleBackdropClick(): void {
  if (swipe.justSwiped.value || zoom.justPanned.value) {
    return
  }

  emit('close')
}

function handlePointerDown(event: PointerEvent): void {
  swipe.onPointerDown(event)
  zoom.onPointerDown(event)
}

function handlePointerMove(event: PointerEvent): void {
  swipe.onPointerMove(event)
  zoom.onPointerMove(event)
}

function handlePointerUp(event: PointerEvent): void {
  swipe.onPointerUp(event)
  zoom.onPointerUp(event)
}

function handlePointerCancel(event: PointerEvent): void {
  swipe.onPointerCancel(event)
  zoom.onPointerCancel(event)
}

function handleStageClick(event: MouseEvent): void {
  if (event.target === imageRef.value) {
    return
  }

  handleBackdropClick()
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
    goNext()
    return
  }

  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    goPrevious()
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
        class="fixed inset-0 z-[120] flex h-dvh w-screen flex-col overflow-hidden bg-black/95 backdrop-blur-xl"
        @click.self="handleBackdropClick"
      >
        <div
          ref="dialogRef"
          role="dialog"
          aria-modal="true"
          :aria-label="t('gallery.fullTitle', { title: slide.title, name: projectName })"
          tabindex="-1"
          class="lightbox-panel flex h-full min-h-0 w-full flex-col justify-between overflow-hidden focus:outline-none"
        >
          <div
            class="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-black/40 px-4 py-3 sm:px-8 sm:py-4"
          >
            <div class="min-w-0">
              <p class="truncate font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-accent">
                {{ projectName }} // {{ index + 1 }} / {{ total }}
              </p>
              <h2
                id="detail-lightbox-title"
                class="mt-0.5 truncate font-sans text-sm font-bold text-white sm:text-base md:text-lg"
              >
                {{ slide.title }}
              </h2>
            </div>

            <div class="flex shrink-0 items-center gap-2">
              <button
                type="button"
                class="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-lg transition-all duration-200 hover:border-cyan-accent hover:bg-cyan-accent hover:text-black focus-visible:outline-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-white/20 disabled:hover:bg-white/10 disabled:hover:text-white disabled:active:scale-100 sm:h-11 sm:w-11"
                :aria-label="t('gallery.zoomOut')"
                :disabled="!zoom.canZoomOut.value"
                @click="zoom.zoomOut"
              >
                <ZoomOut :size="20" aria-hidden="true" />
              </button>

              <button
                type="button"
                class="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-lg transition-all duration-200 hover:border-cyan-accent hover:bg-cyan-accent hover:text-black focus-visible:outline-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-white/20 disabled:hover:bg-white/10 disabled:hover:text-white disabled:active:scale-100 sm:h-11 sm:w-11"
                :aria-label="t('gallery.zoomIn')"
                :disabled="!zoom.canZoomIn.value"
                @click="zoom.zoomIn"
              >
                <ZoomIn :size="20" aria-hidden="true" />
              </button>

              <button
                type="button"
                class="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-lg transition-all duration-200 hover:border-cyan-accent hover:bg-cyan-accent hover:text-black focus-visible:outline-white active:scale-95 sm:h-11 sm:w-11"
                :aria-label="t('gallery.closeFull')"
                @click="emit('close')"
              >
                <X :size="20" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div class="relative flex min-h-0 flex-1 select-none items-center justify-center overflow-hidden">
            <button
              v-if="total > 1 && !zoom.isZoomed.value"
              type="button"
              class="absolute left-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-sm transition-all duration-200 hover:border-cyan-accent hover:bg-cyan-accent hover:text-black active:scale-95 sm:left-5 sm:h-12 sm:w-12"
              :aria-label="t('gallery.previous')"
              @click.stop="goPrevious"
            >
              <ChevronLeft :size="24" aria-hidden="true" />
            </button>

            <button
              v-if="total > 1 && !zoom.isZoomed.value"
              type="button"
              class="absolute right-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-sm transition-all duration-200 hover:border-cyan-accent hover:bg-cyan-accent hover:text-black active:scale-95 sm:right-5 sm:h-12 sm:w-12"
              :aria-label="t('gallery.next')"
              @click.stop="goNext"
            >
              <ChevronRight :size="24" aria-hidden="true" />
            </button>

            <div
              ref="stageRef"
              class="absolute inset-0 flex touch-none items-center justify-center overflow-hidden px-3 py-2 sm:px-16 md:px-20 lg:px-24"
              :class="stageCursor"
              @pointerdown="handlePointerDown"
              @pointermove="handlePointerMove"
              @pointerup="handlePointerUp"
              @pointercancel="handlePointerCancel"
              @touchstart="zoom.onTouchStart"
              @touchmove.prevent="zoom.onTouchMove"
              @touchend="zoom.onTouchEnd"
              @touchcancel="zoom.onTouchCancel"
              @click="handleStageClick"
            >
              <div
                class="flex h-full w-full items-center justify-center will-change-transform"
                :style="swipeTrackStyle"
              >
                <img
                  ref="imageRef"
                  :key="slide.id"
                  :src="slide.image"
                  :alt="slide.alt ?? slide.title"
                  draggable="false"
                  class="block h-auto w-auto max-h-[50vh] max-h-full max-w-[92vw] max-w-full select-none rounded-xl border border-white/10 object-contain shadow-[0_24px_70px_-20px_rgba(0,0,0,0.9)] will-change-transform sm:max-h-[56vh] sm:max-w-[85vw] lg:max-h-[60vh] lg:max-w-4xl xl:max-h-[64vh] xl:max-w-5xl"
                  :style="imageStyle"
                />
              </div>
            </div>
          </div>

          <div class="shrink-0 border-t border-white/10 bg-black/40 px-4 py-3 sm:px-8 sm:py-4">
            <div class="mx-auto flex max-w-3xl flex-col items-center gap-1.5 text-center">
              <p class="font-sans text-xs leading-relaxed text-white/90 sm:text-sm md:text-base">
                {{ slide.caption }}
              </p>
              <div
                class="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.16em] text-white/55 sm:text-xs"
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

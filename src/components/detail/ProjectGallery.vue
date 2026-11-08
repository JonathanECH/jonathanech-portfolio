<script setup lang="ts">
import { computed, ref } from 'vue'
import { ChevronLeft, ChevronRight, Lock, Pause, Play } from '@lucide/vue'
import MockupCanvas from '@/components/detail/MockupCanvas.vue'
import { useCinematicCarousel } from '@/composables/useCinematicCarousel'
import type { Project } from '@/types/portfolio'

const props = defineProps<{ project: Project }>()

const gallerySlides = props.project.gallery

const {
  activeIndex,
  activeSlide,
  isPlaying,
  progressKey,
  reducedMotion,
  next,
  prev,
  goTo,
  pause,
  resume,
  toggle,
} = useCinematicCarousel(gallerySlides)

const total = computed(() => gallerySlides.length)
const currentPath = computed(() => activeSlide.value?.path ?? 'overview')

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

const counterLabel = computed(() => `${pad(activeIndex.value + 1)} / ${pad(total.value)}`)

const manualAnnouncement = ref('')

const stageRef = ref<HTMLElement | null>(null)
const isHovered = ref(false)
const isFocused = ref(false)

function syncStagePause(): void {
  if (isHovered.value || isFocused.value) {
    pause({ manual: false })
    return
  }
  resume({ manual: false })
}

function handlePointerEnter(): void {
  isHovered.value = true
  syncStagePause()
}

function handlePointerLeave(): void {
  isHovered.value = false
  syncStagePause()
}

function handleFocusIn(): void {
  isFocused.value = true
  syncStagePause()
}

function handleFocusOut(event: FocusEvent): void {
  const nextTarget = event.relatedTarget
  if (nextTarget instanceof Node && stageRef.value?.contains(nextTarget)) {
    return
  }
  isFocused.value = false
  syncStagePause()
}

/**
 * Manual navigation calls `schedule(true)` inside the composable, which starts
 * a fresh timer. If the stage is still hovered or focused, re-apply the
 * transient pause so manual controls never resume autoplay under the pointer.
 */
function keepPausedWhileEngaged(): void {
  if (isHovered.value || isFocused.value) {
    pause({ manual: false })
  }
}

function handlePrev(): void {
  prev()
  keepPausedWhileEngaged()
  announceCurrent()
}

function handleNext(): void {
  next()
  keepPausedWhileEngaged()
  announceCurrent()
}

function handleGoTo(index: number): void {
  goTo(index)
  keepPausedWhileEngaged()
  announceCurrent()
}

function announceCurrent(): void {
  manualAnnouncement.value = `Captura ${activeIndex.value + 1} de ${total.value}: ${activeSlide.value?.title ?? ''}`
}
</script>

<template>
  <section
    class="overflow-hidden rounded-xl border border-border bg-surface-card/50 shadow-[0_8px_32px_rgba(0,0,0,0.55)]"
    role="region"
    aria-roledescription="carousel"
    :aria-label="`Galería de capturas de ${project.name}`"
  >
    <!-- Console HUD -->
    <div
      class="relative flex h-10 items-center justify-between gap-2 border-b border-border bg-surface-card/70 px-3 sm:px-4"
    >
      <div class="flex min-w-0 flex-1 items-center gap-2">
        <div class="flex shrink-0 items-center gap-1.5" aria-hidden="true">
          <span class="h-2.5 w-2.5 rounded-full bg-danger/70" />
          <span class="h-2.5 w-2.5 rounded-full bg-warning-soft/70" />
          <span class="h-2.5 w-2.5 rounded-full bg-success/70" />
        </div>
        <span
          class="min-w-0 truncate font-mono text-[9px] tracking-wide text-muted sm:text-[11px]"
        >
          {{ project.liveHost }}
          <span class="text-white/20">//</span>
          <span class="text-white/70">{{ currentPath }}</span>
        </span>
      </div>

      <div class="flex shrink-0 items-center gap-1.5 sm:gap-3">
        <button
          type="button"
          class="flex h-6 items-center gap-1 rounded-sm border border-border bg-background/60 px-1.5 text-muted transition-colors hover:border-cyan-accent/50 hover:text-cyan-accent"
          :class="
            reducedMotion
              ? 'cursor-not-allowed opacity-50 hover:border-border hover:text-muted'
              : ''
          "
          :disabled="reducedMotion"
          :aria-label="
            reducedMotion
              ? 'Reproducción automática desactivada por movimiento reducido'
              : isPlaying
                ? 'Pausar reproducción automática'
                : 'Reanudar reproducción automática'
          "
          @click="toggle"
        >
          <Pause v-if="reducedMotion || isPlaying" class="h-3 w-3" aria-hidden="true" />
          <Play v-else class="h-3 w-3" aria-hidden="true" />
          <span class="font-mono text-[8px] uppercase tracking-wider sm:text-[9px]">
            {{ reducedMotion ? 'SIN AUTOPLAY' : isPlaying ? 'AUTOPLAY' : 'PAUSA' }}
          </span>
        </button>

        <span
          class="flex items-center gap-1.5 rounded-sm border border-border bg-background/60 px-2 py-0.5 font-mono text-[9px] font-semibold sm:text-[10px]"
          :style="{ color: project.accent }"
        >
          <span
            class="h-1.5 w-1.5 rounded-full"
            :class="isPlaying ? 'animate-pulse-dot' : 'opacity-40'"
            :style="{ backgroundColor: project.accent }"
          />
          {{ counterLabel }}
        </span>

        <span class="hidden items-center gap-1.5 font-mono text-[10px] text-muted md:flex">
          <Lock class="h-3 w-3" aria-hidden="true" />
          HTTPS // SECURE
        </span>
      </div>

      <div class="absolute inset-x-0 bottom-0 h-[2px] overflow-hidden bg-white/10">
        <div
          :key="progressKey"
          class="h-full w-full origin-left animate-carousel-progress"
          :style="{
            backgroundColor: project.accent,
            animationPlayState: isPlaying ? 'running' : 'paused',
          }"
        />
      </div>
    </div>

    <!-- Stage -->
    <div
      ref="stageRef"
      class="group relative aspect-[4/3] w-full overflow-hidden bg-background sm:aspect-[16/9]"
      tabindex="0"
      role="group"
      :aria-label="`Captura ${activeIndex + 1} de ${total}: ${activeSlide?.title ?? ''}`"
      @keydown.left.prevent="handlePrev"
      @keydown.right.prevent="handleNext"
      @mouseenter="handlePointerEnter"
      @mouseleave="handlePointerLeave"
      @focusin="handleFocusIn"
      @focusout="handleFocusOut"
    >
      <Transition name="gallery-slide">
        <div
          v-if="activeSlide"
          :key="`${project.slug}-${activeSlide.id}-${activeIndex}`"
          class="absolute inset-0"
        >
          <MockupCanvas :slide="activeSlide" :accent="project.accent" :project-slug="project.slug" />
        </div>
      </Transition>

      <button
        type="button"
        class="absolute left-2 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-sm border border-border bg-background/80 text-white/80 backdrop-blur-md transition-all hover:border-cyan-accent/70 hover:text-cyan-accent active:scale-95 sm:left-4 sm:h-10 sm:w-10"
        aria-label="Captura anterior"
        @click="handlePrev"
      >
        <ChevronLeft class="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
      </button>

      <button
        type="button"
        class="absolute right-2 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-sm border border-border bg-background/80 text-white/80 backdrop-blur-md transition-all hover:border-cyan-accent/70 hover:text-cyan-accent active:scale-95 sm:right-4 sm:h-10 sm:w-10"
        aria-label="Captura siguiente"
        @click="handleNext"
      >
        <ChevronRight class="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
      </button>

      <div
        class="absolute right-2 top-2 z-20 flex items-center gap-1.5 rounded-sm border border-border bg-background/80 px-2 py-1.5 backdrop-blur-md sm:right-3 sm:top-3"
      >
        <button
          v-for="(slide, index) in gallerySlides"
          :key="slide.id"
          type="button"
          class="h-1.5 rounded-full transition-all duration-300"
          :class="index === activeIndex ? 'w-6' : 'w-2 bg-white/25 hover:bg-white/50'"
          :style="index === activeIndex ? { backgroundColor: project.accent } : undefined"
          :aria-label="`Ver captura ${index + 1}: ${slide.title}`"
          :aria-current="index === activeIndex ? 'true' : 'false'"
          @click="handleGoTo(index)"
        />
      </div>
    </div>

    <!-- Caption + badges -->
    <div class="border-t border-border bg-surface/60 px-4 py-3 sm:px-5 sm:py-4">
      <p class="sr-only" aria-live="polite" aria-atomic="true">{{ manualAnnouncement }}</p>
      <div>
        <p class="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-accent/80">
          {{ activeSlide?.title ?? 'Sin captura' }}
        </p>
        <p class="mt-1.5 max-w-3xl text-sm leading-relaxed text-muted">
          {{ activeSlide?.caption }}
        </p>
      </div>

      <div class="mt-3 flex flex-wrap items-center gap-1.5 sm:gap-2">
        <span
          v-for="badge in activeSlide?.badges ?? []"
          :key="badge"
          class="rounded-sm border border-cyan-accent/20 bg-cyan-accent/[0.06] px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-cyan-accent/90 sm:text-[10px]"
        >
          {{ badge }}
        </span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.gallery-slide-enter-active,
.gallery-slide-leave-active {
  transition:
    opacity 420ms ease,
    transform 420ms ease;
}

.gallery-slide-enter-from {
  opacity: 0;
  transform: scale(1.02);
}

.gallery-slide-leave-to {
  opacity: 0;
  transform: scale(0.99);
}

.gallery-slide-leave-active {
  pointer-events: none;
}
</style>

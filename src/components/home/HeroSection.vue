<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { Activity, ArrowRight, Download, MapPin, Terminal } from '@lucide/vue'
import { profile } from '@/data/portfolio'

const sectionRef = ref<HTMLElement | null>(null)
const spotlightX = ref(50)
const spotlightY = ref(38)

let rafId: number | null = null
let pendingX = 50
let pendingY = 38

const spotlightStyle = computed(() => ({
  '--mouse-x': `${spotlightX.value}%`,
  '--mouse-y': `${spotlightY.value}%`,
}))

function commitSpotlight(): void {
  spotlightX.value = pendingX
  spotlightY.value = pendingY
  rafId = null
}

function handlePointerMove(event: PointerEvent): void {
  const node = sectionRef.value

  if (!node) {
    return
  }

  const rect = node.getBoundingClientRect()

  if (rect.width === 0 || rect.height === 0) {
    return
  }

  pendingX = ((event.clientX - rect.left) / rect.width) * 100
  pendingY = ((event.clientY - rect.top) / rect.height) * 100

  if (rafId === null) {
    rafId = window.requestAnimationFrame(commitSpotlight)
  }
}

onMounted(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const hasFinePointer = window.matchMedia('(pointer: fine)').matches

  if (prefersReducedMotion || !hasFinePointer) {
    return
  }

  sectionRef.value?.addEventListener('pointermove', handlePointerMove, { passive: true })
})

onBeforeUnmount(() => {
  sectionRef.value?.removeEventListener('pointermove', handlePointerMove)

  if (rafId !== null) {
    window.cancelAnimationFrame(rafId)
    rafId = null
  }
})
</script>

<template>
  <section
    id="inicio"
    ref="sectionRef"
    class="relative flex min-h-screen w-full scroll-mt-20 items-center overflow-hidden border-b border-border/60 bg-background"
  >
    <div aria-hidden="true" class="pointer-events-none absolute inset-0 overflow-hidden">
      <div class="absolute inset-0 bg-grid opacity-50" />
      <div
        class="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(0,229,255,0.08),transparent_58%)]"
      />
      <div class="hero-spotlight absolute inset-0" :style="spotlightStyle" />
      <div class="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </div>

    <div
      class="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-5 pb-16 pt-28 text-center sm:px-6 sm:pt-32 lg:px-12 lg:pb-24 lg:pt-36"
    >
      <div class="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
        <p
          class="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-muted sm:text-[11px]"
        >
          <MapPin :size="13" class="text-cyan-accent/80" aria-hidden="true" />
          {{ profile.location }}
        </p>

        <span class="hidden h-3 w-px bg-border sm:block" aria-hidden="true" />

        <span
          class="inline-flex items-center gap-2 rounded-full border border-cyan-accent/25 bg-cyan-accent/5 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-cyan-accent sm:text-[10px]"
        >
          <span
            class="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-cyan-accent"
            aria-hidden="true"
          />
          Disponible para proyectos
        </span>
      </div>

      <p class="mt-7 font-mono text-xs tracking-[0.08em] text-white/65 sm:text-sm">
        {{ profile.name }}<span
          class="ml-0.5 inline-block h-3.5 w-[2px] translate-y-0.5 animate-cursor bg-cyan-accent align-middle"
          aria-hidden="true"
        />
      </p>

      <h1 class="mt-3 flex flex-col items-center gap-2">
        <span
          class="block font-sans text-2xl font-bold uppercase leading-tight tracking-[-0.02em] text-white sm:text-3xl lg:text-4xl"
        >
          {{ profile.headline[0] }}
        </span>
        <span
          class="block font-sans text-[2.4rem] font-black uppercase leading-[0.95] tracking-[-0.04em] text-cyan-accent text-glow min-[380px]:text-5xl sm:text-6xl lg:text-8xl"
        >
          {{ profile.headline[1] }}
        </span>
      </h1>

      <p
        class="mt-7 max-w-2xl text-balance text-sm leading-relaxed text-muted sm:text-base lg:text-[17px]"
      >
        Construyo interfaces web escalables, reactivas y optimizadas. Especializado en el ecosistema
        Vue, audito la lógica de negocio antes de escribir código para garantizar sistemas que no
        fallan en silencio.
      </p>

      <div class="mt-9 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row">
        <a
          href="#proyectos"
          class="group inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-accent px-6 py-3.5 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-black shadow-[0_0_0_0_rgba(0,229,255,0)] transition-all duration-300 hover:shadow-[0_0_28px_rgba(0,229,255,0.45)] active:scale-[0.98] sm:text-xs"
        >
          <Terminal :size="16" aria-hidden="true" />
          Explorar proyectos
          <ArrowRight
            :size="15"
            class="transition-transform duration-300 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </a>

        <a
          href="/cv/jonathan-campos-cv.pdf"
          download
          class="group inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-surface/60 px-6 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:border-border-hover hover:bg-surface-card hover:text-cyan-accent active:scale-[0.98] sm:text-xs"
        >
          <Download
            :size="16"
            class="transition-transform duration-300 group-hover:translate-y-0.5"
            aria-hidden="true"
          />
          Descargar CV
        </a>
      </div>

      <div class="mt-12 w-full max-w-2xl">
        <div
          class="mb-3 flex items-center justify-center gap-2 font-mono text-[9px] uppercase tracking-[0.22em] text-muted/60 sm:text-[10px]"
        >
          <Activity :size="12" class="text-cyan-accent/70" aria-hidden="true" />
          System metrics // verified
        </div>

        <dl
          class="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border/60 sm:grid-cols-3"
        >
          <div
            v-for="stat in profile.stats"
            :key="stat.label"
            class="bg-background/85 px-5 py-4 text-center sm:text-left"
          >
            <dt class="font-mono text-[9px] uppercase tracking-[0.2em] text-muted/70 sm:text-[10px]">
              {{ stat.label }}
            </dt>
            <dd class="mt-1 font-sans text-sm font-semibold text-white">{{ stat.value }}</dd>
          </div>
        </dl>
      </div>

      <a
        href="#stack"
        class="mt-10 inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.22em] text-muted/60 transition-colors duration-300 hover:text-cyan-accent sm:text-[10px]"
      >
        Scroll // Stack
        <ArrowRight :size="13" class="rotate-90" aria-hidden="true" />
      </a>
    </div>
  </section>
</template>

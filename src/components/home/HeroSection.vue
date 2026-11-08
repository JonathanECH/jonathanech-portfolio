<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { Activity, ArrowRight, Download, MapPin, Terminal } from '@lucide/vue'
import { useI18n } from '@/i18n'

const { content, t } = useI18n()
const profile = computed(() => content.value.profile)

interface HeroParticle {
  x: number
  y: number
  vx: number
  vy: number
  baseRadius: number
  radius: number
  alpha: number
  currentAlpha: number
}

const sectionRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

const POINTER_RADIUS = 180
const CONNECT_DISTANCE = 115
const MAX_PARTICLES = 55

let ctx: CanvasRenderingContext2D | null = null
let particles: HeroParticle[] = []
let width = 0
let height = 0
let pointerX = 0
let pointerY = 0
let targetX = 0
let targetY = 0
let isHovered = false
let clock = 0
let rafId: number | null = null
let resizeObserver: ResizeObserver | null = null
let visibilityObserver: IntersectionObserver | null = null
let prefersReducedMotion = false
let isVisible = true

function createParticles(): void {
  const count = Math.min(Math.floor((width * 500) / 12000), MAX_PARTICLES)

  particles = Array.from({ length: count }, () => {
    const baseRadius = Math.random() * 1.5 + 0.8
    const alpha = Math.random() * 0.45 + 0.2

    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      baseRadius,
      radius: baseRadius,
      alpha,
      currentAlpha: alpha,
    }
  })
}

function updateSpotlight(): void {
  const section = sectionRef.value

  if (!section || width === 0 || height === 0) {
    return
  }

  section.style.setProperty('--mouse-x', `${((pointerX / width) * 100).toFixed(2)}%`)
  section.style.setProperty('--mouse-y', `${((pointerY / height) * 100).toFixed(2)}%`)
}

function drawParticle(particle: HeroParticle): void {
  if (!ctx) {
    return
  }

  ctx.beginPath()
  ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
  ctx.fillStyle = `rgba(0, 229, 255, ${particle.currentAlpha})`
  ctx.shadowBlur = particle.radius > 2 ? 10 : 4
  ctx.shadowColor = '#00E5FF'
  ctx.fill()
  ctx.shadowBlur = 0
}

function updateParticle(particle: HeroParticle): void {
  particle.x += particle.vx
  particle.y += particle.vy

  if (particle.x < 0) {
    particle.x = width
  } else if (particle.x > width) {
    particle.x = 0
  }

  if (particle.y < 0) {
    particle.y = height
  } else if (particle.y > height) {
    particle.y = 0
  }

  const dx = pointerX - particle.x
  const dy = pointerY - particle.y
  const distance = Math.hypot(dx, dy)

  if (distance < POINTER_RADIUS) {
    const factor = (POINTER_RADIUS - distance) / POINTER_RADIUS
    const angle = Math.atan2(dy, dx)

    particle.x -= Math.cos(angle) * factor * 2.8
    particle.y -= Math.sin(angle) * factor * 2.8
    particle.radius = particle.baseRadius + factor * 2.2
    particle.currentAlpha = Math.min(1, particle.alpha + factor * 0.6)
  } else {
    particle.radius = particle.baseRadius
    particle.currentAlpha = particle.alpha
  }
}

function drawConnections(): void {
  if (!ctx) {
    return
  }

  for (let i = 0; i < particles.length; i += 1) {
    for (let j = i + 1; j < particles.length; j += 1) {
      const a = particles[i]
      const b = particles[j]
      const distance = Math.hypot(a.x - b.x, a.y - b.y)

      if (distance >= CONNECT_DISTANCE) {
        continue
      }

      const midX = (a.x + b.x) / 2
      const midY = (a.y + b.y) / 2
      const nearPointer = Math.hypot(pointerX - midX, pointerY - midY) < POINTER_RADIUS
      const glowMultiplier = nearPointer ? 2.2 : 1
      const alpha = (1 - distance / CONNECT_DISTANCE) * 0.16 * glowMultiplier

      ctx.beginPath()
      ctx.moveTo(a.x, a.y)
      ctx.lineTo(b.x, b.y)
      ctx.strokeStyle = `rgba(0, 229, 255, ${Math.min(alpha, 0.5)})`
      ctx.lineWidth = glowMultiplier > 1 ? 0.9 : 0.6
      ctx.stroke()
    }

    const pointerDistance = Math.hypot(pointerX - particles[i].x, pointerY - particles[i].y)

    if (pointerDistance < POINTER_RADIUS) {
      ctx.beginPath()
      ctx.moveTo(particles[i].x, particles[i].y)
      ctx.lineTo(pointerX, pointerY)
      ctx.strokeStyle = `rgba(0, 229, 255, ${(1 - pointerDistance / POINTER_RADIUS) * 0.28})`
      ctx.lineWidth = 0.85
      ctx.stroke()
    }
  }
}

function drawFrame(advance: boolean): void {
  if (!ctx) {
    return
  }

  ctx.clearRect(0, 0, width, height)

  for (const particle of particles) {
    if (advance) {
      updateParticle(particle)
    }

    drawParticle(particle)
  }

  drawConnections()
}

function tick(): void {
  rafId = null

  if (!ctx || width === 0 || height === 0) {
    return
  }

  clock += 0.018

  if (!isHovered) {
    targetX = width * 0.5 + Math.sin(clock * 0.7) * width * 0.25
    targetY = height * 0.4 + Math.cos(clock * 0.5) * height * 0.15
  }

  pointerX += (targetX - pointerX) * 0.085
  pointerY += (targetY - pointerY) * 0.085

  updateSpotlight()
  drawFrame(true)

  rafId = window.requestAnimationFrame(tick)
}

function startAnimation(): void {
  if (prefersReducedMotion || rafId !== null) {
    return
  }

  rafId = window.requestAnimationFrame(tick)
}

function stopAnimation(): void {
  if (rafId !== null) {
    window.cancelAnimationFrame(rafId)
    rafId = null
  }
}

function resizeCanvas(): void {
  const section = sectionRef.value
  const canvas = canvasRef.value

  if (!section || !canvas) {
    return
  }

  const rect = section.getBoundingClientRect()

  if (rect.width === 0 || rect.height === 0) {
    return
  }

  const dpr = Math.min(window.devicePixelRatio || 1, 2)

  width = rect.width
  height = rect.height
  canvas.width = Math.floor(width * dpr)
  canvas.height = Math.floor(height * dpr)
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`

  ctx = canvas.getContext('2d')

  if (!ctx) {
    return
  }

  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.scale(dpr, dpr)

  pointerX = width * 0.5
  pointerY = height * 0.45
  targetX = pointerX
  targetY = pointerY

  createParticles()
  updateSpotlight()

  if (prefersReducedMotion) {
    drawFrame(false)
  }
}

function handlePointerMove(event: PointerEvent): void {
  const section = sectionRef.value

  if (!section) {
    return
  }

  const rect = section.getBoundingClientRect()

  if (rect.width === 0 || rect.height === 0) {
    return
  }

  targetX = event.clientX - rect.left
  targetY = event.clientY - rect.top
  isHovered = true
}

function handlePointerEnter(): void {
  isHovered = true
}

function handlePointerLeave(): void {
  isHovered = false
}

onMounted(() => {
  prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  resizeCanvas()

  const section = sectionRef.value

  if (!section) {
    return
  }

  if (!prefersReducedMotion) {
    section.addEventListener('pointerenter', handlePointerEnter, { passive: true })
    section.addEventListener('pointermove', handlePointerMove, { passive: true })
    section.addEventListener('pointerleave', handlePointerLeave, { passive: true })

    visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting

      if (isVisible) {
        startAnimation()
      } else {
        stopAnimation()
      }
    })
    visibilityObserver.observe(section)
  }

  resizeObserver = new ResizeObserver(() => {
    resizeCanvas()

    if (!prefersReducedMotion && isVisible) {
      startAnimation()
    }
  })
  resizeObserver.observe(section)
})

onBeforeUnmount(() => {
  stopAnimation()

  const section = sectionRef.value

  section?.removeEventListener('pointerenter', handlePointerEnter)
  section?.removeEventListener('pointermove', handlePointerMove)
  section?.removeEventListener('pointerleave', handlePointerLeave)

  resizeObserver?.disconnect()
  visibilityObserver?.disconnect()
  resizeObserver = null
  visibilityObserver = null
  ctx = null
  particles = []
})
</script>

<template>
  <section
    id="inicio"
    ref="sectionRef"
    class="relative flex min-h-screen w-full scroll-mt-20 items-center overflow-hidden border-b border-border/60 bg-background"
  >
    <div aria-hidden="true" class="pointer-events-none absolute inset-0 overflow-hidden">
      <canvas ref="canvasRef" class="absolute inset-0 block h-full w-full" />
      <div class="absolute inset-0 bg-grid opacity-[0.14] mix-blend-screen" />
      <div class="hero-spotlight absolute inset-0" />
      <div class="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
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
          {{ t('hero.available') }}
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
        {{ t('hero.intro') }}
      </p>

      <div class="mt-9 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row">
        <a
          href="#proyectos"
          class="group inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-accent px-6 py-3.5 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-black shadow-[0_0_0_0_rgba(0,229,255,0)] transition-all duration-300 hover:shadow-[0_0_28px_rgba(0,229,255,0.45)] active:scale-[0.98] sm:text-xs"
        >
          <Terminal :size="16" aria-hidden="true" />
          {{ t('hero.explore') }}
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
          {{ t('nav.downloadCv') }}
        </a>
      </div>

      <div class="mt-12 w-full max-w-2xl">
        <div
          class="mb-3 flex items-center justify-center gap-2 font-mono text-[9px] uppercase tracking-[0.22em] text-muted/60 sm:text-[10px]"
        >
          <Activity :size="12" class="text-cyan-accent/70" aria-hidden="true" />
          {{ t('hero.metrics') }}
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
        {{ t('hero.scroll') }}
        <ArrowRight :size="13" class="rotate-90" aria-hidden="true" />
      </a>
    </div>
  </section>
</template>

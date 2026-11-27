<script setup lang="ts">
import type { CSSProperties } from 'vue'

interface Snowflake {
  left: string
  top: string
  size: number
  duration: string
  delay: string
  opacity: number
}

// Fixed coordinates keep the prerendered HTML identical on every build and on
// every hydration; the animation only moves the flakes after first paint.
const SNOWFLAKES: readonly Snowflake[] = [
  { left: '4%', top: '8%', size: 10, duration: '14s', delay: '-2s', opacity: 0.5 },
  { left: '12%', top: '32%', size: 7, duration: '18s', delay: '-7s', opacity: 0.4 },
  { left: '19%', top: '14%', size: 12, duration: '16s', delay: '-11s', opacity: 0.55 },
  { left: '26%', top: '68%', size: 8, duration: '20s', delay: '-4s', opacity: 0.35 },
  { left: '33%', top: '42%', size: 10, duration: '15s', delay: '-9s', opacity: 0.5 },
  { left: '40%', top: '6%', size: 6, duration: '17s', delay: '-13s', opacity: 0.38 },
  { left: '47%', top: '78%', size: 11, duration: '19s', delay: '-1s', opacity: 0.52 },
  { left: '54%', top: '24%', size: 8, duration: '14s', delay: '-6s', opacity: 0.44 },
  { left: '61%', top: '56%', size: 9, duration: '21s', delay: '-15s', opacity: 0.42 },
  { left: '68%', top: '12%', size: 7, duration: '16s', delay: '-3s', opacity: 0.46 },
  { left: '75%', top: '84%', size: 12, duration: '18s', delay: '-10s', opacity: 0.5 },
  { left: '82%', top: '38%', size: 8, duration: '15s', delay: '-12s', opacity: 0.36 },
  { left: '88%', top: '18%', size: 10, duration: '20s', delay: '-5s', opacity: 0.48 },
  { left: '93%', top: '62%', size: 6, duration: '17s', delay: '-8s', opacity: 0.34 },
  { left: '8%', top: '88%', size: 9, duration: '19s', delay: '-14s', opacity: 0.4 },
  { left: '57%', top: '92%', size: 7, duration: '22s', delay: '-16s', opacity: 0.38 },
]

function flakeStyle(flake: Snowflake): CSSProperties {
  return {
    left: flake.left,
    top: flake.top,
    width: `${flake.size}px`,
    height: `${flake.size}px`,
    opacity: flake.opacity,
    '--flake-duration': flake.duration,
    '--flake-delay': flake.delay,
    '--flake-opacity': flake.opacity,
  } as CSSProperties
}
</script>

<template>
  <div
    class="christmas-decor fixed inset-0 z-0 overflow-hidden pointer-events-none select-none"
    aria-hidden="true"
  >
    <div v-for="(flake, index) in SNOWFLAKES" :key="index" class="xmas-flake absolute" :style="flakeStyle(flake)">
      <svg class="xmas-flake-svg block h-full w-full" viewBox="0 0 24 24" fill="none">
        <path class="xmas-flake-arm" d="M12 1v22M1 6.5l22 11M1 17.5l22-11" />
        <circle class="xmas-flake-core" cx="12" cy="12" r="2" />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.xmas-flake-svg {
  overflow: visible;
}

.xmas-flake-arm {
  stroke: currentColor;
  stroke-width: 1.2;
  stroke-linecap: round;
}

.xmas-flake-core {
  fill: var(--ech-accent);
}
</style>

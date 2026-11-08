<script setup lang="ts">
import { ArrowLeft } from '@lucide/vue'
</script>

<template>
  <section class="mx-auto flex min-h-[70vh] max-w-4xl flex-col items-start justify-center px-6 py-24">
    <p class="font-mono text-[11px] uppercase tracking-[0.24em] text-cyan-accent">
      // ERROR_404 // ROUTE_NOT_FOUND
    </p>
    <h1 class="mt-5 font-sans text-4xl font-bold tracking-tight text-white sm:text-6xl">
      Esta ruta no existe<span class="text-cyan-accent">.</span>
    </h1>
    <p class="mt-5 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
      El recurso solicitado no está registrado en el sistema. Vuelve al portafolio para explorar
      los casos de estudio disponibles.
    </p>
    <RouterLink
      to="/"
      class="mt-8 inline-flex items-center gap-2 rounded-lg bg-cyan-accent px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.14em] text-black transition-all hover:shadow-[0_0_20px_rgba(0,229,255,0.45)]"
    >
      <ArrowLeft :size="16" aria-hidden="true" />
      Volver al inicio
    </RouterLink>
  </section>
</template>

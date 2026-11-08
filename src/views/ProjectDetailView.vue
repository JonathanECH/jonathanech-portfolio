<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowLeft } from '@lucide/vue'
import ArchitectureModules from '@/components/detail/ArchitectureModules.vue'
import ChallengeAudit from '@/components/detail/ChallengeAudit.vue'
import ProjectGallery from '@/components/detail/ProjectGallery.vue'
import ProjectHeader from '@/components/detail/ProjectHeader.vue'
import ProjectPager from '@/components/detail/ProjectPager.vue'
import ProjectSpecs from '@/components/detail/ProjectSpecs.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import { usePortfolioData } from '@/composables/usePortfolioData'

const props = defineProps<{ slug: string }>()

const { getProjectBySlug, getProjectNeighbors } = usePortfolioData()

const project = computed(() => getProjectBySlug(props.slug))
const neighbors = computed(() => getProjectNeighbors(props.slug))

const galleryCode = '// 00. REGISTRO VISUAL & CAPTURAS DE INTERFAZ'

watchEffect(() => {
  if (project.value) {
    document.title = `${project.value.name} — Jonathan Campos`
  }
})
</script>

<template>
  <div v-if="project" class="relative">
    <ProjectHeader :project="project" />
    <ProjectSpecs :project="project" />

    <section
      class="mx-auto w-full max-w-7xl px-5 pb-14 sm:px-6 sm:pb-16 lg:px-12"
      aria-label="Capturas del sistema"
    >
      <SectionHeading
        :code="galleryCode"
        title="Capturas del"
        highlight="Sistema"
        description="Interfaces reales del flujo operativo: telemetría de almacén, conciliación transaccional y control de lotes en planta."
      />
      <div class="mt-8">
        <ProjectGallery :project="project" />
      </div>
    </section>

    <ChallengeAudit :project="project" />
    <ArchitectureModules :project="project" />
    <ProjectPager :previous="neighbors.previous" :next="neighbors.next" />
  </div>

  <section
    v-else
    class="mx-auto flex min-h-[70vh] w-full max-w-4xl flex-col items-start justify-center px-5 py-24 sm:px-6"
  >
    <p class="font-mono text-[11px] uppercase tracking-[0.24em] text-cyan-accent">
      // CASE_STUDY // NOT_FOUND
    </p>
    <h1 class="mt-5 font-sans text-4xl font-bold tracking-tight text-white sm:text-6xl">
      Caso de estudio no encontrado<span class="text-cyan-accent">.</span>
    </h1>
    <p class="mt-5 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
      El proyecto solicitado no está registrado en el sistema. Explora los casos de estudio
      disponibles desde el portafolio.
    </p>
    <RouterLink
      :to="{ path: '/', hash: '#proyectos' }"
      class="mt-8 inline-flex items-center gap-2 rounded-lg bg-cyan-accent px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.14em] text-black transition-all hover:shadow-[0_0_20px_rgba(0,229,255,0.45)]"
    >
      <ArrowLeft :size="16" aria-hidden="true" />
      Volver a proyectos
    </RouterLink>
  </section>
</template>

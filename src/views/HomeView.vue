<script setup lang="ts">
import { onBeforeUnmount } from 'vue'
import AboutSection from '@/components/home/AboutSection.vue'
import ContactSection from '@/components/home/ContactSection.vue'
import HeroSection from '@/components/home/HeroSection.vue'
import ProjectsShowcase from '@/components/home/ProjectsShowcase.vue'
import TechEcosystem from '@/components/home/TechEcosystem.vue'
import { usePortfolioStore } from '@/stores/portfolio'

const store = usePortfolioStore()

// The quick-view modal lives in the store; clear it when leaving Home so it
// does not reopen when the visitor navigates back from a case study.
onBeforeUnmount(() => {
  store.closeQuickView()
})
</script>

<template>
  <div class="relative">
    <HeroSection />
    <TechEcosystem />
    <ProjectsShowcase />
    <AboutSection />
    <ContactSection />
  </div>
</template>

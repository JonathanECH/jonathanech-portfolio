<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { Download, Menu, X } from '@lucide/vue'
import logoNavbar from '@/assets/logo-navbar.svg'
import { useActiveSection } from '@/composables/useActiveSection'
import { useScrollLock } from '@/composables/useScrollLock'
import { useScrolled } from '@/composables/useScrolled'
import { useI18n } from '@/i18n'

const route = useRoute()
const { t } = useI18n()
const { scrolled } = useScrolled()
const { activeSection } = useActiveSection(['inicio', 'stack', 'proyectos', 'sobre-mi', 'contacto'])
const mobileOpen = ref(false)

useScrollLock(mobileOpen)

const navLinks = computed(() => [
  { label: t('nav.home'), hash: '#inicio', section: 'inicio' },
  { label: t('nav.stack'), hash: '#stack', section: 'stack' },
  { label: t('nav.projects'), hash: '#proyectos', section: 'proyectos' },
  { label: t('nav.about'), hash: '#sobre-mi', section: 'sobre-mi' },
  { label: t('nav.contact'), hash: '#contacto', section: 'contacto' },
])

const isHome = computed(() => route.name === 'home')

const activeLink = computed(() => {
  if (!isHome.value) {
    return route.name === 'project-detail' ? 'proyectos' : ''
  }

  return activeSection.value
})

watch(
  () => route.fullPath,
  () => {
    mobileOpen.value = false
  },
)

function isActive(section: string): boolean {
  return activeLink.value === section
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && mobileOpen.value) {
    mobileOpen.value = false
  }
}

onMounted(() => document.addEventListener('keydown', handleKeydown))
onUnmounted(() => document.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 border-b transition-all duration-300"
    :class="
      scrolled || mobileOpen
        ? 'border-border bg-background/85 backdrop-blur-xl'
        : 'border-transparent bg-background/40 backdrop-blur-md'
    "
  >
    <div class="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-12">
      <RouterLink
        to="/"
        class="group relative flex items-center justify-center rounded-lg"
        :aria-label="t('nav.ariaHome')"
      >
        <span
          class="absolute inset-0 rounded-full bg-cyan-accent/20 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden="true"
        />
        <img
          :src="logoNavbar"
          alt=""
          class="relative h-10 w-10 transition-transform duration-300 group-hover:scale-105"
          width="40"
          height="40"
        />
      </RouterLink>

      <nav class="hidden items-center gap-7 lg:flex" :aria-label="t('nav.ariaPrimary')">
        <RouterLink
          v-for="link in navLinks"
          :key="link.section"
          :to="{ path: '/', hash: link.hash }"
          class="group relative flex items-center gap-1.5 py-2 font-mono text-[11px] tracking-[0.18em] transition-colors duration-200"
          :class="isActive(link.section) ? 'text-white' : 'text-muted hover:text-white'"
          :aria-current="isActive(link.section) ? 'page' : undefined"
        >
          <span
            class="h-1 w-1 rounded-full bg-cyan-accent transition-all duration-300"
            :class="isActive(link.section) ? 'opacity-100 shadow-[0_0_8px_#00E5FF]' : 'opacity-0'"
          />
          {{ link.label }}
          <span
            class="absolute -bottom-0.5 left-0 h-px bg-cyan-accent/60 transition-all duration-300"
            :class="isActive(link.section) ? 'w-full opacity-100' : 'w-0 opacity-0'"
          />
        </RouterLink>
      </nav>

      <div class="flex items-center gap-3">
        <a
          href="/cv/jonathan-campos-cv.pdf"
          download
          class="hidden items-center gap-1.5 rounded-lg bg-cyan-accent px-4 py-2 font-sans text-xs font-semibold text-black transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] sm:flex"
        >
          <Download :size="14" aria-hidden="true" />
          {{ t('nav.downloadCv') }}
        </a>

        <button
          type="button"
          class="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-white transition-colors hover:border-border-hover hover:text-cyan-accent lg:hidden"
          :aria-expanded="mobileOpen"
          aria-controls="mobile-navigation"
          :aria-label="mobileOpen ? t('nav.closeMenu') : t('nav.openMenu')"
          @click="mobileOpen = !mobileOpen"
        >
          <X v-if="mobileOpen" :size="18" aria-hidden="true" />
          <Menu v-else :size="18" aria-hidden="true" />
        </button>
      </div>
    </div>

    <Transition name="menu">
      <div
        v-if="mobileOpen"
        id="mobile-navigation"
        class="border-t border-border bg-background/95 px-5 pb-6 pt-4 backdrop-blur-xl lg:hidden"
      >
        <nav class="flex flex-col gap-1" :aria-label="t('nav.ariaMobile')">
          <RouterLink
            v-for="link in navLinks"
            :key="link.section"
            :to="{ path: '/', hash: link.hash }"
            class="flex items-center justify-between rounded-lg px-3 py-3 font-mono text-xs tracking-[0.18em] transition-colors"
            :class="isActive(link.section) ? 'bg-cyan-accent/10 text-cyan-accent' : 'text-muted hover:bg-surface-card hover:text-white'"
            :aria-current="isActive(link.section) ? 'page' : undefined"
          >
            {{ link.label }}
            <span class="font-mono text-[10px] text-muted/60">{{ link.hash }}</span>
          </RouterLink>
        </nav>

        <a
          href="/cv/jonathan-campos-cv.pdf"
          download
          class="mt-4 flex items-center justify-center gap-2 rounded-lg bg-cyan-accent px-4 py-3 font-sans text-xs font-semibold text-black"
        >
          <Download :size="15" aria-hidden="true" />
          {{ t('nav.downloadCv') }}
        </a>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.menu-enter-active,
.menu-leave-active {
  transition:
    opacity 180ms ease,
    transform 180ms ease;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>

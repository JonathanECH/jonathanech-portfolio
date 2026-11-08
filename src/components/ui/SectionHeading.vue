<script setup lang="ts">
withDefaults(
  defineProps<{
    code?: string
    title: string
    highlight?: string
    description?: string
    align?: 'left' | 'center'
  }>(),
  {
    code: undefined,
    highlight: undefined,
    description: undefined,
    align: 'left',
  },
)
</script>

<template>
  <div :class="align === 'center' ? 'mx-auto text-center' : ''">
    <p
      v-if="code"
      class="font-mono text-[10px] uppercase tracking-[0.24em] text-cyan-accent/75 sm:text-[11px]"
    >
      {{ code }}
    </p>
    <h2
      class="mt-3 max-w-3xl font-sans text-3xl font-bold tracking-[-0.03em] text-foreground sm:text-4xl"
      :class="align === 'center' ? 'mx-auto' : ''"
    >
      {{ title }}
      <span v-if="highlight" class="text-cyan-accent">{{ highlight }}</span>
    </h2>
    <p
      v-if="description"
      class="mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:text-[15px]"
      :class="align === 'center' ? 'mx-auto' : ''"
    >
      {{ description }}
    </p>
  </div>
</template>

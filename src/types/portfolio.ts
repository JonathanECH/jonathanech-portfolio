export type TechCategory = 'frontend' | 'backend' | 'database' | 'devops'

export type TechFilter = 'all' | TechCategory

export type TechIconKey =
  | 'vue'
  | 'typescript'
  | 'tailwind'
  | 'pinia'
  | 'angular'
  | 'html'
  | 'css'
  | 'javascript'
  | 'node'
  | 'express'
  | 'nestjs'
  | 'go'
  | 'php'
  | 'c'
  | 'csharp'
  | 'postgresql'
  | 'prisma'
  | 'docker'
  | 'git'
  | 'pnpm'
  | 'postman'
  | 'vercel'
  | 'netlify'

export type MockupVariant =
  | 'inventory'
  | 'ledger'
  | 'batches'
  | 'medical'
  | 'erp'
  | 'analytics'

export type ModuleIcon = 'reactivity' | 'state' | 'database'

export interface Technology {
  readonly id: string
  readonly name: string
  readonly category: TechCategory
  readonly label: string
  readonly specialties: readonly string[]
  readonly iconKey: TechIconKey
  readonly brandColor: string
}

export interface GallerySlide {
  readonly id: string
  readonly title: string
  readonly caption: string
  readonly path: string
  readonly variant: MockupVariant
  readonly badges: readonly string[]
  readonly image?: string
  readonly alt?: string
}

export interface AuditReport {
  readonly diagnosis: string
  readonly resolution: string
  readonly latencyBefore: string
  readonly latencyAfter: string
  readonly latencyDelta: string
  readonly discrepancy: string
  readonly consistencyNote: string
}

export interface ProjectChallenge {
  readonly intro: string
  readonly findings: readonly string[]
}

export interface ArchitectureModule {
  readonly code: string
  readonly title: string
  readonly subtitle: string
  readonly description: string
  readonly points: readonly string[]
  readonly icon: ModuleIcon
}

export interface ProjectLinks {
  readonly demo?: string
  readonly repo?: string
  readonly whitepaper?: string
}

export interface Project {
  readonly slug: string
  readonly name: string
  readonly sector: string
  readonly title: string
  readonly titleHighlight: string
  readonly year: string
  readonly status: string
  readonly summary: string
  readonly problem: string
  readonly techTags: readonly string[]
  readonly role: string
  readonly client: string
  readonly duration: string
  readonly stackKey: string
  readonly links: ProjectLinks
  readonly liveHost: string
  readonly accent: string
  readonly galleryDescription: string
  readonly gallery: readonly GallerySlide[]
  readonly challenge: ProjectChallenge
  readonly audit: AuditReport
  readonly modules: readonly ArchitectureModule[]
}

export interface TechFilterOption {
  readonly value: TechFilter
  readonly label: string
}

export interface ProfileStat {
  readonly label: string
  readonly value: string
}

export interface PerformanceMetric {
  readonly label: string
  readonly value: number
}

export interface EnvironmentItem {
  readonly label: string
  readonly value: string
}

export interface Profile {
  readonly name: string
  readonly role: string
  readonly headline: readonly [string, string]
  readonly location: string
  readonly education: string
  readonly bio: string
  readonly philosophyPath: string
  readonly stats: readonly ProfileStat[]
  readonly performance: readonly PerformanceMetric[]
  readonly environment: readonly EnvironmentItem[]
}

export type ContactIcon = 'mail' | 'github' | 'linkedin' | 'whatsapp'

export interface ContactChannel {
  readonly id: string
  readonly label: string
  readonly value: string
  readonly href: string
  readonly description: string
  readonly icon: ContactIcon
  readonly actionLabel: string
  readonly copyValue?: string
  readonly external?: boolean
}

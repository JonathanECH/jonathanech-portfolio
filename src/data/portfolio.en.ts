import { technologies } from '@/data/portfolio'
import type {
  ContactChannel,
  PortfolioContent,
  Profile,
  Project,
  TechFilterOption,
} from '@/types/portfolio'

const techFilterOptions: readonly TechFilterOption[] = [
  { value: 'all', label: 'ALL' },
  { value: 'frontend', label: 'FRONTEND' },
  { value: 'backend', label: 'BACKEND & RUNTIMES' },
  { value: 'database', label: 'DATABASES & ORM' },
  { value: 'devops', label: 'DEVOPS & TOOLS' },
]

const projects: readonly Project[] = [
  {
    slug: 'tilyshop-inventory',
    name: 'TilyShop Inventory',
    sector: 'STOCK AUDIT',
    title: 'TILYSHOP',
    titleHighlight: 'INVENTORY',
    year: '2026',
    status: 'IN PRODUCTION',
    summary:
      'End-to-end redesign of the B2B textile inventory: atomic batch traceability, transactional auditing and an offline-first reactive layer for warehouse operations.',
    problem:
      'The previous system reconciled stock through manual processes and non-atomic writes: duplicated batches, silent mismatches and critical queries taking up to 4,820 ms.',
    techTags: ['Vue 3', 'TypeScript', 'Pinia', 'PostgreSQL', 'Tailwind CSS'],
    role: 'Frontend Architect & Business Logic Auditor',
    client: 'Textile & Apparel B2B Industry',
    duration: '12 Weeks // Q1-Q2 2026',
    stackKey: 'Vue 3 • TypeScript • PostgreSQL',
    links: {
      demo: 'https://tilyshop-inventory.demo',
      repo: 'https://github.com/jonathanech/tilyshop-inventory',
      whitepaper: '/docs/tilyshop-whitepaper.pdf',
    },
    liveHost: 'tilyshop-inventory.live',
    accent: '#00E5FF',
    galleryDescription:
      'Real interfaces from the operational flow: warehouse telemetry, transactional reconciliation and plant batch control.',
    gallery: [
      {
        id: 'telemetry',
        title: 'Overview Panel & Telemetry',
        caption: 'Stock monitor, plant flow and replenishment alerts in real time.',
        path: 'telemetry-view',
        variant: 'inventory',
        badges: ['Central Warehouse', 'Batch Audit', 'Dispatch'],
      },
      {
        id: 'ledger',
        title: 'Reconciliation & Transactional Audit',
        caption:
          'Double entry, batch traceability and ACID consistency over the immutable ledger.',
        path: 'ledger-audit',
        variant: 'ledger',
        badges: ['Immutable Ledger', 'ACID Consistency', 'Zero-Lag Sync'],
      },
      {
        id: 'batches',
        title: 'Warehouse Telemetry',
        caption:
          'Continuous diagnostics of RF terminals, scanner hub and per-batch latency control.',
        path: 'telemetry-view',
        variant: 'batches',
        badges: ['RF Terminals', 'Scanner Hub', 'Concurrency'],
      },
    ],
    challenge: {
      intro:
        'Before the redesign, inventory aggregated stock by reference and ignored granularity by size, color and batch. Each terminal wrote independently to the same row, with no optimistic locking and no single source of truth.',
      findings: [
        'Stock aggregated by reference: without granularity by size, color or batch, physical and digital inventory diverged silently.',
        'Non-atomic writes: two terminals could sell the same unit and overwrite stock without locking or reconciliation.',
        'N+1 reads and missing composite indexes: the telemetry panel took up to 4,820 ms to respond.',
      ],
    },
    audit: {
      diagnosis:
        'The previous inventory reconciled stock through manual processes and non-atomic writes. Batches were grouped by reference, without size granularity, and concurrent operations overwrote stock without optimistic locking.',
      resolution:
        'The data model was redesigned with atomic batches per SKU and size, an immutable transactional ledger and an offline-first reactive layer with optimistic locks. Critical queries were indexed and N+1 reads were eliminated.',
      latencyBefore: '4,820 ms',
      latencyAfter: '42 ms',
      latencyDelta: '−99.1%',
      discrepancy: '0.00%',
      consistencyNote: 'ACID reconciliation verified across 8,412 audit transactions.',
    },
    modules: [
      {
        code: 'MOD-A',
        title: 'Reactivity',
        subtitle: 'Reactive Layer with Vue 3 & Composition API',
        description:
          'Decoupled components, derived state and surgical watchers for live telemetry without unnecessary re-renders.',
        points: [
          'Domain-typed composables',
          'Derived state without duplication',
          'Lazy views with Suspense',
        ],
        icon: 'reactivity',
      },
      {
        code: 'MOD-B',
        title: 'Global State',
        subtitle: 'Predictable State Management with Pinia',
        description:
          'Domain stores with offline-first persistence and optimistic locks for concurrent warehouse operations.',
        points: [
          'Offline-first with sync queue',
          'Optimistic locks per SKU and batch',
          'Devtools and action traceability',
        ],
        icon: 'state',
      },
      {
        code: 'MOD-C',
        title: 'Persistence',
        subtitle: 'Transactional Integrity & Database',
        description:
          'PostgreSQL in strict ACID mode, versioned migrations and constraints that make silent mismatches impossible.',
        points: [
          'ACID transactions per movement',
          'Composite indexes and query tuning',
          'Reproducible migrations and seeds',
        ],
        icon: 'database',
      },
    ],
  },
  {
    slug: 'gestion-medica',
    name: 'Medical Management System',
    sector: 'HEALTHCARE SPA',
    title: 'MEDICAL',
    titleHighlight: 'MANAGEMENT SYSTEM',
    year: '2025',
    status: 'IN PRODUCTION',
    summary:
      'Clinical SPA for scheduling, records and triage: frictionless care flows, reactive state and an accessible interface for medical staff.',
    problem:
      'The clinic operated with parallel schedules and paper records; appointments were duplicated and staff lost minutes per patient on repetitive tasks.',
    techTags: ['Vue 3', 'TypeScript', 'Supabase', 'Tailwind CSS'],
    role: 'Full Stack Developer & Interaction Designer',
    client: 'Private Clinic Network',
    duration: '16 Weeks // Q3-Q4 2025',
    stackKey: 'Vue 3 • TypeScript • Supabase',
    links: {
      demo: 'https://medicore-clinic.demo',
      repo: 'https://github.com/jonathanech/gestion-medica',
    },
    liveHost: 'medicore-clinic.live',
    accent: '#5EEAD4',
    galleryDescription:
      'Real interfaces from the clinical flow: consultation scheduling, unified records and occupancy telemetry.',
    gallery: [
      {
        id: 'agenda',
        title: 'Clinical Schedule',
        caption:
          'Daily view of appointments, triage and occupancy per consultation room with live updates.',
        path: 'agenda-view',
        variant: 'medical',
        badges: ['Schedule', 'Triage', 'Real Time'],
      },
      {
        id: 'record',
        title: 'Patient Record',
        caption:
          'Unified history, vital signs and medical notes with role-based access control.',
        path: 'patient-record',
        variant: 'medical',
        badges: ['Record', 'Role Access', 'Audit'],
      },
      {
        id: 'analytics',
        title: 'Occupancy Telemetry',
        caption: 'Demand metrics, wait times and installed capacity by specialty.',
        path: 'analytics-view',
        variant: 'analytics',
        badges: ['Occupancy', 'SLA', 'Analytics'],
      },
    ],
    challenge: {
      intro:
        "Scheduling, triage and records lived in separate systems. Staff duplicated data between spreadsheets and paper, and there was no reliable view of the clinic's real occupancy.",
      findings: [
        'Duplicate appointments from parallel schedules without a single source of truth.',
        'Paper records without traceability or role-based access control.',
        'Invisible wait times: the clinic could not measure or prioritize demand.',
      ],
    },
    audit: {
      diagnosis:
        'The clinical flow depended on isolated schedules and manual records. Patient information was copied several times and triage decisions were made without occupancy telemetry.',
      resolution:
        'The clinical domain was unified into an SPA with reactive scheduling, a single patient record and role-based access policies. Supabase provided Row Level Security and realtime to sync consultation rooms without polling.',
      latencyBefore: '3,240 ms',
      latencyAfter: '58 ms',
      latencyDelta: '−98.2%',
      discrepancy: '0.02%',
      consistencyNote: 'Access traceability verified across 2,140 audited records.',
    },
    modules: [
      {
        code: 'MOD-A',
        title: 'Reactivity',
        subtitle: 'Reactive Clinical Flows',
        description:
          'Schedule and triage views that react to state changes without reloading the consultation session.',
        points: [
          'Schedule and triage composables',
          'Derived state per consultation room',
          'Optimistic appointment updates',
        ],
        icon: 'reactivity',
      },
      {
        code: 'MOD-B',
        title: 'Global State',
        subtitle: 'Real-Time Schedule Synchronization',
        description:
          'Session, patient and occupancy stores with realtime channels and version-based conflict resolution.',
        points: [
          'Persistent clinical session',
          'Realtime per consultation room',
          'Version-based conflict resolution',
        ],
        icon: 'state',
      },
      {
        code: 'MOD-C',
        title: 'Persistence',
        subtitle: 'Records with Row Level Security',
        description:
          'Row-level access policies and immutable auditing of every clinical read or write.',
        points: ['RLS by role and specialty', 'Access auditing', 'Backups and versioned migrations'],
        icon: 'database',
      },
    ],
  },
  {
    slug: 'erp-contable',
    name: 'Web Accounting ERP',
    sector: 'TRANSACTIONAL ERP',
    title: 'ACCOUNTING ERP',
    titleHighlight: 'WEB',
    year: '2025',
    status: 'CASE STUDY',
    summary:
      'Full-stack accounting platform with double-entry bookkeeping, bank reconciliation and reproducible financial reports on a transactional database.',
    problem:
      'Accounting close depended on disconnected spreadsheets; entries were duplicated and monthly reconciliation consumed days of manual work.',
    techTags: ['Vue 3', 'Node.js', 'PostgreSQL', 'Docker'],
    role: 'Frontend Architect & Accounting Domain Integrator',
    client: 'Accounting Services Firm',
    duration: '20 Weeks // Q1-Q2 2025',
    stackKey: 'Vue 3 • Node.js • PostgreSQL',
    links: {
      demo: 'https://erp-contable.demo',
      repo: 'https://github.com/jonathanech/erp-contable',
    },
    liveHost: 'erp-contable.live',
    accent: '#A78BFA',
    galleryDescription:
      'Real interfaces from the accounting close: double-entry general ledger, financial consolidation and integrity telemetry.',
    gallery: [
      {
        id: 'ledger',
        title: 'General Ledger',
        caption: 'Double-entry journal entries with validation, traceability and cost center.',
        path: 'ledger-view',
        variant: 'ledger',
        badges: ['Double Entry', 'Ledger', 'ACID'],
      },
      {
        id: 'financial',
        title: 'Financial Consolidation',
        caption: 'Income statement, cash flow and bank reconciliation in a single view.',
        path: 'financial-view',
        variant: 'erp',
        badges: ['Reconciliation', 'Cash Flow', 'Close'],
      },
      {
        id: 'audit',
        title: 'Accounting Telemetry',
        caption: 'Latency, integrity and transactional volume control for the monthly close.',
        path: 'audit-view',
        variant: 'analytics',
        badges: ['Latency', 'Integrity', 'Audit'],
      },
    ],
    challenge: {
      intro:
        'The accounting close was assembled from spreadsheets that nobody versioned. Entries were duplicated across departments and bank reconciliation was done by hand, without a reliable audit trail.',
      findings: [
        'Duplicate entries from manual imports without idempotency.',
        'Artisanal bank reconciliation: days of work and carry-over errors.',
        'Non-reproducible reports: every close depended on whoever assembled it.',
      ],
    },
    audit: {
      diagnosis:
        'The firm operated with a fragmented accounting model: spreadsheets, manual imports and ad hoc reports. There was no idempotency or common audit trail between banks and the general ledger.',
      resolution:
        'A double-entry ledger with hash-based idempotency, assisted reconciliation and reports generated from the same transactional source was implemented. Docker guarantees parity between close and production environments.',
      latencyBefore: '2,980 ms',
      latencyAfter: '64 ms',
      latencyDelta: '−97.9%',
      discrepancy: '0.00%',
      consistencyNote: 'Monthly close reproduced across 3 environments with transactional parity.',
    },
    modules: [
      {
        code: 'MOD-A',
        title: 'Reactivity',
        subtitle: 'Reactive Accounting Interface',
        description:
          'Dashboards and entries recalculated derivatively, without manual DOM mutations.',
        points: [
          'Entry and report composables',
          'Derived and memoized calculations',
          'Inline editing with validation',
        ],
        icon: 'reactivity',
      },
      {
        code: 'MOD-B',
        title: 'Global State',
        subtitle: 'Predictable State for Entries',
        description:
          'Period, draft and reconciliation stores with action history and optimistic locking.',
        points: [
          'Persistent drafts per period',
          'Optimistic locks per entry',
          'Auditable action history',
        ],
        icon: 'state',
      },
      {
        code: 'MOD-C',
        title: 'Persistence',
        subtitle: 'Double Entry & ACID Integrity',
        description:
          'PostgreSQL with balance constraints, hash idempotency and reproducible migrations.',
        points: [
          'Debit = credit constraints',
          'Idempotency by import hash',
          'Environment parity with Docker',
        ],
        icon: 'database',
      },
    ],
  },
]

const profile: Profile = {
  name: 'Jonathan Campos',
  role: 'Frontend Web Developer',
  headline: ['FRONTEND WEB DEVELOPER', 'SOFTWARE ARCHITECT'],
  location: 'Barquisimeto, Venezuela',
  education: 'Computer Science (TSU)',
  bio: 'I am a Computer Science student (TSU) based in Barquisimeto, Venezuela. I combine modern interfaces with strict business-logic evaluation: I audit bottlenecks, prevent logistics errors in databases and design systems that do not fail silently. Outside code, I optimize Linux environments and calibrate espresso extraction variables.',
  philosophyPath: '~/profile/philosophy.md',
  stats: [
    { label: 'AUDIT', value: 'TECHNICAL' },
    { label: 'STACK', value: 'VUE 3 + TS' },
    { label: 'BASE', value: 'BARQUISIMETO, VE' },
  ],
  performance: [
    { label: 'PERFORMANCE', value: 98 },
    { label: 'ACCESSIBILITY', value: 100 },
    { label: 'BEST PRACTICES', value: 100 },
    { label: 'SEO', value: 100 },
  ],
  environment: [
    { label: 'OS', value: 'Linux custom kernel' },
    { label: 'EDITOR', value: 'VS Code + Vim' },
    { label: 'DESIGN', value: 'Figma / Penpot' },
    { label: 'RUNTIME', value: 'Node 24 + pnpm' },
    { label: 'COFFEE', value: 'Espresso calibration lab' },
  ],
}

const contactChannels: readonly ContactChannel[] = [
  {
    id: 'email',
    label: 'DIRECT EMAIL',
    value: 'jonathancamposbusiness@gmail.com',
    href: 'mailto:jonathancamposbusiness@gmail.com',
    description: 'Reply within 24 hours.',
    icon: 'mail',
    actionLabel: 'Send email',
    copyValue: 'jonathancamposbusiness@gmail.com',
  },
  {
    id: 'github',
    label: 'CODEBASE',
    value: 'github.com/jonathanech',
    href: 'https://github.com/jonathanech',
    description: 'Repositories, experiments and open source.',
    icon: 'github',
    actionLabel: 'GitHub Profile',
    external: true,
  },
  {
    id: 'linkedin',
    label: 'NETWORK',
    value: 'linkedin.com/in/jonathanech',
    href: 'https://linkedin.com/in/jonathanech',
    description: 'Career, collaborations and professional contact.',
    icon: 'linkedin',
    actionLabel: 'LinkedIn Sync',
    external: true,
  },
  {
    id: 'whatsapp',
    label: 'INSTANT WIRE',
    value: '+58 4121966931',
    href: 'https://wa.me/584121966931',
    description: 'Instant communication for opportunities.',
    icon: 'whatsapp',
    actionLabel: 'WhatsApp Direct Pulse',
    external: true,
  },
]

export const enContent: PortfolioContent = {
  technologies,
  techFilterOptions,
  projects,
  profile,
  contactChannels,
}

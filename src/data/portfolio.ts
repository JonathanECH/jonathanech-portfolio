import type {
  ContactChannel,
  Profile,
  Project,
  TechFilterOption,
  Technology,
} from '@/types/portfolio'

export const technologies: readonly Technology[] = [
  {
    id: 'vue',
    name: 'Vue 3',
    category: 'frontend',
    label: 'FRAMEWORK',
    specialties: ['Composition API', 'Pinia'],
    iconKey: 'vue',
    brandColor: '#41B883',
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'frontend',
    label: 'LANGUAGE',
    specialties: ['Strict Typing', 'Generics'],
    iconKey: 'typescript',
    brandColor: '#3178C6',
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    category: 'frontend',
    label: 'STYLING ENGINE',
    specialties: ['Design Tokens', 'Utility-First'],
    iconKey: 'tailwind',
    brandColor: '#38BDF8',
  },
  {
    id: 'pinia',
    name: 'Pinia',
    category: 'frontend',
    label: 'STATE LAYER',
    specialties: ['Offline-First', 'Optimistic Locks'],
    iconKey: 'pinia',
    brandColor: '#FFD859',
  },
  {
    id: 'angular',
    name: 'Angular',
    category: 'frontend',
    label: 'FRAMEWORK',
    specialties: ['RxJS', 'Modularity'],
    iconKey: 'angular',
    brandColor: '#DD0031',
  },
  {
    id: 'html',
    name: 'HTML5',
    category: 'frontend',
    label: 'MARKUP',
    specialties: ['Semantics', 'Accessibility'],
    iconKey: 'html',
    brandColor: '#E34F26',
  },
  {
    id: 'css',
    name: 'CSS3',
    category: 'frontend',
    label: 'STYLING',
    specialties: ['Grid', 'Animations'],
    iconKey: 'css',
    brandColor: '#663399',
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    category: 'frontend',
    label: 'LANGUAGE',
    specialties: ['ES2024', 'Async/Await'],
    iconKey: 'javascript',
    brandColor: '#F7DF1E',
  },
  {
    id: 'node',
    name: 'Node.js',
    category: 'backend',
    label: 'RUNTIME',
    specialties: ['Async I/O', 'REST APIs'],
    iconKey: 'node',
    brandColor: '#5FA04E',
  },
  {
    id: 'express',
    name: 'Express',
    category: 'backend',
    label: 'FRAMEWORK',
    specialties: ['Middleware', 'Routing'],
    iconKey: 'express',
    brandColor: '#E5E7EB',
  },
  {
    id: 'nestjs',
    name: 'NestJS',
    category: 'backend',
    label: 'FRAMEWORK',
    specialties: ['DI Container', 'Modular Arch'],
    iconKey: 'nestjs',
    brandColor: '#E0234E',
  },
  {
    id: 'go',
    name: 'Go',
    category: 'backend',
    label: 'LANGUAGE',
    specialties: ['Goroutines', 'Channels'],
    iconKey: 'go',
    brandColor: '#00ADD8',
  },
  {
    id: 'php',
    name: 'PHP',
    category: 'backend',
    label: 'LANGUAGE',
    specialties: ['PSR Standards', 'Composer'],
    iconKey: 'php',
    brandColor: '#777BB4',
  },
  {
    id: 'c',
    name: 'C',
    category: 'backend',
    label: 'LANGUAGE',
    specialties: ['Memory Control', 'Pointers'],
    iconKey: 'c',
    brandColor: '#A8B9CC',
  },
  {
    id: 'csharp',
    name: 'C#',
    category: 'backend',
    label: 'LANGUAGE',
    specialties: ['.NET', 'LINQ'],
    iconKey: 'csharp',
    brandColor: '#512BD4',
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    category: 'database',
    label: 'DATABASE',
    specialties: ['ACID', 'Query Tuning'],
    iconKey: 'postgresql',
    brandColor: '#4169E1',
  },
  {
    id: 'prisma',
    name: 'Prisma ORM',
    category: 'database',
    label: 'ORM',
    specialties: ['Type-Safe Client', 'Migrations'],
    iconKey: 'prisma',
    brandColor: '#C9D1E3',
  },
  {
    id: 'docker',
    name: 'Docker',
    category: 'devops',
    label: 'CONTAINERS',
    specialties: ['Multi-stage Builds', 'Compose'],
    iconKey: 'docker',
    brandColor: '#2496ED',
  },
  {
    id: 'git',
    name: 'Git',
    category: 'devops',
    label: 'VERSION CONTROL',
    specialties: ['Trunk-Based', 'Code Review'],
    iconKey: 'git',
    brandColor: '#F05032',
  },
  {
    id: 'pnpm',
    name: 'pnpm',
    category: 'devops',
    label: 'PACKAGE MANAGER',
    specialties: ['Workspaces', 'Strict Deps'],
    iconKey: 'pnpm',
    brandColor: '#F69220',
  },
  {
    id: 'postman',
    name: 'Postman',
    category: 'devops',
    label: 'API TESTING',
    specialties: ['Collections', 'Mock Servers'],
    iconKey: 'postman',
    brandColor: '#FF6C37',
  },
  {
    id: 'vercel',
    name: 'Vercel',
    category: 'devops',
    label: 'DEPLOYMENT',
    specialties: ['Edge Network', 'Preview Deploys'],
    iconKey: 'vercel',
    brandColor: '#FFFFFF',
  },
  {
    id: 'netlify',
    name: 'Netlify',
    category: 'devops',
    label: 'DEPLOYMENT',
    specialties: ['CI/CD', 'Serverless'],
    iconKey: 'netlify',
    brandColor: '#00C7B7',
  },
]

export const techFilterOptions: readonly TechFilterOption[] = [
  { value: 'all', label: 'TODAS // ALL' },
  { value: 'frontend', label: 'FRONTEND' },
  { value: 'backend', label: 'BACKEND & RUNTIMES' },
  { value: 'database', label: 'DATABASES & ORM' },
  { value: 'devops', label: 'DEVOPS & TOOLS' },
]

export const projects: readonly Project[] = [
  {
    slug: 'tilyshop-inventory',
    name: 'TilyShop Inventory',
    sector: 'STOCK AUDIT',
    title: 'TILYSHOP',
    titleHighlight: 'INVENTORY',
    year: '2026',
    status: 'EN PRODUCCIÓN',
    summary:
      'Sistema de inventario offline-first para puntos de venta: cálculo de stock efectivo en cliente, trazabilidad atómica de lotes y sincronización transaccional.',
    problem:
      'Puntos de venta con conectividad inestable y riesgo de sobreventa por terminales concurrentes. El sistema previo no garantizaba atomicidad ni auditoría de ajustes.',
    techTags: ['Vue 3', 'TypeScript', 'Node.js', 'PostgreSQL', 'Pinia', 'Tailwind CSS'],
    role: 'Desarrollador Full-Stack (Frontend, Backend & Base de Datos)',
    client: 'Confecciones TilyShop',
    duration: '6 Semanas // Octubre 2026 – Noviembre 2026',
    stackKey: 'Vue 3 • Node.js • PostgreSQL',
    links: {
      whitepaper: '/docs/tilyshop-whitepaper.pdf',
    },
    liveHost: 'app.tilyshop.internal',
    accent: '#00E5FF',
    galleryDescription:
      'Interfaces reales del flujo operativo: panel general, administración de inventario, historial de ventas y seguridad del perfil.',
    gallery: [
      {
        id: 'dashboard',
        title: 'Panel General & Ventas',
        caption:
          'Resumen de unidades, pendientes por surtir y registro rápido de ventas desde una sola vista.',
        path: 'dashboard',
        variant: 'inventory',
        badges: ['Resumen Operativo', 'Registro de Ventas', 'Stock'],
        image: '/projects/tilyshop-inventory/dashboard-tilyshop-inventory.webp',
        alt: 'Panel general de TilyShop con métricas de unidades, pendientes y registro de venta',
      },
      {
        id: 'admin',
        title: 'Administración de Inventario',
        caption:
          'Catálogo con filtros por institución, nombre, color y talla; edición y borrado por producto.',
        path: 'admin/inventario',
        variant: 'inventory',
        badges: ['Catálogo', 'Filtros', 'Tallas'],
        image: '/projects/tilyshop-inventory/admin-tilyshop-inventory.webp',
        alt: 'Tabla de administración de inventario con filtros por institución, color y talla',
      },
      {
        id: 'sales',
        title: 'Registro & Historial de Ventas',
        caption:
          'Filtros por rango de fechas, prenda y vendedor, con totales de unidades e ingresos.',
        path: 'ventas',
        variant: 'analytics',
        badges: ['Ventas', 'Filtros', 'Totales'],
        image: '/projects/tilyshop-inventory/ventas-tilyshop-inventory.webp',
        alt: 'Historial de ventas con filtros por fecha, prenda y vendedor',
      },
      {
        id: 'profile',
        title: 'Perfil & Seguridad',
        caption: 'Gestión de credenciales y cambio de contraseña con validación en el cliente.',
        path: 'perfil',
        variant: 'inventory',
        badges: ['Perfil', 'Seguridad', 'Credenciales'],
        image: '/projects/tilyshop-inventory/perfil-tilyshop-inventory.webp',
        alt: 'Pantalla de perfil con formulario de cambio de contraseña',
      },
    ],
    challenge: {
      intro:
        'Antes del rediseño, el inventario agregaba existencias por referencia e ignoraba la granularidad por talla, color y lote. Cada terminal escribía de forma independiente sobre la misma fila, sin bloqueo optimista ni una fuente única de verdad.',
      findings: [
        'Stock agregado por referencia: sin granularidad por talla, color o lote, el inventario físico y el digital divergían de forma silenciosa.',
        'Escrituras no atómicas: dos terminales podían vender la misma unidad y sobrescribir existencias sin bloqueo ni reconciliación.',
        'Lecturas N+1 y ausencia de índices compuestos: el panel de telemetría tardaba hasta 4,820 ms en responder.',
      ],
    },
    audit: {
      diagnosis:
        'El inventario previo conciliaba stock mediante procesos manuales y escrituras no atómicas. Los lotes se agrupaban por referencia, sin granularidad por talla, y las operaciones concurrentes sobrescribían existencias sin bloqueo optimista.',
      resolution:
        'Se rediseñó el modelo de datos con lotes atómicos por SKU y talla, se introdujo un ledger transaccional inmutable y una capa reactiva offline-first con locks optimistas. Las consultas críticas se indexaron y se eliminaron las lecturas N+1.',
      badge: 'ARQUITECTURA VERIFICADA',
      metrics: [
        {
          label: 'INTEGRIDAD DE STOCK',
          value: '0.00% Descuadre',
          detail: 'Ledger transaccional inmutable',
        },
        {
          label: 'CONCURRENCIA POS',
          value: 'Locks Optimistas',
          detail: 'Idempotencia por client_txn_id',
        },
        {
          label: 'PERSISTENCIA',
          value: 'PostgreSQL ACID',
          detail: 'Consultas indexadas sin N+1',
        },
      ],
      consistencyNote:
        'Sincronización idempotente con client_txn_id y transacciones atómicas validadas localmente y documentadas en el whitepaper técnico del repositorio.',
    },
    modules: [
      {
        code: 'MOD-A',
        title: 'Reactividad',
        subtitle: 'Capa Reactiva con Vue 3 & Composition API',
        description:
          'Componentes desacoplados, estado derivado y watchers quirúrgicos para telemetría en vivo sin re-renderizados innecesarios.',
        points: [
          'Composables tipados por dominio',
          'Estado derivado sin duplicación',
          'Vistas lazy con Suspense',
        ],
        icon: 'reactivity',
      },
      {
        code: 'MOD-B',
        title: 'Estado Global',
        subtitle: 'Gestión de Estado Predictible con Pinia',
        description:
          'Stores por dominio con persistencia offline-first y locks optimistas para operaciones concurrentes de almacén.',
        points: [
          'Offline-first con cola de sincronización',
          'Optimistic locks por SKU y lote',
          'Devtools y trazabilidad de acciones',
        ],
        icon: 'state',
      },
      {
        code: 'MOD-C',
        title: 'Persistencia',
        subtitle: 'Integridad Transaccional & Base de Datos',
        description:
          'PostgreSQL en modo ACID estricto, migraciones versionadas y constraints que hacen imposible el descuadre silencioso.',
        points: [
          'Transacciones ACID por movimiento',
          'Índices compuestos y query tuning',
          'Migraciones y seeds reproducibles',
        ],
        icon: 'database',
      },
    ],
  },
  {
    slug: 'gestion-medica',
    name: 'Clínica Razetti',
    sector: 'HOSPITAL MANAGEMENT',
    title: 'CLÍNICA',
    titleHighlight: 'RAZETTI',
    year: '2026',
    status: 'CASO DE ESTUDIO',
    summary:
      'Aplicación hospitalaria full-stack para administración de pacientes, especialistas, agendas clínicas y reportes: reactividad con Signals en Angular 19, blindaje RBAC y exportación de expedientes en PDF.',
    problem:
      'Gestión fragmentada entre agendas paralelas y registros manuales; riesgo de vulnerabilidades IDOR en datos clínicos y necesidad de blindaje estricto por roles y auditoría médica.',
    techTags: ['Angular 19', 'TypeScript', 'Node.js', 'PostgreSQL', 'SCSS'],
    role: 'Desarrollador Frontend & Arquitectura UI (Signals)',
    client: 'Gestión Hospitalaria / Clínica Razetti',
    duration: '8 Semanas // 2 de abril 2026 – 28 de mayo 2026',
    stackKey: 'Angular • TypeScript • PostgreSQL',
    links: {
      repo: 'https://github.com/JonathanECH',
    },
    liveHost: 'razetti.hospital',
    accent: '#5EEAD4',
    galleryDescription:
      'Interfaces reales del flujo hospitalario: panel general, gestión de especialistas y horarios, registro dinámico de pacientes, hub de reportes clínicos y autenticación segura.',
    gallery: [
      {
        id: 'dashboard',
        title: 'Panel de Administración',
        caption:
          'Vista central con métricas hospitalarias, navegación modular y monitoreo de actividad clínica.',
        path: 'dashboard',
        variant: 'medical',
        badges: ['Panel Central', 'Métricas', 'Gestión'],
        image: '/projects/clinica-razetti/dashboard-clinica-razetti.webp',
        alt: 'Panel de administración de Clínica Razetti con estadísticas y módulos hospitalarios',
      },
      {
        id: 'pacientes',
        title: 'Registro & Gestión de Pacientes',
        caption:
          'Formulario dinámico con soporte dual (crear/editar), validación reactiva en tiempo real y sanitización de datos.',
        path: 'pacientes/registro',
        variant: 'medical',
        badges: ['Pacientes', 'Reactive Forms', 'Modo Dual'],
        image: '/projects/clinica-razetti/registro-paciente-clinica-razetti.webp',
        alt: 'Formulario de registro y edición de pacientes en Clínica Razetti',
      },
      {
        id: 'medicos',
        title: 'Gestión de Médicos & Horarios',
        caption:
          'Directorio de especialistas clínicos, asignación de turnos, cupos por consulta y control de disponibilidad.',
        path: 'medicos',
        variant: 'medical',
        badges: ['Especialistas', 'Horarios', 'Consultas'],
        image: '/projects/clinica-razetti/medicos-clinica-razetti.webp',
        alt: 'Directorio y gestión de médicos especialistas y horarios de consulta',
      },
      {
        id: 'reportes',
        title: 'Hub de Reportes & Analíticas',
        caption:
          'Segmented tabs por departamento, filtros instantáneos con Signals y descarga de expedientes médicos en PDF.',
        path: 'reportes',
        variant: 'analytics',
        badges: ['Reportes PDF', 'Signals', 'Analíticas'],
        image: '/projects/clinica-razetti/reportes-clinica-razetti.webp',
        alt: 'Hub de reportes clínicos con pestañas de departamento y descarga de expedientes en PDF',
      },
      {
        id: 'usuarios',
        title: 'Control de Usuarios & Roles',
        caption:
          'Administración de acceso basada en roles (RBAC), control estricto de privilegios y borrado lógico para auditoría.',
        path: 'usuarios',
        variant: 'medical',
        badges: ['RBAC', 'RoleGuard', 'Auditoría'],
        image: '/projects/clinica-razetti/usuarios-clinica-razetti.webp',
        alt: 'Módulo de administración de usuarios y roles con políticas de seguridad',
      },
      {
        id: 'login',
        title: 'Autenticación & Acceso Seguro',
        caption:
          'Inicio de sesión con JWT Bearer, intercepción 401/403, rate limiting y revocación de sesión en tiempo real.',
        path: 'login',
        variant: 'medical',
        badges: ['JWT Bearer', 'Rate Limiting', 'Seguridad'],
        image: '/projects/clinica-razetti/login-clinica-razetti.webp',
        alt: 'Pantalla de autenticación y acceso seguro al sistema hospitalario',
      },
    ],
    challenge: {
      intro:
        'La gestión hospitalaria dependía de registros fragmentados y procesos manuales con riesgo de citas duplicadas y fuga de datos sensibles entre roles sin auditoría centralizada.',
      findings: [
        'Vulnerabilidades potenciales de acceso directo a objetos (IDOR/BOLA) en consultas y expedientes.',
        'Riesgo de escalada de privilegios en registros públicos y manipulación indebida de roles administrativos.',
        'Saturación y sobreagenda de especialistas por falta de validación atómica en turnos y cupos.',
      ],
    },
    audit: {
      diagnosis:
        'El flujo clínico anterior carecía de control estricto de roles a nivel de token, permitía borrados físicos sin trazabilidad y no contaba con revocación de tokens JWT en tiempo real al desactivar usuarios.',
      resolution:
        'Se implementó una SPA reactiva en Angular 19 con Signals y RoleGuards, conectada a una API en Node.js/PostgreSQL con Zod, JWT con validación de estado activo en tiempo real y borrados lógicos para integridad legal.',
      badge: 'QA & SEGURIDAD VERIFICADA',
      metrics: [
        {
          label: 'PRUEBAS UNITARIAS',
          value: 'Vitest Passing',
          detail: 'Componentes, guards y servicios',
        },
        {
          label: 'CONTROL DE ACCESO',
          value: '0 Brechas IDOR',
          detail: 'RoleGuard + filtro JWT estricto',
        },
        {
          label: 'HISTORIAL LEGAL',
          value: '100% Borrado Lógico',
          detail: 'Cero DELETEs físicos en BD',
        },
      ],
      consistencyNote:
        'Flujos clínicos reactivos, validación Zod y control RBAC validados mediante suites de Vitest y pruebas de integración ejecutadas de manera local.',
    },
    modules: [
      {
        code: 'MOD-A',
        title: 'Reactividad',
        subtitle: 'Arquitectura Reactiva con Angular 19 Signals',
        description:
          'Gestión de estado fluida mediante signal(), computed() y effect() para filtros instantáneos, tabs de reportes y contadores sin sobrecargar ChangeDetectorRef.',
        points: [
          'Signals nativos de Angular 19',
          'Formularios reactivos con modo dual',
          'Toast UI y modales centralizados',
        ],
        icon: 'reactivity',
      },
      {
        code: 'MOD-B',
        title: 'Seguridad',
        subtitle: 'Control RBAC & Blindaje Anti-IDOR',
        description:
          'RoleGuard funcional para protección de rutas, interceptor JWT Bearer con captura 401/403, rate limiting y revocación de sesión en base de datos en tiempo real.',
        points: [
          'RoleGuard y captura 401/403',
          'Blindaje BOLA / IDOR en endpoints',
          'Revocación instantánea de tokens',
        ],
        icon: 'state',
      },
      {
        code: 'MOD-C',
        title: 'Persistencia',
        subtitle: 'Integridad Hospitalaria en PostgreSQL',
        description:
          'PostgreSQL con consultas parametrizadas, borrados lógicos para salvaguardar el historial médico legal y validación estricta de payloads con esquemas Zod.',
        points: [
          'Borrados lógicos (estado_id)',
          'Pool de conexiones optimizado con pg',
          'Validación Zod contra inyecciones SQL',
        ],
        icon: 'database',
      },
    ],
  },
  {
    slug: 'erp-contable',
    name: 'ERP Lubriken',
    sector: 'TRANSACTIONAL ERP',
    title: 'ERP',
    titleHighlight: 'LUBRIKEN',
    year: '2026',
    status: 'CASO DE ESTUDIO',
    summary:
      'Plataforma contable full-stack con doble partida, conciliación bancaria y reportes financieros reproducibles sobre una base transaccional.',
    problem:
      'El cierre contable dependía de hojas de cálculo desconectadas; los asientos se duplicaban y la conciliación mensual consumía días de trabajo manual.',
    techTags: ['Vue 3', 'Node.js', 'PostgreSQL', 'Docker'],
    role: 'Desarrollador Frontend & Lógica de Negocio',
    client: 'Distribución Comercial / Gestión ERP',
    duration: '16 Semanas // Julio 2026 – Noviembre 2026',
    stackKey: 'Vue 3 • Node.js • PostgreSQL',
    links: {
      repo: 'https://github.com/JonathanECH',
    },
    liveHost: 'erp.local',
    accent: '#A78BFA',
    galleryDescription:
      'Interfaces reales del ERP contable: dashboard financiero, libro diario, inventario, proveedores, auditoría y acceso.',
    gallery: [
      {
        id: 'dashboard',
        title: 'Dashboard Financiero',
        caption:
          'Ingresos, gastos, rentabilidad y cuentas principales del ejercicio fiscal en tiempo real.',
        path: 'dashboard',
        variant: 'erp',
        badges: ['Ingresos', 'Gastos', 'Rentabilidad'],
        image: '/projects/erp-lubriken/dashboard-ERP-lubriken.webp',
        alt: 'Dashboard financiero con ingresos, gastos y cuentas principales',
      },
      {
        id: 'accounting',
        title: 'Contabilidad & Libro Diario',
        caption:
          'Plan de cuentas, asientos de partida doble y periodos fiscales en una sola consola.',
        path: 'contabilidad',
        variant: 'ledger',
        badges: ['Doble Partida', 'Libro Diario', 'Periodos'],
        image: '/projects/erp-lubriken/contabilidad-ERP-lubriken.webp',
        alt: 'Módulo de contabilidad con libro diario y asientos de partida doble',
      },
      {
        id: 'inventory',
        title: 'Productos & Inventario',
        caption:
          'Catálogo, existencias y movimientos Kardex con alertas de stock bajo y ajustes.',
        path: 'inventario',
        variant: 'inventory',
        badges: ['Kardex', 'Stock Bajo', 'Catálogo'],
        image: '/projects/erp-lubriken/inventrario-ERP-lubriken.webp',
        alt: 'Módulo de productos e inventario con existencias y movimientos Kardex',
      },
      {
        id: 'suppliers',
        title: 'Gestión de Proveedores',
        caption: 'Directorio de proveedores con RUC, contactos, compras y estado de cuenta.',
        path: 'proveedores',
        variant: 'analytics',
        badges: ['Proveedores', 'Compras', 'RUC'],
        image: '/projects/erp-lubriken/proveedores-ERP-lubriken.webp',
        alt: 'Gestión de proveedores con RUC, contactos y estado de cuenta',
      },
      {
        id: 'audit',
        title: 'Auditoría del Sistema',
        caption:
          'Registro de accesos y acciones por usuario, con IP, resultado y marca temporal.',
        path: 'auditoria',
        variant: 'analytics',
        badges: ['Auditoría', 'Accesos', 'Trazabilidad'],
        image: '/projects/erp-lubriken/auditoria-ERP-lubriken.webp',
        alt: 'Auditoría del sistema con registro de accesos y acciones por usuario',
      },
      {
        id: 'login',
        title: 'Acceso al Sistema',
        caption:
          'Autenticación del panel contable con sesión segura y control de acceso.',
        path: 'login',
        variant: 'inventory',
        badges: ['Autenticación', 'Sesión', 'Seguridad'],
        image: '/projects/erp-lubriken/login-ERP-lubriken.webp',
        alt: 'Pantalla de inicio de sesión de Lubriken C.A.',
      },
    ],
    challenge: {
      intro:
        'El cierre contable se armaba con hojas de cálculo que nadie versionaba. Los asientos se duplicaban entre áreas y la conciliación bancaria se resolvía a mano, sin una pista de auditoría confiable.',
      findings: [
        'Asientos duplicados por importaciones manuales sin idempotencia.',
        'Conciliación bancaria artesanal: días de trabajo y errores de arrastre.',
        'Reportes no reproducibles: cada cierre dependía del criterio de quien lo armaba.',
      ],
    },
    audit: {
      diagnosis:
        'Lubriken operaba con un modelo contable fragmentado: hojas de cálculo, importaciones manuales y reportes ad hoc. No existía idempotencia ni una pista de auditoría común entre bancos y libro mayor.',
      resolution:
        'Se implementó un ledger de doble partida con idempotencia por hash, conciliación asistida y reportes generados desde la misma fuente transaccional. Docker garantiza paridad entre entornos de cierre y producción.',
      badge: 'INTEGRIDAD CONTABLE VERIFICADA',
      metrics: [
        {
          label: 'BALANCE CONTABLE',
          value: 'Doble Partida',
          detail: 'Debe = Haber por constraint',
        },
        {
          label: 'IDEMPOTENCIA',
          value: '0 Duplicados',
          detail: 'Hash de transacción único',
        },
        {
          label: 'ENTORNO & DEVOPS',
          value: 'Docker Parity',
          detail: 'Cierres contables reproducibles',
        },
      ],
      consistencyNote:
        'Integridad del libro diario garantizada mediante llaves foráneas, transacciones ACID en PostgreSQL y reglas contables validadas en entorno local con Docker.',
    },
    modules: [
      {
        code: 'MOD-A',
        title: 'Reactividad',
        subtitle: 'Interfaz Contable Reactiva',
        description:
          'Tableros y asientos que se recalculan de forma derivada, sin mutaciones manuales del DOM.',
        points: [
          'Composables de asientos y reportes',
          'Cálculos derivados y memoizados',
          'Edición inline con validación',
        ],
        icon: 'reactivity',
      },
      {
        code: 'MOD-B',
        title: 'Estado Global',
        subtitle: 'Estado Predictible para Asientos',
        description:
          'Stores de periodo, borradores y conciliación con historial de acciones y bloqueo optimista.',
        points: [
          'Borradores persistentes por periodo',
          'Locks optimistas por asiento',
          'Historial de acciones auditable',
        ],
        icon: 'state',
      },
      {
        code: 'MOD-C',
        title: 'Persistencia',
        subtitle: 'Doble Partida & Integridad ACID',
        description:
          'PostgreSQL con constraints de balance, idempotencia por hash y migraciones reproducibles.',
        points: [
          'Constraints de débito = crédito',
          'Idempotencia por hash de importación',
          'Paridad de entornos con Docker',
        ],
        icon: 'database',
      },
    ],
  },
]

export const profile: Profile = {
  name: 'Jonathan Campos',
  role: 'Desarrollador Frontend',
  headline: ['DESARROLLADOR WEB', 'FRONTEND ENGINEER'],
  location: 'Barquisimeto, Venezuela (UTC-4)',
  education: 'TSU en Informática (IUTEPAL • Associate Degree in CS)',
  bio: 'Desarrollador Frontend especializado en Vue 3, TypeScript y arquitecturas web modernas. Diseño interfaces reactivas, accesibles y de alto rendimiento con tipado estricto y foco en la experiencia de usuario. Abierto a oportunidades remotas o híbridas (Junior / Mid) con disponibilidad inmediata.',
  bioAi:
    'Utilizo la Inteligencia Artificial como multiplicador de productividad: acelerar flujos de desarrollo, validar casos de prueba, auditar accesibilidad y optimizar la experiencia de usuario.',
  philosophyPath: '~/profile/philosophy.md',
  stats: [
    { label: 'ENFOQUE', value: 'FRONTEND & PWA' },
    { label: 'STACK CORE', value: 'VUE 3 + TS' },
    { label: 'ZONA / BASE', value: 'UTC-4 • REMOTO' },
  ],
  performance: [
    { label: 'RENDIMIENTO', value: 98 },
    { label: 'ACCESIBILIDAD', value: 100 },
    { label: 'BUENAS PRÁCTICAS', value: 100 },
    { label: 'SEO', value: 100 },
  ],
  environment: [
    { label: 'OS', value: 'Linux custom kernel' },
    { label: 'EDITOR', value: 'VS Code + Vim' },
    { label: 'DISEÑO', value: 'Figma / Penpot' },
    { label: 'RUNTIME', value: 'Node 24 + pnpm' },
    { label: 'IDIOMAS', value: 'Español (Nativo) • Inglés (B1)' },
  ],
}

export const contactChannels: readonly ContactChannel[] = [
  {
    id: 'email',
    label: 'CORREO DIRECTO',
    value: 'jonathancamposbusiness@gmail.com',
    href: 'mailto:jonathancamposbusiness@gmail.com',
    description: 'Respuesta en menos de 24 horas.',
    icon: 'mail',
    actionLabel: 'Enviar correo',
    copyValue: 'jonathancamposbusiness@gmail.com',
  },
  {
    id: 'github',
    label: 'CODEBASE',
    value: 'github.com/jonathanech',
    href: 'https://github.com/jonathanech',
    description: 'Repositorios, experimentos y código abierto.',
    icon: 'github',
    actionLabel: 'GitHub Profile',
    external: true,
  },
  {
    id: 'linkedin',
    label: 'NETWORK',
    value: 'linkedin.com/in/jonathanech',
    href: 'https://linkedin.com/in/jonathanech',
    description: 'Trayectoria, colaboraciones y contacto profesional.',
    icon: 'linkedin',
    actionLabel: 'LinkedIn Sync',
    external: true,
  },
  {
    id: 'whatsapp',
    label: 'INSTANT WIRE',
    value: '+58 4121966931',
    href: 'https://wa.me/584121966931',
    description: 'Comunicación instantánea para oportunidades.',
    icon: 'whatsapp',
    actionLabel: 'WhatsApp Pulse Directo',
    external: true,
  },
]

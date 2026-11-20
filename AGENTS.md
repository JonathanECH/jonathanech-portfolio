# AGENTS.md — Reglas de trabajo del proyecto

## Ramas y producción

`main` está desplegada en producción. **No hagas cambios directamente en `main`.**

- Para cada cambio, crea una rama nueva desde `main` actualizado.
- Usa prefijos descriptivos:
  - `feat/<descripcion-corta>` para funcionalidades.
  - `fix/<descripcion-corta>` para correcciones.
  - `chore/<descripcion-corta>` para mantenimiento.
  - `docs/<descripcion-corta>` para documentación.
  - `hotfix/<descripcion-corta>` para urgencias en producción.
- Integra la rama en `main` mediante merge o pull request; nunca con commits directos.
- Antes de commitear o integrar cambios de código, ejecuta `pnpm verify` y confirma que typecheck, tests y build pasan.
- No subas cambios de código sin verificar y sin haber revisado `git status`.

## Mentoría de diseño UI, movimiento y arquitectura frontend

- Siempre que trabajes en tareas de interfaz, animaciones, CSS, UX o arquitectura de componentes, ofrece proactivamente **consejos de diseño, principios visuales/ergonómicos e ideas de mejora** explicando el *porqué* detrás de cada decisión (coreografía espacial, rendimiento en el compositor, jerarquía visual, microinteracciones y accesibilidad) para acompañar el aprendizaje continuo del desarrollador.


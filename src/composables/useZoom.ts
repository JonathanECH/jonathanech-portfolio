import { computed, nextTick, ref, toValue } from 'vue'
import type { MaybeRefOrGetter } from 'vue'

export interface ZoomPoint {
  readonly clientX: number
  readonly clientY: number
}

export interface TouchPointLike {
  readonly clientX: number
  readonly clientY: number
}

export interface TouchEventLike {
  readonly touches: ArrayLike<TouchPointLike>
}

export type ZoomPointerEvent = ZoomPoint &
  Partial<Pick<PointerEvent, 'button' | 'pointerId' | 'pointerType'>>

export interface UseZoomOptions {
  /**
   * Smallest allowed scale. Defaults to 1 (the image's original size).
   */
  readonly minScale?: number
  /**
   * Largest allowed scale. Defaults to 4.
   */
  readonly maxScale?: number
  /**
   * Scale applied on a double click / double tap. Defaults to 2.5.
   */
  readonly doubleTapScale?: number
  /**
   * Multiplier used by the zoom in / zoom out buttons. Defaults to 1.5.
   */
  readonly zoomStep?: number
  /**
   * Element that clips the image and defines the visible viewport.
   */
  readonly stage?: MaybeRefOrGetter<HTMLElement | null>
  /**
   * Element that is actually transformed (the image itself).
   */
  readonly target?: MaybeRefOrGetter<HTMLElement | null>
}

export interface AxisBounds {
  readonly min: number
  readonly max: number
}

export interface AxisBoundsOptions {
  readonly viewportSize: number
  readonly contentSize: number
  readonly scale: number
  /**
   * Transform origin in pixels, relative to the content box.
   */
  readonly origin: number
}

interface LocalPoint {
  readonly x: number
  readonly y: number
}

interface ZoomMetrics {
  readonly stageWidth: number
  readonly stageHeight: number
  readonly stageLeft: number
  readonly stageTop: number
  readonly frameWidth: number
  readonly frameHeight: number
  /**
   * Untransformed, viewport-relative position of the frame's top-left corner.
   */
  readonly baseLeft: number
  readonly baseTop: number
}

const DEFAULT_MIN_SCALE = 1
const DEFAULT_MAX_SCALE = 4
const DEFAULT_DOUBLE_TAP_SCALE = 2.5
const DEFAULT_ZOOM_STEP = 1.5

const SCALE_EPSILON = 0.001
const PINCH_RESET_THRESHOLD = 0.02
const DOUBLE_TAP_DELAY = 320
const DOUBLE_TAP_DISTANCE = 32
const TAP_MOVE_TOLERANCE = 10
const TAP_SUPPRESSION_AFTER_PINCH = 300
const CLICK_SUPPRESSION_AFTER_GESTURE = 80

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function distanceBetween(a: TouchPointLike, b: TouchPointLike): number {
  return Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY)
}

export function midpoint(a: TouchPointLike, b: TouchPointLike): ZoomPoint {
  return {
    clientX: (a.clientX + b.clientX) / 2,
    clientY: (a.clientY + b.clientY) / 2,
  }
}

/**
 * Computes the translation range that keeps the transformed content usable.
 *
 * When the scaled content is larger than the viewport it must cover the whole
 * area (no empty gaps). When it is smaller, it may move but must stay inside
 * the viewport so it can never be dragged out of sight.
 */
export function computeAxisBounds(options: AxisBoundsOptions): AxisBounds {
  const { viewportSize, contentSize, scale, origin } = options
  const base = (viewportSize - contentSize) / 2
  const shift = base + origin * (1 - scale)
  const scaledSize = contentSize * scale

  if (scaledSize >= viewportSize) {
    return {
      min: viewportSize - shift - scaledSize,
      max: -shift,
    }
  }

  return {
    min: -shift,
    max: viewportSize - shift - scaledSize,
  }
}

/**
 * Zoom, pan and pinch state for a full-screen image viewer.
 *
 * The strict interaction contract is:
 * - `scale === 1` means the image is at its original size. Horizontal swipe
 *   navigation is allowed and handled by `useSwipeNavigation`.
 * - `scale > 1` means the image is zoomed. A single pointer drag pans the
 *   image on both axes and navigation must be disabled by the consumer.
 */
export function useZoom(options: UseZoomOptions = {}) {
  const minScale = options.minScale ?? DEFAULT_MIN_SCALE
  const maxScale = Math.max(options.maxScale ?? DEFAULT_MAX_SCALE, minScale)
  const doubleTapScale = clamp(
    options.doubleTapScale ?? DEFAULT_DOUBLE_TAP_SCALE,
    minScale,
    maxScale,
  )
  const zoomStep = Math.max(options.zoomStep ?? DEFAULT_ZOOM_STEP, 1.01)

  const scale = ref(minScale)
  const translateX = ref(0)
  const translateY = ref(0)
  const originX = ref(50)
  const originY = ref(50)

  const isPanning = ref(false)
  const isPinching = ref(false)
  const isTransitionSuppressed = ref(false)
  const justPanned = ref(false)

  let clickSuppressionTimer: ReturnType<typeof setTimeout> | null = null

  const isZoomed = computed(() => scale.value > minScale + SCALE_EPSILON)
  const isInteracting = computed(() => isPanning.value || isPinching.value)
  const transitionEnabled = computed(() => !isInteracting.value && !isTransitionSuppressed.value)
  const canZoomIn = computed(() => scale.value < maxScale - SCALE_EPSILON)
  const canZoomOut = computed(() => scale.value > minScale + SCALE_EPSILON)

  const transformStyle = computed(() => ({
    transform: `translate3d(${translateX.value}px, ${translateY.value}px, 0) scale(${scale.value})`,
    transformOrigin: `${originX.value}% ${originY.value}%`,
  }))

  let pressActive = false
  let pressPointerId: number | null = null
  let pressStartX = 0
  let pressStartY = 0
  let pressMoved = false
  let panActive = false
  let panStartX = 0
  let panStartY = 0
  let lastTapAt = 0
  let lastTapX = 0
  let lastTapY = 0
  let tapSuppressedUntil = 0

  let pinchStartDistance = 0
  let pinchStartScale = minScale
  let pinchAnchor: LocalPoint | null = null

  function readMetrics(): ZoomMetrics | null {
    const stage = options.stage ? toValue(options.stage) : null
    const target = options.target ? toValue(options.target) : null

    if (!stage || !target) {
      return null
    }

    const stageRect = stage.getBoundingClientRect()
    const frameWidth = target.offsetWidth
    const frameHeight = target.offsetHeight

    if (
      stageRect.width <= 0 ||
      stageRect.height <= 0 ||
      frameWidth <= 0 ||
      frameHeight <= 0
    ) {
      return null
    }

    return {
      stageWidth: stageRect.width,
      stageHeight: stageRect.height,
      stageLeft: stageRect.left,
      stageTop: stageRect.top,
      frameWidth,
      frameHeight,
      baseLeft: stageRect.left + (stageRect.width - frameWidth) / 2,
      baseTop: stageRect.top + (stageRect.height - frameHeight) / 2,
    }
  }

  /**
   * Resolves which point of the untransformed frame is currently under a
   * client coordinate, taking the active origin and translation into account.
   */
  function framePointAtClient(point: ZoomPoint, metrics: ZoomMetrics): LocalPoint {
    const originPx = (originX.value / 100) * metrics.frameWidth
    const originPy = (originY.value / 100) * metrics.frameHeight
    const anchorX = point.clientX - metrics.baseLeft
    const anchorY = point.clientY - metrics.baseTop

    return {
      x: originPx + (anchorX - originPx - translateX.value) / scale.value,
      y: originPy + (anchorY - originPy - translateY.value) / scale.value,
    }
  }

  function applyClampedTranslation(
    nextTranslateX: number,
    nextTranslateY: number,
    nextScale = scale.value,
    nextOriginX = originX.value,
    nextOriginY = originY.value,
  ): void {
    const metrics = readMetrics()

    if (!metrics) {
      translateX.value = 0
      translateY.value = 0
      return
    }

    const boundsX = computeAxisBounds({
      viewportSize: metrics.stageWidth,
      contentSize: metrics.frameWidth,
      scale: nextScale,
      origin: (nextOriginX / 100) * metrics.frameWidth,
    })
    const boundsY = computeAxisBounds({
      viewportSize: metrics.stageHeight,
      contentSize: metrics.frameHeight,
      scale: nextScale,
      origin: (nextOriginY / 100) * metrics.frameHeight,
    })

    translateX.value = clamp(nextTranslateX, boundsX.min, boundsX.max)
    translateY.value = clamp(nextTranslateY, boundsY.min, boundsY.max)
  }

  function markJustPanned(): void {
    justPanned.value = true

    if (clickSuppressionTimer !== null) {
      clearTimeout(clickSuppressionTimer)
    }

    clickSuppressionTimer = setTimeout(() => {
      justPanned.value = false
      clickSuppressionTimer = null
    }, CLICK_SUPPRESSION_AFTER_GESTURE)
  }

  function resetZoom(immediate = false): void {
    if (immediate) {
      isTransitionSuppressed.value = true
    }

    scale.value = minScale
    translateX.value = 0
    translateY.value = 0
    originX.value = 50
    originY.value = 50
    isPanning.value = false
    isPinching.value = false
    pinchAnchor = null
    panActive = false
    pressActive = false
    pressPointerId = null
    lastTapAt = 0

    if (immediate) {
      void nextTick(() => {
        isTransitionSuppressed.value = false
      })
    }
  }

  /**
   * Scales around a client coordinate (or the viewport centre) and keeps that
   * point visually anchored while the transform is clamped to the viewport.
   */
  function zoomTo(nextScale: number, anchor?: ZoomPoint | null): void {
    const targetScale = clamp(nextScale, minScale, maxScale)

    if (targetScale <= minScale + SCALE_EPSILON) {
      resetZoom()
      return
    }

    const metrics = readMetrics()

    if (!metrics) {
      scale.value = targetScale
      translateX.value = 0
      translateY.value = 0
      return
    }

    const anchorPoint: ZoomPoint = anchor ?? {
      clientX: metrics.stageLeft + metrics.stageWidth / 2,
      clientY: metrics.stageTop + metrics.stageHeight / 2,
    }
    const localPoint = framePointAtClient(anchorPoint, metrics)
    const originPx = clamp(localPoint.x, 0, metrics.frameWidth)
    const originPy = clamp(localPoint.y, 0, metrics.frameHeight)
    const nextOriginX = (originPx / metrics.frameWidth) * 100
    const nextOriginY = (originPy / metrics.frameHeight) * 100
    const anchorX = anchorPoint.clientX - metrics.baseLeft
    const anchorY = anchorPoint.clientY - metrics.baseTop

    originX.value = nextOriginX
    originY.value = nextOriginY
    scale.value = targetScale

    applyClampedTranslation(
      anchorX - originPx,
      anchorY - originPy,
      targetScale,
      nextOriginX,
      nextOriginY,
    )
  }

  function zoomIn(): void {
    if (!canZoomIn.value) return
    zoomTo(scale.value * zoomStep)
  }

  function zoomOut(): void {
    if (!canZoomOut.value) return
    zoomTo(scale.value / zoomStep)
  }

  function toggleZoom(anchor?: ZoomPoint): void {
    if (isZoomed.value) {
      resetZoom()
      return
    }

    zoomTo(doubleTapScale, anchor)
  }

  function onPointerDown(event: ZoomPointerEvent): void {
    if (isPinching.value) return
    if (event.pointerType === 'mouse' && event.button !== undefined && event.button !== 0) {
      return
    }

    pressActive = true
    pressPointerId = event.pointerId ?? null
    pressStartX = event.clientX
    pressStartY = event.clientY
    pressMoved = false
    panActive = false

    if (!isZoomed.value) {
      return
    }

    panActive = true
    panStartX = translateX.value
    panStartY = translateY.value
    isPanning.value = true

    const stage = options.stage ? toValue(options.stage) : null

    if (stage && event.pointerId !== undefined) {
      stage.setPointerCapture?.(event.pointerId)
    }
  }

  function onPointerMove(event: ZoomPointerEvent): void {
    if (!pressActive) return
    if (
      pressPointerId !== null &&
      event.pointerId !== undefined &&
      event.pointerId !== pressPointerId
    ) {
      return
    }

    const deltaX = event.clientX - pressStartX
    const deltaY = event.clientY - pressStartY

    if (!pressMoved && Math.hypot(deltaX, deltaY) > TAP_MOVE_TOLERANCE) {
      pressMoved = true
    }

    if (!panActive || isPinching.value || !isZoomed.value) {
      return
    }

    applyClampedTranslation(panStartX + deltaX, panStartY + deltaY)
  }

  function onPointerUp(event: ZoomPointerEvent): void {
    if (!pressActive) return
    if (
      pressPointerId !== null &&
      event.pointerId !== undefined &&
      event.pointerId !== pressPointerId
    ) {
      return
    }

    const wasPanning = pressMoved && panActive && isPanning.value

    pressActive = false
    pressPointerId = null
    panActive = false
    isPanning.value = false

    const stage = options.stage ? toValue(options.stage) : null
    const pointerId = event.pointerId

    if (
      stage &&
      pointerId !== undefined &&
      stage.hasPointerCapture?.(pointerId) === true
    ) {
      stage.releasePointerCapture?.(pointerId)
    }

    if (wasPanning) {
      applyClampedTranslation(translateX.value, translateY.value)
      markJustPanned()
      return
    }

    if (pressMoved || isPinching.value) {
      return
    }

    const now = Date.now()

    if (now < tapSuppressedUntil) {
      return
    }

    const isDoubleTap =
      now - lastTapAt <= DOUBLE_TAP_DELAY &&
      Math.hypot(event.clientX - lastTapX, event.clientY - lastTapY) <= DOUBLE_TAP_DISTANCE

    if (isDoubleTap) {
      lastTapAt = 0
      toggleZoom({ clientX: event.clientX, clientY: event.clientY })
      return
    }

    lastTapAt = now
    lastTapX = event.clientX
    lastTapY = event.clientY
  }

  function onPointerCancel(event?: ZoomPointerEvent): void {
    if (
      event &&
      pressPointerId !== null &&
      event.pointerId !== undefined &&
      event.pointerId !== pressPointerId
    ) {
      return
    }

    pressActive = false
    pressPointerId = null
    panActive = false
    isPanning.value = false
    lastTapAt = 0
  }

  function onTouchStart(event: TouchEventLike): void {
    if (event.touches.length !== 2) return

    const metrics = readMetrics()
    const first = event.touches[0]
    const second = event.touches[1]

    if (!metrics || first === undefined || second === undefined) {
      return
    }

    pressActive = false
    pressPointerId = null
    panActive = false
    isPanning.value = false
    lastTapAt = 0
    tapSuppressedUntil = Date.now() + TAP_SUPPRESSION_AFTER_PINCH
    isPinching.value = true

    const center = midpoint(first, second)
    const localPoint = framePointAtClient(center, metrics)

    pinchStartDistance = Math.max(distanceBetween(first, second), 1)
    pinchStartScale = scale.value
    pinchAnchor = { x: localPoint.x, y: localPoint.y }

    // Keeping the exact (possibly out-of-frame) anchor avoids a visual jump
    // when the pinch starts over the letterboxed area around the image.
    originX.value = (localPoint.x / metrics.frameWidth) * 100
    originY.value = (localPoint.y / metrics.frameHeight) * 100
    translateX.value = center.clientX - metrics.baseLeft - localPoint.x
    translateY.value = center.clientY - metrics.baseTop - localPoint.y
  }

  function onTouchMove(event: TouchEventLike): void {
    if (!isPinching.value || event.touches.length < 2) return

    const metrics = readMetrics()
    const anchor = pinchAnchor
    const first = event.touches[0]
    const second = event.touches[1]

    if (!metrics || !anchor || first === undefined || second === undefined) {
      return
    }

    const nextScale = clamp(
      pinchStartScale * (distanceBetween(first, second) / pinchStartDistance),
      minScale,
      maxScale,
    )
    const center = midpoint(first, second)

    scale.value = nextScale
    applyClampedTranslation(
      center.clientX - metrics.baseLeft - anchor.x,
      center.clientY - metrics.baseTop - anchor.y,
      nextScale,
    )
  }

  function finishPinch(): void {
    isPinching.value = false
    pinchAnchor = null
    tapSuppressedUntil = Date.now() + TAP_SUPPRESSION_AFTER_PINCH
    markJustPanned()

    if (scale.value <= minScale + PINCH_RESET_THRESHOLD) {
      resetZoom()
      return
    }

    applyClampedTranslation(translateX.value, translateY.value)
  }

  function onTouchEnd(event: TouchEventLike): void {
    if (!isPinching.value || event.touches.length >= 2) return
    finishPinch()
  }

  function onTouchCancel(): void {
    if (!isPinching.value) return
    finishPinch()
  }

  return {
    scale,
    translateX,
    translateY,
    originX,
    originY,
    isZoomed,
    isPanning,
    isPinching,
    isInteracting,
    transitionEnabled,
    justPanned,
    canZoomIn,
    canZoomOut,
    transformStyle,
    zoomIn,
    zoomOut,
    resetZoom,
    toggleZoom,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onTouchCancel,
  }
}

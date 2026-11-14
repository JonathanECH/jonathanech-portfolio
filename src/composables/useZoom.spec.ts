import { describe, expect, it, vi } from 'vitest'
import {
  clamp,
  computeAxisBounds,
  distanceBetween,
  midpoint,
  useZoom,
  type TouchEventLike,
  type ZoomPointerEvent,
} from './useZoom'

const STAGE_WIDTH = 1000
const STAGE_HEIGHT = 800
const IMAGE_WIDTH = 600
const IMAGE_HEIGHT = 400

function createStage(): HTMLElement {
  return {
    getBoundingClientRect: () =>
      ({
        left: 0,
        top: 0,
        right: STAGE_WIDTH,
        bottom: STAGE_HEIGHT,
        width: STAGE_WIDTH,
        height: STAGE_HEIGHT,
        x: 0,
        y: 0,
      }) as DOMRect,
    hasPointerCapture: () => false,
    releasePointerCapture: () => {},
    setPointerCapture: () => {},
  } as unknown as HTMLElement
}

function createImage(): HTMLElement {
  return {
    offsetWidth: IMAGE_WIDTH,
    offsetHeight: IMAGE_HEIGHT,
  } as unknown as HTMLElement
}

function createZoom() {
  const stage = createStage()
  const image = createImage()

  return useZoom({
    stage: () => stage,
    target: () => image,
  })
}

function pointerEvent(
  clientX: number,
  clientY: number,
  init: Partial<ZoomPointerEvent> = {},
): ZoomPointerEvent {
  return {
    clientX,
    clientY,
    button: 0,
    pointerId: 1,
    pointerType: 'touch',
    ...init,
  }
}

function touchEvent(
  points: Array<{ clientX: number; clientY: number }>,
): TouchEventLike {
  return { touches: points }
}

function doubleTap(zoom: ReturnType<typeof useZoom>, x: number, y: number): void {
  zoom.onPointerDown(pointerEvent(x, y))
  zoom.onPointerUp(pointerEvent(x, y))
  zoom.onPointerDown(pointerEvent(x, y))
  zoom.onPointerUp(pointerEvent(x, y))
}

describe('zoom math', () => {
  it('measures distance and midpoint between two touches', () => {
    expect(distanceBetween({ clientX: 0, clientY: 0 }, { clientX: 3, clientY: 4 })).toBe(5)
    expect(midpoint({ clientX: 0, clientY: 0 }, { clientX: 3, clientY: 4 })).toEqual({
      clientX: 1.5,
      clientY: 2,
    })
  })

  it('clamps a value to the allowed range', () => {
    expect(clamp(0.5, 1, 4)).toBe(1)
    expect(clamp(2.5, 1, 4)).toBe(2.5)
    expect(clamp(9, 1, 4)).toBe(4)
  })

  it('centers the content at its original scale', () => {
    const bounds = computeAxisBounds({
      viewportSize: 1000,
      contentSize: 600,
      scale: 1,
      origin: 300,
    })

    expect(bounds).toEqual({ min: -200, max: 200 })
  })

  it('keeps the scaled content inside the viewport while it is smaller', () => {
    const bounds = computeAxisBounds({
      viewportSize: 1000,
      contentSize: 600,
      scale: 1.1,
      origin: 0,
    })

    expect(bounds).toEqual({ min: -200, max: 140 })
  })

  it('forces the scaled content to cover the viewport when it is larger', () => {
    const bounds = computeAxisBounds({
      viewportSize: 1000,
      contentSize: 600,
      scale: 2.5,
      origin: 300,
    })

    expect(bounds).toEqual({ min: -250, max: 250 })
  })
})

describe('useZoom', () => {
  it('starts at the original scale', () => {
    const zoom = createZoom()

    expect(zoom.scale.value).toBe(1)
    expect(zoom.isZoomed.value).toBe(false)
    expect(zoom.canZoomIn.value).toBe(true)
    expect(zoom.canZoomOut.value).toBe(false)
  })

  it('steps the scale with the zoom controls and clamps to the limits', () => {
    const zoom = createZoom()

    zoom.zoomIn()
    expect(zoom.scale.value).toBeCloseTo(1.5)

    zoom.zoomIn()
    expect(zoom.scale.value).toBeCloseTo(2.25)

    zoom.zoomIn()
    expect(zoom.scale.value).toBeCloseTo(3.375)

    zoom.zoomIn()
    expect(zoom.scale.value).toBeCloseTo(4)
    expect(zoom.canZoomIn.value).toBe(false)

    zoom.zoomOut()
    expect(zoom.scale.value).toBeCloseTo(4 / 1.5)
    expect(zoom.canZoomOut.value).toBe(true)
  })

  it('toggles between the original and the double-tap scale', () => {
    const zoom = createZoom()

    doubleTap(zoom, 500, 400)

    expect(zoom.scale.value).toBe(2.5)
    expect(zoom.isZoomed.value).toBe(true)
    expect(zoom.translateX.value).toBe(0)
    expect(zoom.translateY.value).toBe(0)

    doubleTap(zoom, 500, 400)

    expect(zoom.scale.value).toBe(1)
    expect(zoom.isZoomed.value).toBe(false)
    expect(zoom.translateX.value).toBe(0)
    expect(zoom.translateY.value).toBe(0)
  })

  it('anchors the double-tap zoom on the tapped point', () => {
    const zoom = createZoom()

    doubleTap(zoom, 600, 400)

    expect(zoom.scale.value).toBe(2.5)
    expect(zoom.originX.value).toBeCloseTo((400 / IMAGE_WIDTH) * 100)
    expect(zoom.originY.value).toBeCloseTo((200 / IMAGE_HEIGHT) * 100)
    expect(zoom.translateX.value).toBe(0)
    expect(zoom.translateY.value).toBe(0)
  })

  it('pans on both axes without changing the scale while zoomed', () => {
    const zoom = createZoom()

    doubleTap(zoom, 500, 400)

    const zoomedScale = zoom.scale.value

    zoom.onPointerDown(pointerEvent(500, 400))
    zoom.onPointerMove(pointerEvent(600, 450))

    expect(zoom.isPanning.value).toBe(true)
    expect(zoom.translateX.value).toBeCloseTo(100)
    expect(zoom.translateY.value).toBeCloseTo(50)
    expect(zoom.scale.value).toBe(zoomedScale)

    zoom.onPointerUp(pointerEvent(600, 450))

    expect(zoom.isPanning.value).toBe(false)
  })

  it('clamps panning to the viewport edges', () => {
    const zoom = createZoom()

    doubleTap(zoom, 500, 400)

    zoom.onPointerDown(pointerEvent(500, 400))
    zoom.onPointerMove(pointerEvent(5000, 5000))

    expect(zoom.translateX.value).toBeCloseTo(250)
    expect(zoom.translateY.value).toBeCloseTo(100)
  })

  it('applies pinch scaling dynamically around the midpoint', () => {
    const zoom = createZoom()

    zoom.onTouchStart(
      touchEvent([
        { clientX: 400, clientY: 400 },
        { clientX: 600, clientY: 400 },
      ]),
    )

    expect(zoom.isPinching.value).toBe(true)

    zoom.onTouchMove(
      touchEvent([
        { clientX: 250, clientY: 400 },
        { clientX: 750, clientY: 400 },
      ]),
    )

    expect(zoom.scale.value).toBeCloseTo(2.5)
    expect(zoom.translateX.value).toBe(0)
    expect(zoom.translateY.value).toBe(0)

    zoom.onTouchEnd(touchEvent([]))

    expect(zoom.isPinching.value).toBe(false)
    expect(zoom.scale.value).toBeCloseTo(2.5)
  })

  it('snaps back to the original scale when the pinch ends near it', () => {
    const zoom = createZoom()

    zoom.onTouchStart(
      touchEvent([
        { clientX: 400, clientY: 400 },
        { clientX: 600, clientY: 400 },
      ]),
    )
    zoom.onTouchMove(
      touchEvent([
        { clientX: 450, clientY: 400 },
        { clientX: 550, clientY: 400 },
      ]),
    )
    zoom.onTouchEnd(touchEvent([]))

    expect(zoom.scale.value).toBe(1)
    expect(zoom.isZoomed.value).toBe(false)
    expect(zoom.translateX.value).toBe(0)
    expect(zoom.translateY.value).toBe(0)
  })

  it('flags a completed pan so the backdrop does not close by accident', () => {
    vi.useFakeTimers()

    try {
      const zoom = createZoom()

      doubleTap(zoom, 500, 400)
      zoom.onPointerDown(pointerEvent(500, 400))
      zoom.onPointerMove(pointerEvent(560, 400))
      zoom.onPointerUp(pointerEvent(560, 400))

      expect(zoom.justPanned.value).toBe(true)

      vi.advanceTimersByTime(100)

      expect(zoom.justPanned.value).toBe(false)
    } finally {
      vi.useRealTimers()
    }
  })

  it('ignores wheel-style secondary mouse buttons for panning', () => {
    const zoom = createZoom()

    doubleTap(zoom, 500, 400)

    zoom.onPointerDown(pointerEvent(500, 400, { button: 2, pointerType: 'mouse' }))
    zoom.onPointerMove(pointerEvent(600, 400))

    expect(zoom.translateX.value).toBe(0)
    expect(zoom.isPanning.value).toBe(false)
  })
})

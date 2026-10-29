import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.useRealTimers() })

// jsdom has no canvas / scrolling; keep the test output free of "not implemented" noise.
HTMLCanvasElement.prototype.getContext = (() => null) as never
window.scrollTo = (() => {}) as never

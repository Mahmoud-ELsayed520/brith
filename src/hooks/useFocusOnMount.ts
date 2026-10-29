import { useEffect, useRef } from 'react'

/** Moves keyboard/screen-reader focus to an element when a scene appears. */
export function useFocusOnMount<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  useEffect(() => { ref.current?.focus({ preventScroll: true }) }, [])
  return ref
}

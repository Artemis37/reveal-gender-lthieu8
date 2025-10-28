'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from 'react'
import FireworksCanvas from './FireworksCanvas'

type Props = { colors?: string[] }

export default function FireworksBackground({ colors }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const instanceRef = useRef<any>(null)
  const [useFallback, setUseFallback] = useState(false)

  useEffect(() => {
    let mounted = true
    const container = containerRef.current
    if (!container) return

    // dynamic import so this runs only on client
    import('fireworks-js').then((mod) => {
      if (!mounted) return
      // attempt to find exported Fireworks class
      const m: any = mod
      const Fireworks = m.Fireworks || m.default || m
      try {
        const defaultColors = ['#fff', '#ffd6ea', '#ff9ff3']
        const options = {
          // avoid forcing a hue that may interact with color output
          delay: { min: 10, max: 30 },
          rocketsPoint: {
            min: 0,
            max: 100
          },
          acceleration: 1.05,
          friction: 0.98,
          particles: 80,
          trace: 3,
          explosion: 6,
          autoresize: true,
          // increase brightness so colors render vividly
          brightness: { min: 85, max: 100 },
          lineStyle: 'round',
          colors: colors ?? defaultColors
        }
        // debug log to verify colors and options used
        try {
          console.log('Fireworks options:', options)
        } catch (_e) {}
        // Fireworks can accept either a container element or a selector depending on package version
        const fw = new Fireworks(container as any, options)
        instanceRef.current = fw
        // if instance was created, ensure fallback is disabled
        setUseFallback(false)
        try {
          // some package versions expose start differently; attempt to start
          if (typeof fw.start === 'function') fw.start()
          else if (typeof fw.play === 'function') fw.play()
        } catch (_e) {}
        try { console.log('Fireworks instance created', fw) } catch (_e) {}
      } catch (err) {
        // if the import or init fails, silently ignore — graceful degrade
        // console.warn('Fireworks init failed', err)
      }
    }).catch(() => {
      // package not available — enable deterministic canvas fallback
      setUseFallback(true)
    })

    // if fireworks-js doesn't initialize quickly, switch to fallback
    const fallbackTimer = setTimeout(() => {
      if (!instanceRef.current) setUseFallback(true)
    }, 700)

    return () => {
      mounted = false
      clearTimeout(fallbackTimer)
      try {
        if (instanceRef.current && typeof instanceRef.current.stop === 'function') instanceRef.current.stop()
      } catch (_e) {}
    }
  }, [colors])

  return (
    <div ref={containerRef} style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
      {useFallback ? <FireworksCanvas colors={colors} /> : null}
    </div>
  )
}

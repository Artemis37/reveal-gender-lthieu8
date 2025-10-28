'use client'
import React, { useEffect, useRef } from 'react'

type Props = { colors?: string[] }

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  age: number
  color: string
  size: number
}

export default function FireworksCanvas({ colors = ['#fff', '#ffd6ea', '#ff9ff3'] }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const particlesRef = useRef<Particle[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    function resize() {
      const dpr = window.devicePixelRatio || 1
      const c = canvasRef.current
      if (!c) return
      c.width = Math.max(1, Math.floor(c.clientWidth * dpr))
      c.height = Math.max(1, Math.floor(c.clientHeight * dpr))
      const context = c.getContext('2d')
      if (context) context.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    window.addEventListener('resize', resize)

    function spawnBurst() {
      const c = canvasRef.current
      if (!c) return
      const w = c.clientWidth
      const h = c.clientHeight
      const cx = Math.random() * w
      const cy = Math.random() * h
      const color = colors[Math.floor(Math.random() * colors.length)]
      const count = 24 + Math.floor(Math.random() * 24)
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = 1 + Math.random() * 4
        particlesRef.current.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 60 + Math.random() * 40,
          age: 0,
          color,
          size: 1 + Math.random() * 3
        })
      }
    }

    let spawnTimer = 0

    function render() {
      rafRef.current = requestAnimationFrame(render)
      const c = canvasRef.current
      if (!c) return
      const w = c.clientWidth
      const h = c.clientHeight
      if (!ctx) return
      // fade background slightly to create trails
      ctx.fillStyle = 'rgba(0,0,0,0.12)'
      ctx.fillRect(0, 0, w, h)

      // draw particles
      const ps = particlesRef.current
      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i]
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.02 // gravity
        p.vx *= 0.99
        p.vy *= 0.99
        p.age++
        const t = p.age / p.life
        const alpha = Math.max(0, 1 - t)
        ctx.beginPath()
        ctx.fillStyle = p.color
        ctx.globalAlpha = alpha
        ctx.arc(p.x, p.y, p.size * (1 - t) + 0.6, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1
        if (p.age >= p.life) ps.splice(i, 1)
      }

      spawnTimer += 1
      if (spawnTimer > 20) {
        spawnTimer = 0
        if (Math.random() < 0.8) spawnBurst()
      }
    }

    // initialize with a few bursts
    for (let i = 0; i < 3; i++) spawnBurst()
    render()

    return () => {
      window.removeEventListener('resize', resize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [colors])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }}
    />
  )
}

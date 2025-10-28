'use client'
import React from 'react'
import { useRouter } from 'next/navigation'

const RippleNavButton: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => {
  const router = useRouter()

  const createRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget
    const rect = button.getBoundingClientRect()
    const diameter = Math.max(button.clientWidth, button.clientHeight)
    const circle = document.createElement('span')
    const left = e.clientX - rect.left - diameter / 2
    const top = e.clientY - rect.top - diameter / 2

    circle.style.width = `${diameter}px`
    circle.style.height = `${diameter}px`
    circle.style.left = `${left}px`
    circle.style.top = `${top}px`
    circle.className = 'ripple'

    const existing = button.getElementsByClassName('ripple')
    if (existing.length > 0) existing[0].remove()

    button.appendChild(circle)

    setTimeout(() => {
      router.push(href)
    }, 220)

    setTimeout(() => circle.remove(), 1200)
  }

  return (
    <button className="hero-btn" aria-label={String(children)} onClick={createRipple}>
      <span className="btn-inner">
        <span className="btn-label">{children}</span>
      </span>
    </button>
  )
}

export default RippleNavButton

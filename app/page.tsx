'use client'
import React from 'react'
import { useRouter } from 'next/navigation'

const Page: React.FC = () => {
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

    // Remove any previous ripple so multiple clicks still look correct
    const existing = button.getElementsByClassName('ripple')
    if (existing.length > 0) existing[0].remove()

    button.appendChild(circle)

    // Navigate to /oldman shortly after starting the ripple so user sees feedback
    setTimeout(() => {
      router.push('/oldman')
    }, 220)

    // Remove ripple after animation (match CSS duration)
    setTimeout(() => circle.remove(), 1200)
  }

  return (
    <main className="page-hero">
      <div className="hero" role="region" aria-label="Trang chủ">
        <h1 className="hero-title">Đoán xem tiểu Tít là công hay thụ</h1>
        <button className="hero-btn" aria-label="Bắt đầu" onClick={createRipple}>
          <span className="btn-inner">
            <span className="btn-label">Bắt đầu</span>
          </span>
        </button>
      </div>
    </main>
  )
}

export default Page
'use client'
import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import styles from './medusa.module.scss'

type Props = {
  medusaName?: string | null
  medusaImage?: string | null
  oldmanName?: string | null
  oldmanImage?: string | null
}

const MedusaInteractive: React.FC<Props> = ({ medusaName, medusaImage, oldmanName, oldmanImage }) => {
  const [merged, setMerged] = useState(false)
  const [title, setTitle] = useState(`Tôi có ${medusaName ?? ''}`)
  const [rolling, setRolling] = useState(false)
  const labelRef = useRef<HTMLSpanElement | null>(null)
  const [showCountdown, setShowCountdown] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const countdownRef = useRef<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current)
        countdownRef.current = null
      }
    }
  }, [])

  const formatMs = (ms: number) => {
    if (ms <= 0) return '00:00:00'
    const total = Math.floor(ms / 1000)
    const days = Math.floor(total / 86400)
    const hours = Math.floor((total % 86400) / 3600)
    const mins = Math.floor((total % 3600) / 60)
    const secs = total % 60
    const hh = String(hours).padStart(2, '0')
    const mm = String(mins).padStart(2, '0')
    const ss = String(secs).padStart(2, '0')
    if (days > 0) return `${days}d ${hh}:${mm}:${ss}`
    return `${hh}:${mm}:${ss}`
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
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

    // update title and merged state shortly after ripple starts
    setTimeout(() => {
      setTitle(`Oh, ${oldmanName ?? ''} ${medusaName ?? ''}`)
      setMerged(true)
    }, 300)

    setTimeout(() => circle.remove(), 1200)
  }

  return (
    <div className="hero" role="region" aria-label="Medusa">
      <h1 className={`hero-title use-fade-up`}>{title}</h1>

      <div className={styles.mediaArea}>
        {/* Stage contains both images positioned in the center initially.
            When `merged` becomes true, CSS transitions move medusa to the right
            and fade/translate oldman into view. */}
        <div className={styles.stage}>
          <div className={`${styles.oldmanImg} ${merged ? styles.oldmanVisible : ''}`} style={{ ['--fade-delay']: '200ms' } as React.CSSProperties}>
            <Image src={`/${oldmanImage ?? ''}`} alt={oldmanName ?? 'oldman'} width={250} height={250} style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: 8 }} priority />
          </div>

          <div className={`${styles.medusaImg} ${merged ? styles.medusaMerged : ''}`} style={{ ['--fade-delay']: '250ms' } as React.CSSProperties}>
            <Image src={`/${medusaImage ?? ''}`} alt={medusaName ?? 'medusa'} width={500} height={500} style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: 12 }} priority />
          </div>

          <div className={`${styles.plus} ${merged ? styles.plusVisible : ''}`}>+</div>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        {!merged ? (
          <button className="hero-btn" onClick={handleClick} aria-label="Tiếp tục">
            <span className="btn-inner">
              <span className="btn-label">Tiếp tục</span>
            </span>
          </button>
        ) : (
          <button
            className={`hero-btn dice ${rolling ? 'rolling' : ''}`}
            aria-label="dice"
            title="Roll"
            aria-busy={rolling}
            onClick={() => {
              // If already rolling, ignore
              if (rolling) return

              // target: 19:30 on 31 Oct 2025 (local time)
              const now = new Date()
              const target = new Date(2025, 9, 31, 19, 30, 0)
              if (now < target) {
                // show live countdown and do nothing else
                setShowCountdown(true)
                setTimeLeft(target.getTime() - now.getTime())
                if (countdownRef.current) clearInterval(countdownRef.current)
                // update every second
                countdownRef.current = window.setInterval(() => {
                  const diff = target.getTime() - Date.now()
                  if (diff <= 0) {
                    if (countdownRef.current) {
                      clearInterval(countdownRef.current)
                      countdownRef.current = null
                    }
                    setShowCountdown(false)
                    setTimeLeft(0)
                    return
                  }
                  setTimeLeft(diff)
                }, 1000)

                return
              }

              // Now it's the target time (or after) — perform roll
              console.log('dice clicked — starting roll')
              setRolling(true)

              const el = labelRef.current
              if (el && typeof el.animate === 'function') {
                // Use Web Animations API for a reliable roll effect
                const anim = el.animate(
                  [
                    { transform: 'rotate(0deg)' },
                    { transform: 'rotate(1080deg)' }
                  ],
                  { duration: 600, easing: 'cubic-bezier(.2,.9,.2,1)', iterations: 1 }
                )
                // keep hop animation running (CSS handles diceHop independently)
                anim.onfinish = () => {
                  setRolling(false)
                  console.log('dice roll ended')
                  // navigate to result page after roll finishes
                  router.push('/fraud-result')
                }
              } else {
                // fallback: keep previous timeout-based behavior
                setTimeout(() => {
                  setRolling(false)
                  console.log('dice roll ended')
                }, 1800)
              }
            }}
          >
            <span className="btn-inner">
              <span
                ref={labelRef}
                className="btn-label"
                style={
                  rolling
                    ? { animation: 'diceRoll 400ms linear 0s 4, diceHop 900ms ease-in-out infinite' }
                    : { animation: 'diceSpin 1600ms linear infinite, diceHop 900ms ease-in-out infinite' }
                }
              >
                🎲
              </span>
            </span>
          </button>
        )}
        {showCountdown ? (
          <div style={{ marginTop: 8, color: '#fff', fontSize: '0.95rem', textAlign: 'center' }}>
              Thời gian mở khoá: {formatMs(timeLeft)}. <br />
              <span>Nạp VIP mở khoá sớm hơn liên hệ: Techcombank - 4520102000 - Luu Trung Hieu</span>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default MedusaInteractive

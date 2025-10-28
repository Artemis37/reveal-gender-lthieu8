'use client'
import React, { useEffect, useState } from 'react'
import styles from './correction.module.scss'
import FireworksBackground from '../components/FireworksBackground'

export default function CorrectionReveal() {
  // start hidden so we can fade-in on mount
  const [showText, setShowText] = useState(false)
  const [showImage, setShowImage] = useState(false)

  useEffect(() => {
    // Fade the text in, keep it visible for ~3s, then fade out and reveal image
    const t0 = setTimeout(() => setShowText(true), 60)
    const t1 = setTimeout(() => setShowText(false), 3060) // ~3s after fade-in
    const t2 = setTimeout(() => setShowImage(true), 3300)
    return () => {
      clearTimeout(t0)
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

    return (
      <>
        <div className={`${styles.wrapper} ${styles.pinkBackground}`}>
        <div className={styles.content}>
            <div className={`${styles.message} ${showText ? styles.visible : styles.hidden}`}>
            Đùa thôi tin tôi ăn L
            </div>
        </div>

        {/* When image is shown, render a fullscreen background element that contains the fireworks
            so fireworks are constrained to the image area (fills viewport) */}
    <div className={`${styles.fullscreenImage} ${showImage ? styles.visible : ''}`} aria-hidden>
      {showImage ? <FireworksBackground colors={['#4da6ff', '#80c1ff', '#cceeff']} /> : null}
      <div className={styles.bgImage} />
    </div>
        </div>
      </>
  )
}

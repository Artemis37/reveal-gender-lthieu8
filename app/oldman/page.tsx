import React from 'react'
import Image from 'next/image'
import styles from './oldman.module.scss'
import RippleNavButton from '../components/RippleNavButton'

const OldmanPage = () => {
  const name = process.env.OLDMAN_NAME;
  const image = process.env.OLDMAN_IMAGE;

  return (
    <main className="page-hero">
      <div className="hero" role="region" aria-label="Oldman">
        <h1 className="hero-title">Tôi có {name}</h1>
          <div className={styles.imageContainer}>
            <div className={`${styles.imageWrapper} use-fade-up`}>
              <Image
                src={`/${image}`}
                alt={`/${image}`}
                width={500}
                height={500}
                style={{ width: '300px', height: '300px', objectFit: 'cover' }}
                priority
              />
            </div>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <RippleNavButton href="/medusa">Tiếp tục</RippleNavButton>
        </div>
      </div>
    </main>
  )
}

export default OldmanPage
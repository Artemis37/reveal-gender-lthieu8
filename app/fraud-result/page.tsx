import React from 'react'
import Image from 'next/image'
import styles from './fraud-result.module.scss'
import FireworksBackground from '../components/FireworksBackground'
import RedirectTo from '../components/RedirectTo'

const FraudResultPage = () => {
  return (
    <main className="page-hero">
      <div className={`hero ${styles.container}`}>
        <RedirectTo delay={5000} href="/correction" />
        <FireworksBackground colors={['#ff9ff3', '#ffd6ea', '#ffffff']} />

        <div className={styles.iconWrap}>
          <Image
            src="/female.svg"
            alt="Female icon"
            width={720}
            height={720}
            className={styles.maleIcon}
            priority
          />
        </div>
      </div>
    </main>
  )
}

export default FraudResultPage
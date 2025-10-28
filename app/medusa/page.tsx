import React from 'react'
import MedusaInteractive from './MedusaInteractive'

const MedusaPage = () => {
  const name = process.env.MEDUSA_NAME ?? null
  const image = process.env.MEDUSA_IMAGE ?? null
  const oldmanName = process.env.OLDMAN_NAME ?? null
  const oldmanImage = process.env.OLDMAN_IMAGE ?? null

  return (
    <main className="page-hero">
      <div className="hero">
        <MedusaInteractive medusaName={name} medusaImage={image} oldmanName={oldmanName} oldmanImage={oldmanImage} />
      </div>
    </main>
  )
}

export default MedusaPage
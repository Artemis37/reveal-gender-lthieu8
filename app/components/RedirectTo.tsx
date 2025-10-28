'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

type Props = { delay?: number; href: string }

export default function RedirectTo({ delay = 5000, href }: Props) {
  const router = useRouter()
  useEffect(() => {
    const t = setTimeout(() => router.push(href), delay)
    return () => clearTimeout(t)
  }, [delay, href, router])
  return null
}

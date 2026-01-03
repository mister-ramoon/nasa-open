'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * ScrollRestoration Component
 * Scrolls to the top of the page on every route change
 */
export default function ScrollRestoration() {
    const pathname = usePathname()

    useEffect(() => {
        // Scroll to top on route change
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant',
        })
    }, [pathname])

    return null
}

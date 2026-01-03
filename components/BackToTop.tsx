'use client'

// Import necessary modules
import { useState, useEffect } from 'react'

export default function BackToTop() {
    // State to track visibility of the button
    const [isVisible, setIsVisible] = useState(false)

    // Effect to handle scroll event and toggle button visibility
    useEffect(() => {
        const toggleVisibility = () => {
            setIsVisible(window.scrollY > 500)
        }

        window.addEventListener('scroll', toggleVisibility)
        return () => window.removeEventListener('scroll', toggleVisibility)
    }, [])

    // Function to scroll back to the top smoothly
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }

    if (!isVisible) return null

    return (
        <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-40 p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white/70 hover:text-white hover:bg-white/20 hover:scale-110 transition-all duration-300 shadow-lg shadow-black/20 group"
            aria-label="Back to top"
        >
            <svg
                className="w-5 h-5 group-hover:-translate-y-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
            </svg>
        </button>
    )
}

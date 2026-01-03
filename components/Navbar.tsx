'use client'

// Import necessary modules
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// API categories and their routes
const apiRoutes = [
    { name: 'APOD', href: '/apod', category: 'space', emoji: '🌌' },
    { name: 'Asteroids', href: '/asteroids', category: 'space', emoji: '☄️' },
    { name: 'DONKI', href: '/donki', category: 'space', emoji: '☀️' },
    { name: 'EONET', href: '/eonet', category: 'earth', emoji: '🌍' },
    { name: 'EPIC', href: '/epic', category: 'earth', emoji: '📷' },
    { name: 'Exoplanet', href: '/exoplanet', category: 'space', emoji: '🪐' },
    { name: 'GIBS', href: '/gibs', category: 'earth', emoji: '🗺️' },
    { name: 'InSight', href: '/insight', category: 'mars', emoji: '🔴' },
    { name: 'Library', href: '/library', category: 'data', emoji: '📚' },
    { name: 'Open', href: '/open', category: 'data', emoji: '🔬' },
    { name: 'Satellite', href: '/satellite', category: 'space', emoji: '🛰️' },
    { name: 'SSD', href: '/ssd', category: 'space', emoji: '💫' },
    { name: 'Techport', href: '/techport', category: 'tech', emoji: '🚀' },
    {
        name: 'TechTransfer',
        href: '/techtransfer',
        category: 'tech',
        emoji: '💡',
    },
    { name: 'TLE', href: '/tle', category: 'data', emoji: '📡' },
    { name: 'Trek', href: '/trek', category: 'space', emoji: '🌙' },
]

export default function Navbar() {
    // Get current pathname
    const pathname = usePathname()

    // State variables
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [showDropdown, setShowDropdown] = useState(false)

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Close mobile menu on route change
    useEffect(() => {
        // Use a small timeout to avoid synchronous state updates in effect
        const timer = setTimeout(() => {
            setIsOpen(false)
            setShowDropdown(false)
        }, 0)
        return () => clearTimeout(timer)
    }, [pathname])

    // Get current page info
    const currentPage = apiRoutes.find((route) => route.href === pathname)
    const isHome = pathname === '/'

    return (
        <>
            {/* Main Navbar */}
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    scrolled
                        ? 'bg-black/60 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20'
                        : 'bg-transparent'
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between h-16 md:h-20">
                        {/* Logo */}
                        <Link
                            href="/"
                            className="flex items-center gap-3 group"
                        >
                            <div className="relative w-10 h-10 rounded-xl bg-linear-to-br from-purple-500 to-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <span className="text-xl">🚀</span>
                                <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="hidden sm:block">
                                <span className="font-bold text-white text-lg">
                                    NASA
                                </span>
                                <span className="font-light text-white/70 text-lg ml-1">
                                    Open
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-2">
                            {/* Home Link */}
                            <Link
                                href="/"
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                                    isHome
                                        ? 'bg-white/15 text-white'
                                        : 'text-white/60 hover:text-white hover:bg-white/10'
                                }`}
                            >
                                Home
                            </Link>

                            {/* APIs Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() =>
                                        setShowDropdown(!showDropdown)
                                    }
                                    onMouseEnter={() => setShowDropdown(true)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                                        !isHome
                                            ? 'bg-white/15 text-white'
                                            : 'text-white/60 hover:text-white hover:bg-white/10'
                                    }`}
                                >
                                    <span>APIs</span>
                                    {currentPage && (
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/20">
                                            {currentPage.emoji}{' '}
                                            {currentPage.name}
                                        </span>
                                    )}
                                    <svg
                                        className={`w-4 h-4 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </button>

                                {/* Dropdown Menu */}
                                {showDropdown && (
                                    <div
                                        className="absolute top-full right-0 mt-2 w-80 py-3 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl"
                                        onMouseLeave={() =>
                                            setShowDropdown(false)
                                        }
                                    >
                                        <div className="px-4 pb-2 mb-2 border-b border-white/10">
                                            <p className="text-xs text-white/40 uppercase tracking-wider">
                                                NASA APIs
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-1 px-2 max-h-96 overflow-y-auto">
                                            {apiRoutes.map((route) => (
                                                <Link
                                                    key={route.href}
                                                    href={route.href}
                                                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
                                                        pathname === route.href
                                                            ? 'bg-white/15 text-white'
                                                            : 'text-white/70 hover:text-white hover:bg-white/10'
                                                    }`}
                                                >
                                                    <span>{route.emoji}</span>
                                                    <span>{route.name}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* External Link */}
                            <a
                                href="https://api.nasa.gov"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300 flex items-center gap-1"
                            >
                                <span>Get API Key</span>
                                <svg
                                    className="w-3 h-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                    />
                                </svg>
                            </a>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all"
                            aria-label="Toggle menu"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                {isOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Mobile Menu Panel */}
            <div
                className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] z-50 bg-black/90 backdrop-blur-xl border-l border-white/10 transform transition-transform duration-300 ease-out md:hidden ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Mobile Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <span className="font-bold text-white">Navigation</span>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu Content */}
                <div className="p-4 h-[calc(100%-72px)] overflow-y-auto">
                    {/* Home Link */}
                    <Link
                        href="/"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all duration-200 ${
                            isHome
                                ? 'bg-white/15 text-white'
                                : 'text-white/70 hover:text-white hover:bg-white/10'
                        }`}
                    >
                        <span>🏠</span>
                        <span className="font-medium">Home</span>
                    </Link>

                    {/* APIs Section */}
                    <div className="mt-4">
                        <p className="text-xs text-white/40 uppercase tracking-wider px-4 mb-2">
                            APIs
                        </p>
                        <div className="space-y-1">
                            {apiRoutes.map((route) => (
                                <Link
                                    key={route.href}
                                    href={route.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                                        pathname === route.href
                                            ? 'bg-white/15 text-white'
                                            : 'text-white/70 hover:text-white hover:bg-white/10'
                                    }`}
                                >
                                    <span>{route.emoji}</span>
                                    <span>{route.name}</span>
                                    {pathname === route.href && (
                                        <span className="ml-auto w-2 h-2 rounded-full bg-cyan-400" />
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* External Link */}
                    <div className="mt-6 pt-4 border-t border-white/10">
                        <a
                            href="https://api.nasa.gov"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-linear-to-r from-purple-500 to-blue-500 text-white font-medium hover:opacity-90 transition-opacity"
                        >
                            <span>Get NASA API Key</span>
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>

            {/* Spacer for fixed navbar */}
            <div className="h-16 md:h-20" />
        </>
    )
}

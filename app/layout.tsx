// Import necessary types and fonts
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Suspense } from 'react'
import './globals.css'
import Navbar from '@/components/Navbar'
import BackToTop from '@/components/BackToTop'
import Loading from './loading'

// Load Geist Sans and Geist Mono fonts
const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
})

// Define metadata for the application
export const metadata: Metadata = {
    title: {
        default: 'NASA Open APIs Explorer',
        template: '%s | NASA Open APIs',
    },
    description:
        "Explore the universe through NASA's open APIs. Access astronomy images, asteroid data, Mars weather, satellite tracking, and more.",
    keywords: [
        'NASA',
        'APIs',
        'Space',
        'Astronomy',
        'APOD',
        'Asteroids',
        'Mars',
        'Satellites',
    ],
    authors: [{ name: 'Ramón Ruiz' }],
    openGraph: {
        title: 'NASA Open APIs Explorer',
        description: "Explore the universe through NASA's open APIs",
        type: 'website',
    },
}

// Define viewport settings for responsive design
export const viewport: Viewport = {
    themeColor: '#0a0a0f',
    width: 'device-width',
    initialScale: 1,
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" className="dark">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                {/* Global Navigation */}
                <Navbar />

                {/* Main content with Suspense for loading states */}
                <Suspense fallback={<Loading />}>
                    <main>{children}</main>
                </Suspense>

                {/* Back to top button */}
                <BackToTop />
            </body>
        </html>
    )
}

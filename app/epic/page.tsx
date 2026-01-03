// Import necessary modules and services
import {
    getNaturalImages,
    getEnhancedImages,
} from '@/lib/services/epic.service'
import EpicClient from './client'

// Define metadata for the EPIC page
export const metadata = {
    title: 'EPIC - Earth Images',
    description:
        'Earth Polychromatic Imaging Camera - Daily views of Earth from the DSCOVR spacecraft at Lagrange point 1.',
}

export default async function EpicPage() {
    // Fetch natural and enhanced images in parallel
    const [naturalImages, enhancedImages] = await Promise.all([
        getNaturalImages().catch(() => []),
        getEnhancedImages().catch(() => []),
    ])

    return (
        <EpicClient
            naturalImages={naturalImages || []}
            enhancedImages={enhancedImages || []}
        />
    )
}

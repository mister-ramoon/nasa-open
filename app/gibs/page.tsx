// Import services
import {
    getPopularLayers,
    getCategories,
    getYesterdayDate,
} from '@/lib/services/gibs.service'
import GibsClient from './client'

export default function GibsPage() {
    // Fetch data
    const layers = getPopularLayers()
    const categories = getCategories()
    const yesterday = getYesterdayDate()

    return (
        <GibsClient
            layers={layers}
            categories={categories}
            yesterdayDate={yesterday}
        />
    )
}

// Import necessary modules and services
import { getEvents, getCategories } from '@/lib/services/eonet.service'
import EonetClient from './client'

// Define metadata for the EONET page
export const metadata = {
    title: 'EONET - Natural Events',
    description:
        'Earth Observatory Natural Event Tracker - Monitor natural events happening around the world including wildfires, storms, volcanoes, and more.',
}

export default async function EonetPage() {
    // Fetch events and categories in parallel
    const [eventsData, categoriesData] = await Promise.all([
        getEvents({ status: 'open', limit: 50 }),
        getCategories(),
    ])

    return (
        <EonetClient
            events={eventsData.events}
            categories={categoriesData.categories}
        />
    )
}

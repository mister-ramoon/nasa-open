// Import necessary modules and services
import { getCME, getFLR, getGST } from '@/lib/services/donki.service'
import DonkiClient from './client'

// Define metadata for the DONKI page
export const metadata = {
    title: 'DONKI - Space Weather',
    description:
        'Database Of Notifications, Knowledge, Information - Real-time space weather monitoring including CME, solar flares, and geomagnetic storms.',
}

export default async function DonkiPage() {
    // Get dates for last 30 days
    const today = new Date()
    const thirtyDaysAgo = new Date(today)
    thirtyDaysAgo.setDate(today.getDate() - 30)

    // Format dates to YYYY-MM-DD
    const startDate = thirtyDaysAgo.toISOString().split('T')[0]
    const endDate = today.toISOString().split('T')[0]

    // Fetch data in parallel
    const [cmeEvents, flrEvents, gstEvents] = await Promise.all([
        getCME({ startDate, endDate }),
        getFLR({ startDate, endDate }),
        getGST({ startDate, endDate }),
    ])

    return (
        <DonkiClient
            cmeEvents={cmeEvents}
            flrEvents={flrEvents}
            gstEvents={gstEvents}
            startDate={startDate}
            endDate={endDate}
        />
    )
}

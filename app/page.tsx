// Import app pages
import ApodPage from './apod/page'
import AsteroidsPage from './asteroids/page'

export default function Home() {
    return (
        <div className="min-h-screen">
            <ApodPage />
            <AsteroidsPage />
        </div>
    )
}

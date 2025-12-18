// Close Approach Data Type
export interface CloseApproachData {
    close_approach_date: string
    close_approach_date_full: string
    epoch_date_close_approach: number
    relative_velocity: {
        kilometers_per_second: string
        kilometers_per_hour: string
        miles_per_hour: string
    }
    miss_distance: {
        astronomical: string
        lunar: string
        kilometers: string
        miles: string
    }
    orbiting_body: string
}

// Estimated Diameter Type
export interface EstimatedDiameter {
    kilometers: {
        estimated_diameter_min: number
        estimated_diameter_max: number
    }
    meters: {
        estimated_diameter_min: number
        estimated_diameter_max: number
    }
    miles: {
        estimated_diameter_min: number
        estimated_diameter_max: number
    }
    feet: {
        estimated_diameter_min: number
        estimated_diameter_max: number
    }
}

// Asteroid Type
export interface Asteroid {
    id: string
    neo_reference_id: string
    name: string
    nasa_jpl_url: string
    absolute_magnitude_h: number
    estimated_diameter: EstimatedDiameter
    is_potentially_hazardous_asteroid: boolean
    close_approach_data: CloseApproachData[]
    is_sentry_object: boolean
}

// Feed Response Type
export interface AsteroidFeedResponse {
    links: {
        next: string
        previous: string
        self: string
    }
    element_count: number
    near_earth_objects: {
        [date: string]: Asteroid[]
    }
}

// Browse Response Type
export interface AsteroidBrowseResponse {
    links: {
        next: string
        previous: string
        self: string
    }
    page: {
        size: number
        total_elements: number
        total_pages: number
        number: number
    }
    near_earth_objects: Asteroid[]
}

// Query Parameters Types
export interface AsteroidFeedParams {
    start_date?: string
    end_date?: string
}

// Browse Query Parameters Type
export interface AsteroidBrowseParams {
    page?: number
    size?: number
}

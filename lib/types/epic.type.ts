// Coordinates Type
export interface CentroidCoordinates {
    lat: number
    lon: number
}

// Position Type (J2000)
export interface J2000Position {
    x: number
    y: number
    z: number
}

// Attitude Quaternions Type
export interface AttitudeQuaternions {
    q0: number
    q1: number
    q2: number
    q3: number
}

// EPIC Image Type
export interface EPICImage {
    identifier: string
    caption: string
    image: string
    version: string
    centroid_coordinates: CentroidCoordinates
    dscovr_j2000_position: J2000Position
    lunar_j2000_position: J2000Position
    sun_j2000_position: J2000Position
    attitude_quaternions: AttitudeQuaternions
    date: string
    coords: {
        centroid_coordinates: CentroidCoordinates
        dscovr_j2000_position: J2000Position
        lunar_j2000_position: J2000Position
        sun_j2000_position: J2000Position
        attitude_quaternions: AttitudeQuaternions
    }
}

// Available Date Type
export interface EPICAvailableDate {
    date: string
}

// Image Collection Type
export type EPICCollection = 'natural' | 'enhanced'

// Image Format Type
export type EPICImageFormat = 'png' | 'jpg' | 'thumbs'

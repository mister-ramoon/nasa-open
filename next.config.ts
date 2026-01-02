import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'apod.nasa.gov',
                pathname: '/apod/image/**',
            },
            {
                protocol: 'https',
                hostname: 'api.nasa.gov',
                pathname: '/EPIC/archive/**',
            },
            {
                protocol: 'https',
                hostname: 'gibs.earthdata.nasa.gov',
                pathname: '/**',
            },
        ],
    },
}

export default nextConfig

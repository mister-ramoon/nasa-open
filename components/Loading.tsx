'use client'

// Skeleton components for loading states
export function SkeletonCard({ className = '' }: { className?: string }) {
    return (
        <div className={`glass-card animate-pulse ${className}`}>
            <div className="p-6 space-y-4">
                <div className="h-4 bg-white/10 rounded-lg w-3/4" />
                <div className="h-3 bg-white/10 rounded-lg w-1/2" />
                <div className="h-20 bg-white/10 rounded-lg" />
            </div>
        </div>
    )
}

// Skeleton for statistics section
export function SkeletonStats() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
                <div
                    key={i}
                    className="glass-card animate-pulse"
                    style={{ animationDelay: `${i * 100}ms` }}
                >
                    <div className="p-6 space-y-3">
                        <div className="h-8 bg-white/10 rounded-lg w-1/2" />
                        <div className="h-4 bg-white/10 rounded-lg w-3/4" />
                    </div>
                </div>
            ))}
        </div>
    )
}

// Skeleton for table layout
export function SkeletonTable({ rows = 5 }: { rows?: number }) {
    return (
        <div className="glass-card animate-pulse">
            <div className="p-6 space-y-4">
                {/* Header */}
                <div className="flex gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="h-4 bg-white/10 rounded flex-1"
                        />
                    ))}
                </div>
                {/* Rows */}
                {Array.from({ length: rows }).map((_, i) => (
                    <div
                        key={i}
                        className="flex gap-4"
                        style={{ animationDelay: `${i * 50}ms` }}
                    >
                        {[1, 2, 3, 4].map((j) => (
                            <div
                                key={j}
                                className="h-8 bg-white/5 rounded flex-1"
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}

// Skeleton for grid layout
export function SkeletonGrid({
    count = 6,
    columns = 3,
}: {
    count?: number
    columns?: number
}) {
    const colsClass =
        columns === 2
            ? 'md:grid-cols-2'
            : columns === 4
              ? 'md:grid-cols-2 lg:grid-cols-4'
              : 'md:grid-cols-2 lg:grid-cols-3'

    return (
        <div className={`grid gap-4 ${colsClass}`}>
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    )
}

// Full page skeleton layout
export function PageSkeleton() {
    return (
        <div className="min-h-screen relative">
            {/* Background */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-purple-900/30 to-slate-900" />
                <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Header skeleton */}
                <div className="text-center mb-12 animate-pulse">
                    <div className="h-6 bg-white/10 rounded-full w-40 mx-auto mb-4" />
                    <div className="h-12 bg-white/10 rounded-lg w-80 mx-auto mb-4" />
                    <div className="h-4 bg-white/10 rounded-lg w-96 mx-auto" />
                </div>

                {/* Stats skeleton */}
                <SkeletonStats />

                {/* Content skeleton */}
                <div className="mt-12">
                    <SkeletonGrid count={6} />
                </div>
            </div>
        </div>
    )
}

// Loading spinner component
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-10 h-10',
        lg: 'w-16 h-16',
    }

    return (
        <div className={`relative ${sizeClasses[size]}`}>
            <div className="absolute inset-0 rounded-full border-2 border-purple-500/30 animate-ping" />
            <div className="absolute inset-1 rounded-full border-2 border-cyan-500/40 animate-pulse" />
            <div className="absolute inset-2 rounded-full bg-linear-to-br from-purple-500/20 to-cyan-500/20 backdrop-blur-sm flex items-center justify-center">
                <span className="text-sm animate-bounce">🚀</span>
            </div>
        </div>
    )
}

// Full page loading overlay
export function LoadingOverlay({
    message = 'Loading...',
}: {
    message?: string
}) {
    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center space-y-4">
                <LoadingSpinner size="lg" />
                <p className="text-white/70 text-sm">{message}</p>
            </div>
        </div>
    )
}

// Inline loading indicator
export function InlineLoader({ text = 'Loading' }: { text?: string }) {
    return (
        <div className="flex items-center gap-2 text-white/60">
            <div className="w-4 h-4 border-2 border-white/20 border-t-cyan-400 rounded-full animate-spin" />
            <span className="text-sm">{text}</span>
        </div>
    )
}

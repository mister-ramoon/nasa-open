export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            {/* Animated Background */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-purple-900/30 to-slate-900" />
                <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
                <div
                    className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"
                    style={{ animationDelay: '1s' }}
                />
            </div>

            {/* Loading Content */}
            <div className="text-center space-y-8 animate-fade-in-up">
                {/* Animated Logo */}
                <div className="relative mx-auto w-24 h-24">
                    {/* Outer ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-purple-500/30 animate-ping" />

                    {/* Middle ring */}
                    <div className="absolute inset-2 rounded-full border-2 border-cyan-500/40 animate-pulse" />

                    {/* Inner circle with icon */}
                    <div className="absolute inset-4 rounded-full bg-linear-to-br from-purple-500/20 to-cyan-500/20 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-3xl animate-bounce">🚀</span>
                    </div>

                    {/* Orbiting dot */}
                    <div
                        className="absolute inset-0 animate-spin"
                        style={{ animationDuration: '3s' }}
                    >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50" />
                    </div>
                </div>

                {/* Loading Text */}
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-white">
                        Loading
                        <span className="inline-flex ml-1">
                            <span
                                className="animate-bounce"
                                style={{ animationDelay: '0ms' }}
                            >
                                .
                            </span>
                            <span
                                className="animate-bounce"
                                style={{ animationDelay: '150ms' }}
                            >
                                .
                            </span>
                            <span
                                className="animate-bounce"
                                style={{ animationDelay: '300ms' }}
                            >
                                .
                            </span>
                        </span>
                    </h2>
                    <p className="text-white/50 text-sm">
                        Fetching data from NASA APIs
                    </p>
                </div>

                {/* Skeleton Preview */}
                <div className="max-w-md mx-auto space-y-4 px-4">
                    {/* Stats skeleton */}
                    <div className="grid grid-cols-3 gap-3">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="h-20 rounded-xl bg-white/5 animate-pulse"
                                style={{ animationDelay: `${i * 100}ms` }}
                            />
                        ))}
                    </div>

                    {/* Cards skeleton */}
                    <div className="space-y-3">
                        {[1, 2].map((i) => (
                            <div
                                key={i}
                                className="h-24 rounded-xl bg-white/5 animate-pulse"
                                style={{ animationDelay: `${(i + 3) * 100}ms` }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

"use client"

import { MapPin, Navigation2 } from "lucide-react"

interface SimulatedMapProps {
  showCurrentLocation?: boolean
  showRoute?: boolean
  showDriverLocation?: boolean
}

export function SimulatedMap({ showCurrentLocation, showRoute, showDriverLocation }: SimulatedMapProps) {
  return (
    <div className="w-full h-full bg-gradient-to-b from-blue-50 to-blue-100 relative overflow-hidden">
      {/* Grid pattern to simulate streets */}
      <div className="absolute inset-0">
        {/* Horizontal streets */}
        {[...Array(12)].map((_, i) => (
          <div key={`h-${i}`} className="absolute left-0 right-0 h-0.5 bg-white/60" style={{ top: `${i * 8 + 4}%` }} />
        ))}
        {/* Vertical streets */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`v-${i}`}
            className="absolute top-0 bottom-0 w-0.5 bg-white/60"
            style={{ left: `${i * 12 + 6}%` }}
          />
        ))}
      </div>

      {/* Main avenue */}
      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-3 bg-gray-300/80" />

      {/* Buildings/blocks simulation */}
      {[...Array(15)].map((_, i) => (
        <div
          key={`block-${i}`}
          className="absolute bg-blue-200/50 rounded"
          style={{
            width: `${Math.random() * 8 + 4}%`,
            height: `${Math.random() * 8 + 4}%`,
            top: `${Math.random() * 80 + 5}%`,
            left: `${Math.random() * 80 + 5}%`,
          }}
        />
      ))}

      {/* Route line */}
      {showRoute && (
        <svg className="absolute inset-0 w-full h-full">
          <path
            d="M 50% 80% Q 45% 60% 50% 50% T 55% 30% T 50% 15%"
            fill="none"
            stroke="#2563eb"
            strokeWidth="4"
            strokeDasharray="8 4"
            className="animate-pulse"
          />
        </svg>
      )}

      {/* Current location marker */}
      {showCurrentLocation && !showDriverLocation && (
        <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2">
          <div className="relative">
            <div className="w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-lg" />
            <div className="absolute -inset-4 bg-blue-600/20 rounded-full animate-ping" />
          </div>
        </div>
      )}

      {/* Driver location marker */}
      {showDriverLocation && (
        <div className="absolute bottom-[40%] left-[48%] -translate-x-1/2">
          <div className="relative">
            <div className="w-10 h-10 bg-blue-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center animate-bounce">
              <Navigation2 className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      )}

      {/* Destination marker */}
      {showRoute && (
        <div className="absolute top-[15%] left-1/2 -translate-x-1/2">
          <div className="relative">
            <MapPin className="w-8 h-8 text-red-500 drop-shadow-lg" />
          </div>
        </div>
      )}

      {/* Origin marker (passenger location) */}
      {showRoute && (
        <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2">
          <div className="w-5 h-5 bg-blue-600 rounded-full border-3 border-white shadow-lg" />
        </div>
      )}

      {/* Map attribution */}
      <div className="absolute bottom-2 right-2 bg-white/80 px-2 py-1 rounded text-xs text-muted-foreground">
        Mapa simulado
      </div>
    </div>
  )
}

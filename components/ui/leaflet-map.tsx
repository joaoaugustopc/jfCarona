"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { MapPin, Car, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LeafletMapProps {
  showCurrentLocation?: boolean
  showRoute?: boolean
  showDriverLocation?: boolean
  destinationCoords?: [number, number] | null
  destinationName?: string
  onMapClick?: (lat: number, lng: number, address: string) => void
}

// Juiz de Fora coordinates
const JF_CENTER: [number, number] = [-21.7612, -43.3496]

// Current location (simulated - Centro de JF)
const currentLocation: [number, number] = [-21.7612, -43.3496]

// Driver location (simulated)
const driverLocation: [number, number] = [-21.758, -43.348]

// Convert lat/lng to tile coordinates
function latLngToTile(lat: number, lng: number, zoom: number) {
  const n = Math.pow(2, zoom)
  const x = ((lng + 180) / 360) * n
  const latRad = (lat * Math.PI) / 180
  const y = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n
  return { x, y }
}

// Convert tile coordinates to lat/lng
function tileToLatLng(x: number, y: number, zoom: number) {
  const n = Math.pow(2, zoom)
  const lng = (x / n) * 360 - 180
  const latRad = Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / n)))
  const lat = (latRad * 180) / Math.PI
  return { lat, lng }
}

export function LeafletMap({
  showCurrentLocation = true,
  showRoute,
  showDriverLocation,
  destinationCoords,
  destinationName,
  onMapClick,
}: LeafletMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(15)
  const [center, setCenter] = useState<[number, number]>(currentLocation)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [hasMoved, setHasMoved] = useState(false)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [loadedTiles, setLoadedTiles] = useState<Set<string>>(new Set())

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth
        const height = containerRef.current.offsetHeight
        console.log("[v0] Container size:", width, height)
        setContainerSize({ width, height })
        if (width > 0 && height > 0) {
          setIsLoading(false)
        }
      }
    }
    updateSize()
    const timer = setTimeout(updateSize, 100)
    window.addEventListener("resize", updateSize)
    return () => {
      window.removeEventListener("resize", updateSize)
      clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    if (destinationCoords && showRoute) {
      const midLat = (currentLocation[0] + destinationCoords[0]) / 2
      const midLng = (currentLocation[1] + destinationCoords[1]) / 2
      setCenter([midLat, midLng])
      setZoom(14)
    }
  }, [destinationCoords, showRoute])

  const getPixelPosition = useCallback(
    (lat: number, lng: number) => {
      if (containerSize.width === 0) return { x: 0, y: 0 }

      const centerTile = latLngToTile(center[0], center[1], zoom)
      const pointTile = latLngToTile(lat, lng, zoom)

      const tileSize = 256
      const x = containerSize.width / 2 + (pointTile.x - centerTile.x) * tileSize
      const y = containerSize.height / 2 + (pointTile.y - centerTile.y) * tileSize

      return { x, y }
    },
    [center, zoom, containerSize],
  )

  const getLatLngFromPixel = useCallback(
    (pixelX: number, pixelY: number) => {
      if (containerSize.width === 0) return { lat: center[0], lng: center[1] }

      const centerTile = latLngToTile(center[0], center[1], zoom)
      const tileSize = 256

      const tileX = centerTile.x + (pixelX - containerSize.width / 2) / tileSize
      const tileY = centerTile.y + (pixelY - containerSize.height / 2) / tileSize

      return tileToLatLng(tileX, tileY, zoom)
    },
    [center, zoom, containerSize],
  )

  const getTiles = useCallback(() => {
    if (containerSize.width === 0) return []

    const tiles: { x: number; y: number; url: string; left: number; top: number; key: string }[] = []
    const centerTile = latLngToTile(center[0], center[1], zoom)
    const tileSize = 256

    const tilesX = Math.ceil(containerSize.width / tileSize) + 2
    const tilesY = Math.ceil(containerSize.height / tileSize) + 2

    const startTileX = Math.floor(centerTile.x - tilesX / 2)
    const startTileY = Math.floor(centerTile.y - tilesY / 2)

    for (let dx = 0; dx < tilesX; dx++) {
      for (let dy = 0; dy < tilesY; dy++) {
        const tileX = startTileX + dx
        const tileY = startTileY + dy
        const n = Math.pow(2, zoom)

        if (tileY >= 0 && tileY < n) {
          const wrappedX = ((tileX % n) + n) % n
          const left = containerSize.width / 2 + (tileX - centerTile.x) * tileSize
          const top = containerSize.height / 2 + (tileY - centerTile.y) * tileSize

          const server = String.fromCharCode(97 + ((wrappedX + tileY) % 3)) // a, b, or c
          tiles.push({
            x: wrappedX,
            y: tileY,
            url: `https://${server}.tile.openstreetmap.org/${zoom}/${wrappedX}/${tileY}.png`,
            left,
            top,
            key: `${zoom}-${wrappedX}-${tileY}`,
          })
        }
      }
    }

    return tiles
  }, [center, zoom, containerSize])

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true)
    setHasMoved(false)
    setDragStart({ x: e.clientX, y: e.clientY })
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return

    const dx = e.clientX - dragStart.x
    const dy = e.clientY - dragStart.y

    if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
      setHasMoved(true)
      const centerTile = latLngToTile(center[0], center[1], zoom)
      const tileSize = 256

      const newTileX = centerTile.x - dx / tileSize
      const newTileY = centerTile.y - dy / tileSize

      const newCenter = tileToLatLng(newTileX, newTileY, zoom)
      setCenter([newCenter.lat, newCenter.lng])
      setDragStart({ x: e.clientX, y: e.clientY })
    }
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false)

    if (!hasMoved && onMapClick && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const pixelX = e.clientX - rect.left
      const pixelY = e.clientY - rect.top

      const { lat, lng } = getLatLngFromPixel(pixelX, pixelY)

      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`, {
        headers: { "Accept-Language": "pt-BR" },
      })
        .then((res) => res.json())
        .then((data) => {
          const address = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`
          onMapClick(lat, lng, address)
        })
        .catch(() => {
          onMapClick(lat, lng, `${lat.toFixed(6)}, ${lng.toFixed(6)}`)
        })
    }

    setHasMoved(false)
  }

  const handleZoomIn = () => setZoom((z) => Math.min(z + 1, 18))
  const handleZoomOut = () => setZoom((z) => Math.max(z - 1, 10))

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    if (e.deltaY < 0) {
      handleZoomIn()
    } else {
      handleZoomOut()
    }
  }

  const tiles = getTiles()
  const currentLocationPixel = getPixelPosition(currentLocation[0], currentLocation[1])
  const destinationPixel = destinationCoords ? getPixelPosition(destinationCoords[0], destinationCoords[1]) : null
  const driverPixel = showDriverLocation ? getPixelPosition(driverLocation[0], driverLocation[1]) : null

  const handleTileLoad = (key: string) => {
    setLoadedTiles((prev) => new Set(prev).add(key))
  }

  return (
    <div className="absolute inset-0 bg-slate-200 overflow-hidden" ref={containerRef}>
      <div
        className={`absolute inset-0 ${isDragging && hasMoved ? "cursor-grabbing" : "cursor-crosshair"}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
        style={{ touchAction: "none" }}
      >
        {tiles.map((tile) => (
          <img
            key={tile.key}
            src={tile.url || "/placeholder.svg"}
            alt=""
            crossOrigin="anonymous"
            className="absolute select-none pointer-events-none"
            style={{
              left: tile.left,
              top: tile.top,
              width: 256,
              height: 256,
            }}
            draggable={false}
            onLoad={() => handleTileLoad(tile.key)}
            onError={(e) => {
              const fallbackUrl = `https://tile.openstreetmap.org/${zoom}/${tile.x}/${tile.y}.png`
              if ((e.target as HTMLImageElement).src !== fallbackUrl) {
                ;(e.target as HTMLImageElement).src = fallbackUrl
              }
            }}
          />
        ))}

        {destinationCoords && showRoute && destinationPixel && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
            <defs>
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>
            <line
              x1={currentLocationPixel.x}
              y1={currentLocationPixel.y}
              x2={destinationPixel.x}
              y2={destinationPixel.y}
              stroke="url(#routeGradient)"
              strokeWidth="4"
              strokeDasharray="10,10"
              strokeLinecap="round"
            />
          </svg>
        )}

        {showCurrentLocation && (
          <div
            className="absolute z-10 pointer-events-none"
            style={{
              left: currentLocationPixel.x,
              top: currentLocationPixel.y,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="relative">
              <div className="w-5 h-5 bg-blue-600 rounded-full border-4 border-white shadow-lg" />
              <div className="absolute -top-2 -left-2 w-9 h-9 bg-blue-600/30 rounded-full animate-ping" />
            </div>
          </div>
        )}

        {destinationCoords && destinationPixel && (
          <div
            className="absolute z-10 pointer-events-none"
            style={{
              left: destinationPixel.x,
              top: destinationPixel.y,
              transform: "translate(-50%, -100%)",
            }}
          >
            <div className="flex flex-col items-center">
              <div className="bg-red-500 p-2 rounded-full shadow-lg">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              {destinationName && (
                <div className="mt-1 bg-white px-2 py-1 rounded shadow text-xs font-medium max-w-[150px] truncate">
                  {destinationName.split(",")[0]}
                </div>
              )}
            </div>
          </div>
        )}

        {showDriverLocation && driverPixel && (
          <div
            className="absolute z-10 pointer-events-none"
            style={{
              left: driverPixel.x,
              top: driverPixel.y,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="bg-blue-600 p-2 rounded-full shadow-lg border-4 border-white">
              <Car className="w-5 h-5 text-white" />
            </div>
          </div>
        )}
      </div>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-200 z-30">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Carregando mapa...</p>
          </div>
        </div>
      )}

      <div className="absolute top-4 left-4 flex flex-col gap-1 z-20">
        <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8 bg-white shadow-md hover:bg-slate-100"
          onClick={handleZoomIn}
        >
          <Plus className="w-4 h-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8 bg-white shadow-md hover:bg-slate-100"
          onClick={handleZoomOut}
        >
          <Minus className="w-4 h-4" />
        </Button>
      </div>

      <div className="absolute bottom-20 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-md z-20 text-xs space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow" />
          <span>Sua localização</span>
        </div>
        {destinationCoords && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <span>Destino</span>
          </div>
        )}
        {showDriverLocation && (
          <div className="flex items-center gap-2">
            <Car className="w-3 h-3 text-blue-600" />
            <span>Motorista</span>
          </div>
        )}
      </div>

      <div className="absolute bottom-20 right-4 bg-white/80 px-2 py-1 rounded text-[10px] text-muted-foreground z-20">
        © OpenStreetMap contributors
      </div>
    </div>
  )
}

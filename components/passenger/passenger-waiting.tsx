"use client"

import { useEffect, useState } from "react"
import { X, Car } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LeafletMap } from "@/components/ui/leaflet-map"

interface PassengerWaitingProps {
  onDriverFound: () => void
  onCancel: () => void
  rideData?: {
    origin: string
    originCoords: [number, number]
    destination: string
    destinationCoords: [number, number]
  } | null
}

export function PassengerWaiting({ onDriverFound, onCancel, rideData }: PassengerWaitingProps) {
  const [dots, setDots] = useState(1)
  const [driverFound, setDriverFound] = useState(false)

  // Driver location slightly offset from pickup point
  const driverCoords: [number, number] = rideData
    ? [rideData.originCoords[0] + 0.003, rideData.originCoords[1] - 0.004]
    : [-21.7612, -43.354]

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots((d) => (d % 3) + 1)
    }, 500)

    // After 3 seconds, show driver found state
    const foundTimeout = setTimeout(() => {
      setDriverFound(true)
    }, 3000)

    // After 5 seconds total, proceed to tracking
    const timeout = setTimeout(() => {
      onDriverFound()
    }, 5000)

    return () => {
      clearInterval(dotsInterval)
      clearTimeout(foundTimeout)
      clearTimeout(timeout)
    }
  }, [onDriverFound])

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <div
        className={`${driverFound ? "bg-green-600" : "bg-blue-600"} text-white p-4 pt-12 transition-colors duration-300`}
      >
        <h1 className="text-xl font-semibold">
          {driverFound ? "Motorista encontrado!" : `Buscando motorista${".".repeat(dots)}`}
        </h1>
        <p className="text-sm text-white/80 mt-1">
          {driverFound ? "José Carlos está a caminho" : "Aguarde enquanto encontramos um motorista"}
        </p>
      </div>

      {/* Map showing driver and pickup location */}
      <div className="flex-1 relative min-h-0">
        <LeafletMap
          showCurrentLocation
          currentLocationCoords={rideData?.originCoords}
          showDriverLocation={driverFound}
          driverCoords={driverCoords}
        />
      </div>

      {/* Driver Card (shown when found) */}
      {driverFound && (
        <div className="bg-background border-t p-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-lg font-semibold text-blue-600">JC</span>
            </div>
            <div className="flex-1">
              <h2 className="font-semibold">José Carlos</h2>
              <p className="text-sm text-muted-foreground">Onix Prata • ABC-1234</p>
            </div>
            <div className="flex items-center gap-1 bg-blue-100 px-3 py-1 rounded-full">
              <Car className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">2 min</span>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Button */}
      {!driverFound && (
        <div className="p-4 border-t">
          <Button variant="outline" onClick={onCancel} className="w-full bg-transparent">
            <X className="w-4 h-4 mr-2" />
            Cancelar solicitação
          </Button>
        </div>
      )}
    </div>
  )
}

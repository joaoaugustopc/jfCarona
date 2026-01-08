"use client"

import { useState, useEffect } from "react"
import { Phone, MessageSquare, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SimulatedMap } from "@/components/ui/simulated-map"

interface DriverNavigationProps {
  onArrived: () => void
}

export function DriverNavigation({ onArrived }: DriverNavigationProps) {
  const [distance, setDistance] = useState(2.3)
  const [eta, setEta] = useState(5)

  useEffect(() => {
    const interval = setInterval(() => {
      setDistance((prev) => Math.max(0, prev - 0.3))
      setEta((prev) => Math.max(0, prev - 1))
    }, 1500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 pt-12">
        <div className="flex items-center gap-2 mb-2">
          <Navigation className="w-5 h-5" />
          <span className="font-medium">Navegando até o passageiro</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold">{eta} min</p>
            <p className="text-blue-100">{distance.toFixed(1)} km restantes</p>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <SimulatedMap showRoute showDriverLocation />
      </div>

      {/* Passenger Card */}
      <div className="bg-background border-t p-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-xl font-semibold text-blue-600">MS</span>
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-lg">Mariana Silva</h2>
            <p className="text-sm text-muted-foreground">Rua Halfeld, 1000 - Centro</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <Button variant="outline" className="h-12 bg-transparent">
            <Phone className="w-4 h-4 mr-2" />
            Ligar
          </Button>
          <Button variant="outline" className="h-12 bg-transparent">
            <MessageSquare className="w-4 h-4 mr-2" />
            Mensagem
          </Button>
        </div>

        <Button
          onClick={onArrived}
          className="w-full h-14 text-lg bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl"
        >
          Cheguei no Local
        </Button>
      </div>
    </div>
  )
}

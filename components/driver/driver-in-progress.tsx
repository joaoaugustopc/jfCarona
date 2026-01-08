"use client"

import { useState } from "react"
import { MapPin, Navigation, Clock, Play, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SimulatedMap } from "@/components/ui/simulated-map"

interface DriverInProgressProps {
  onFinish: () => void
}

export function DriverInProgress({ onFinish }: DriverInProgressProps) {
  const [status, setStatus] = useState<"waiting" | "inProgress">("waiting")

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div
        className={`${status === "inProgress" ? "bg-green-600" : "bg-blue-600"} text-white p-4 pt-12 transition-colors`}
      >
        <p className="text-sm text-white/80 mb-1">
          {status === "waiting" ? "Passageiro encontrado" : "Viagem em andamento"}
        </p>
        <h1 className="text-xl font-semibold">
          {status === "waiting" ? "Aguardando embarque" : "A caminho do destino"}
        </h1>
      </div>

      {/* Route Info */}
      <div className="p-4 border-b">
        <div className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 bg-blue-600 rounded-full" />
            <div className="w-0.5 h-8 bg-gray-300" />
            <MapPin className="w-5 h-5 text-red-500" />
          </div>
          <div className="flex-1 space-y-2">
            <div>
              <p className="text-xs text-muted-foreground">Origem</p>
              <p className="font-medium text-sm">Rua Halfeld, 1000 - Centro</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Destino</p>
              <p className="font-medium text-sm">UFJF - Campus Universitário</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
              <Navigation className="w-4 h-4" />
              <span>5,2 km</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>~12 min</span>
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <SimulatedMap showRoute showDriverLocation />
      </div>

      {/* Action Button */}
      <div className="bg-background border-t p-4">
        <div className="flex items-center gap-4 mb-4 p-3 bg-muted/50 rounded-xl">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-lg font-semibold text-blue-600">MS</span>
          </div>
          <div className="flex-1">
            <p className="font-semibold">Mariana Silva</p>
            <p className="text-sm text-muted-foreground">Pagamento: Cartão</p>
          </div>
          <p className="text-xl font-bold text-green-600">R$ 14,50</p>
        </div>

        {status === "waiting" ? (
          <Button
            onClick={() => setStatus("inProgress")}
            className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl"
          >
            <Play className="w-5 h-5 mr-2" />
            Iniciar Viagem
          </Button>
        ) : (
          <Button
            onClick={onFinish}
            className="w-full h-14 text-lg bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl"
          >
            <Square className="w-5 h-5 mr-2" />
            Finalizar Corrida
          </Button>
        )}
      </div>
    </div>
  )
}

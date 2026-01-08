"use client"

import { useState, useEffect } from "react"
import { MapPin, Navigation, Clock, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DriverRideRequestProps {
  onAccept: () => void
  onDecline: () => void
}

export function DriverRideRequest({ onAccept, onDecline }: DriverRideRequestProps) {
  const [timeLeft, setTimeLeft] = useState(15)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onDecline()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [onDecline])

  return (
    <div className="min-h-screen bg-blue-600 flex flex-col">
      {/* Timer Header */}
      <div className="p-4 pt-12 text-center text-white">
        <div className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center mx-auto mb-2">
          <span className="text-2xl font-bold">{timeLeft}</span>
        </div>
        <p className="text-blue-100">segundos para responder</p>
      </div>

      {/* Ride Card */}
      <div className="flex-1 bg-background rounded-t-3xl p-6">
        <h2 className="text-xl font-bold mb-4 text-center">Nova Corrida!</h2>

        {/* Passenger Info */}
        <div className="flex items-center gap-3 mb-6 p-4 bg-muted/50 rounded-xl">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-lg font-semibold text-blue-600">MS</span>
          </div>
          <div>
            <p className="font-semibold">Mariana Silva</p>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span className="text-yellow-500">★</span>
              <span>4.8</span>
              <span>•</span>
              <span>124 corridas</span>
            </div>
          </div>
        </div>

        {/* Route Info */}
        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
              <div className="w-3 h-3 bg-blue-600 rounded-full" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Origem</p>
              <p className="font-medium">Rua Halfeld, 1000 - Centro</p>
              <p className="text-sm text-blue-600">2,3 km de você</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4 text-red-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Destino</p>
              <p className="font-medium">UFJF - Campus Universitário</p>
            </div>
          </div>
        </div>

        {/* Trip Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="text-center p-3 bg-muted/50 rounded-xl">
            <Navigation className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <p className="font-semibold">5,2 km</p>
            <p className="text-xs text-muted-foreground">Distância</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-xl">
            <Clock className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <p className="font-semibold">~12 min</p>
            <p className="text-xs text-muted-foreground">Duração</p>
          </div>
          <div className="text-center p-3 bg-green-100 rounded-xl">
            <p className="text-xl font-bold text-green-600">R$ 14,50</p>
            <p className="text-xs text-green-700">Valor</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={onDecline}
            className="h-14 text-lg border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 bg-transparent"
          >
            <X className="w-5 h-5 mr-2" />
            Recusar
          </Button>
          <Button onClick={onAccept} className="h-14 text-lg bg-green-600 hover:bg-green-700 text-white">
            <Check className="w-5 h-5 mr-2" />
            Aceitar
          </Button>
        </div>
      </div>
    </div>
  )
}

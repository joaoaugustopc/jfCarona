"use client"

import { MapPin, ArrowLeft, CreditCard, Banknote, Clock, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { LeafletMap } from "@/components/ui/leaflet-map"

interface PassengerRideRequestProps {
  destination: string
  destinationCoords?: [number, number] | null
  onConfirm: (data: {
    origin: string
    originCoords: [number, number]
    destination: string
    destinationCoords: [number, number]
  }) => void
  onBack: () => void
}

export function PassengerRideRequest({ destination, destinationCoords, onConfirm, onBack }: PassengerRideRequestProps) {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash">("card")

  const originCoords: [number, number] = [-21.7642, -43.3503]
  const originAddress = "Rua Halfeld, 1000 - Centro"

  const handleConfirm = () => {
    onConfirm({
      origin: originAddress,
      originCoords: originCoords,
      destination: destination,
      destinationCoords: destinationCoords || [-21.7612, -43.345],
    })
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 pt-12">
        <button onClick={onBack} className="flex items-center gap-2 mb-4">
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar</span>
        </button>
        <h1 className="text-xl font-semibold">Confirmar Corrida</h1>
      </div>

      <div className="h-48 relative">
        <LeafletMap
          showCurrentLocation
          showRoute={!!destinationCoords}
          destinationCoords={destinationCoords}
          destinationName={destination}
        />
      </div>

      {/* Route Info */}
      <div className="p-4 border-b">
        <div className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 bg-blue-600 rounded-full" />
            <div className="w-0.5 h-12 bg-gray-300" />
            <MapPin className="w-5 h-5 text-red-500" />
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <p className="text-xs text-muted-foreground">Origem</p>
              <p className="font-medium">{originAddress}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Destino</p>
              <p className="font-medium">{destination}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trip Details */}
      <div className="p-4 border-b">
        <h2 className="font-semibold mb-4">Detalhes da viagem</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-muted/50 rounded-xl">
            <Navigation className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <p className="text-lg font-semibold">5,2 km</p>
            <p className="text-xs text-muted-foreground">Distância</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-xl">
            <Clock className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <p className="text-lg font-semibold">12 min</p>
            <p className="text-xs text-muted-foreground">Tempo est.</p>
          </div>
          <div className="text-center p-3 bg-blue-100 rounded-xl">
            <p className="text-2xl font-bold text-blue-600">R$ 14,50</p>
            <p className="text-xs text-blue-600">Valor</p>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="p-4 flex-1">
        <h2 className="font-semibold mb-4">Forma de pagamento</h2>
        <div className="space-y-3">
          <button
            onClick={() => setPaymentMethod("card")}
            className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-colors ${
              paymentMethod === "card" ? "border-blue-600 bg-blue-50" : "border-border hover:border-blue-300"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                paymentMethod === "card" ? "bg-blue-600" : "bg-muted"
              }`}
            >
              <CreditCard className={`w-5 h-5 ${paymentMethod === "card" ? "text-white" : "text-muted-foreground"}`} />
            </div>
            <div className="text-left">
              <p className="font-medium">Cartão de Crédito/Débito</p>
              <p className="text-sm text-muted-foreground">•••• 4532</p>
            </div>
          </button>

          <button
            onClick={() => setPaymentMethod("cash")}
            className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-colors ${
              paymentMethod === "cash" ? "border-blue-600 bg-blue-50" : "border-border hover:border-blue-300"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                paymentMethod === "cash" ? "bg-blue-600" : "bg-muted"
              }`}
            >
              <Banknote className={`w-5 h-5 ${paymentMethod === "cash" ? "text-white" : "text-muted-foreground"}`} />
            </div>
            <div className="text-left">
              <p className="font-medium">Dinheiro</p>
              <p className="text-sm text-muted-foreground">Pagar ao motorista</p>
            </div>
          </button>
        </div>
      </div>

      {/* Confirm Button */}
      <div className="p-4 border-t bg-background">
        <Button
          onClick={handleConfirm}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white h-14 text-lg font-semibold rounded-xl"
        >
          Solicitar Corrida
        </Button>
      </div>
    </div>
  )
}

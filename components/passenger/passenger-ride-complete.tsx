"use client"

import { useState } from "react"
import { Star, MapPin, Clock, Navigation, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface PassengerRideCompleteProps {
  onComplete: () => void
  rideData?: {
    origin: string
    originCoords: [number, number]
    destination: string
    destinationCoords: [number, number]
  } | null
}

export function PassengerRideComplete({ onComplete, rideData }: PassengerRideCompleteProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-green-600 text-white p-6 pt-12 text-center">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-1">Corrida Concluída!</h1>
        <p className="text-green-100">Obrigado por usar o Carona JF</p>
      </div>

      {/* Trip Summary */}
      <div className="p-4 border-b">
        <h2 className="font-semibold mb-4">Resumo da viagem</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-3 h-3 bg-blue-600 rounded-full mt-1.5" />
            <div>
              <p className="text-xs text-muted-foreground">Origem</p>
              <p className="font-medium">{rideData?.origin || "Rua Halfeld, 1000 - Centro"}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-red-500 -ml-1" />
            <div>
              <p className="text-xs text-muted-foreground">Destino</p>
              <p className="font-medium">{rideData?.destination || "Destino não informado"}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t">
          <div className="text-center">
            <Navigation className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
            <p className="font-semibold">5,2 km</p>
            <p className="text-xs text-muted-foreground">Distância</p>
          </div>
          <div className="text-center">
            <Clock className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
            <p className="font-semibold">14 min</p>
            <p className="text-xs text-muted-foreground">Duração</p>
          </div>
          <div className="text-center">
            <CreditCard className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
            <p className="font-semibold text-blue-600">R$ 14,50</p>
            <p className="text-xs text-muted-foreground">Cartão</p>
          </div>
        </div>
      </div>

      {/* Rating Section */}
      <div className="p-4 flex-1">
        <h2 className="font-semibold mb-2">Avalie o motorista</h2>
        <p className="text-sm text-muted-foreground mb-4">Como foi sua experiência com José Carlos?</p>

        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} onClick={() => setRating(star)} className="p-1 transition-transform hover:scale-110">
              <Star className={`w-10 h-10 ${star <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} />
            </button>
          ))}
        </div>

        <Textarea
          placeholder="Deixe um comentário (opcional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="resize-none"
          rows={3}
        />
      </div>

      {/* Submit Button */}
      <div className="p-4 border-t">
        <Button
          onClick={onComplete}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white h-14 text-lg font-semibold rounded-xl"
        >
          {rating > 0 ? "Enviar Avaliação" : "Pular"}
        </Button>
      </div>
    </div>
  )
}

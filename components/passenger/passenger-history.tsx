"use client"

import { ArrowLeft, MapPin, Calendar, CreditCard, Banknote } from "lucide-react"

interface PassengerHistoryProps {
  onBack: () => void
}

const rides = [
  {
    id: 1,
    date: "15/12/2025",
    time: "08:30",
    origin: "Rua Halfeld, 1000",
    destination: "UFJF - Campus",
    value: "R$ 14,50",
    payment: "card" as const,
    driver: "José Carlos",
  },
  {
    id: 2,
    date: "14/12/2025",
    time: "18:45",
    origin: "Shopping Independência",
    destination: "Rua Halfeld, 1000",
    value: "R$ 12,00",
    payment: "cash" as const,
    driver: "Maria Santos",
  },
  {
    id: 3,
    date: "12/12/2025",
    time: "14:20",
    origin: "Rodoviária",
    destination: "Praça da Estação",
    value: "R$ 8,50",
    payment: "card" as const,
    driver: "Pedro Alves",
  },
  {
    id: 4,
    date: "10/12/2025",
    time: "09:00",
    origin: "Rua Halfeld, 1000",
    destination: "Hospital Monte Sinai",
    value: "R$ 18,00",
    payment: "card" as const,
    driver: "Ana Costa",
  },
]

export function PassengerHistory({ onBack }: PassengerHistoryProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 pt-12">
        <button onClick={onBack} className="flex items-center gap-2 mb-4">
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar</span>
        </button>
        <h1 className="text-xl font-semibold">Histórico de Corridas</h1>
      </div>

      {/* Rides List */}
      <div className="flex-1 p-4 space-y-3">
        {rides.map((ride) => (
          <div key={ride.id} className="bg-card border rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{ride.date}</span>
                <span>•</span>
                <span>{ride.time}</span>
              </div>
              <div className="flex items-center gap-1">
                {ride.payment === "card" ? (
                  <CreditCard className="w-4 h-4 text-blue-600" />
                ) : (
                  <Banknote className="w-4 h-4 text-green-600" />
                )}
                <span className="font-semibold text-blue-600">{ride.value}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full" />
                <span className="text-sm">{ride.origin}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-500 -ml-1" />
                <span className="text-sm">{ride.destination}</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Motorista: {ride.driver}</span>
              <button className="text-sm text-blue-600 font-medium">Ver detalhes</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

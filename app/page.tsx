"use client"

import { useState } from "react"
import { PassengerApp } from "@/components/passenger/passenger-app"
import { DriverApp } from "@/components/driver/driver-app"
import { Car, Users } from "lucide-react"

export default function HomePage() {
  const [mode, setMode] = useState<"select" | "passenger" | "driver">("select")

  if (mode === "passenger") {
    return <PassengerApp onBack={() => setMode("select")} />
  }

  if (mode === "driver") {
    return <DriverApp onBack={() => setMode("select")} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-800 flex flex-col items-center justify-center p-6">
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Car className="w-10 h-10 text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">Carona JF</h1>
        <p className="text-blue-100 text-lg">Prefeitura de Juiz de Fora</p>
      </div>

      <div className="w-full max-w-sm space-y-4">
        <button
          onClick={() => setMode("passenger")}
          className="w-full bg-white text-blue-600 rounded-2xl p-6 flex items-center gap-4 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
            <Users className="w-7 h-7 text-blue-600" />
          </div>
          <div className="text-left">
            <h2 className="text-xl font-semibold">Sou Passageiro</h2>
            <p className="text-blue-600/70 text-sm">Solicitar uma corrida</p>
          </div>
        </button>

        <button
          onClick={() => setMode("driver")}
          className="w-full bg-blue-700 text-white rounded-2xl p-6 flex items-center gap-4 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] border border-blue-500"
        >
          <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center">
            <Car className="w-7 h-7 text-white" />
          </div>
          <div className="text-left">
            <h2 className="text-xl font-semibold">Sou Motorista</h2>
            <p className="text-blue-200 text-sm">Realizar corridas</p>
          </div>
        </button>
      </div>

      <p className="text-blue-200 text-sm mt-12 text-center">Transporte público acessível para todos</p>
    </div>
  )
}

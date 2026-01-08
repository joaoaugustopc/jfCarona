"use client"

import { useState, useEffect } from "react"
import { Menu, LogOut, AlertCircle, Power, MapPin, Navigation, Clock, X, Check } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LeafletMap } from "@/components/ui/leaflet-map"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"

interface DriverHomeProps {
  isVerified: boolean
  onNewRide: () => void
  onLogout: () => void
}

const DRIVER_LOCATION = { lat: -21.7642, lng: -43.3503 }
const PASSENGER_LOCATION = { lat: -21.7612, lng: -43.345 }
const DESTINATION_LOCATION = { lat: -21.7756, lng: -43.3695 }

export function DriverHome({ isVerified, onNewRide, onLogout }: DriverHomeProps) {
  const [isAvailable, setIsAvailable] = useState(false)
  const [hasRideRequest, setHasRideRequest] = useState(false)
  const [timeLeft, setTimeLeft] = useState(15)

  useEffect(() => {
    if (isAvailable && isVerified && !hasRideRequest) {
      const timeout = setTimeout(() => {
        setHasRideRequest(true)
        setTimeLeft(15)
      }, 3000)
      return () => clearTimeout(timeout)
    }
  }, [isAvailable, isVerified, hasRideRequest])

  useEffect(() => {
    if (hasRideRequest && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setHasRideRequest(false)
            return 15
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [hasRideRequest, timeLeft])

  const handleAccept = () => {
    setHasRideRequest(false)
    onNewRide()
  }

  const handleDecline = () => {
    setHasRideRequest(false)
    setTimeLeft(15)
  }

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 pt-12 pb-6 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-blue-100 text-sm">Olá,</p>
            <h1 className="text-xl font-semibold">José Carlos</h1>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <button className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <Menu className="w-5 h-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col h-full">
                <div className="py-6 border-b">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-semibold text-blue-600">JC</span>
                  </div>
                  <p className="text-center font-semibold">José Carlos</p>
                  <p className="text-center text-sm text-muted-foreground">jose@email.com</p>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <span className="text-yellow-500">★</span>
                    <span className="font-medium">4.9</span>
                  </div>
                </div>
                <div className="flex-1 py-4">
                  <div className="px-4 py-3">
                    <p className="text-sm text-muted-foreground mb-1">Veículo</p>
                    <p className="font-medium">Onix Prata • ABC-1234</p>
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-sm text-muted-foreground mb-1">Corridas hoje</p>
                    <p className="font-medium">8 corridas • R$ 156,00</p>
                  </div>
                </div>
                <button onClick={onLogout} className="flex items-center gap-3 px-4 py-3 text-red-600 border-t">
                  <LogOut className="w-5 h-5" />
                  <span>Sair</span>
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Verification Status */}
        {!isVerified && (
          <div className="bg-yellow-500/20 border border-yellow-400 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-100">Aguardando Verificação</p>
              <p className="text-sm text-yellow-200/80">
                Seus documentos estão sendo analisados pela Prefeitura. Você será notificado quando aprovado.
              </p>
            </div>
          </div>
        )}

        {/* Availability Toggle */}
        {isVerified && (
          <div
            className={`rounded-xl p-4 flex items-center justify-between ${
              isAvailable ? "bg-green-500" : "bg-white/10"
            } transition-colors`}
          >
            <div className="flex items-center gap-3">
              <Power className={`w-6 h-6 ${isAvailable ? "text-white" : "text-blue-200"}`} />
              <div>
                <p className={`font-semibold ${isAvailable ? "text-white" : "text-blue-100"}`}>
                  {isAvailable ? "Disponível" : "Indisponível"}
                </p>
                <p className={`text-sm ${isAvailable ? "text-green-100" : "text-blue-200"}`}>
                  {isAvailable ? "Recebendo corridas" : "Ative para receber corridas"}
                </p>
              </div>
            </div>
            <Switch checked={isAvailable} onCheckedChange={setIsAvailable} className="data-[state=checked]:bg-white" />
          </div>
        )}
      </div>

      <div className="flex-1 relative min-h-0">
        <LeafletMap
          currentLocation={DRIVER_LOCATION}
          destination={hasRideRequest ? PASSENGER_LOCATION : undefined}
          interactive={false}
        />

        {hasRideRequest && (
          <div className="absolute inset-x-0 bottom-0 bg-background rounded-t-3xl shadow-2xl p-4 animate-in slide-in-from-bottom duration-300">
            {/* Timer */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full border-4 border-blue-600 flex items-center justify-center">
                <span className="text-xl font-bold text-blue-600">{timeLeft}</span>
              </div>
              <div>
                <p className="font-semibold text-lg">Nova Corrida!</p>
                <p className="text-sm text-muted-foreground">segundos para responder</p>
              </div>
            </div>

            {/* Passenger Info */}
            <div className="flex items-center gap-3 mb-4 p-3 bg-muted/50 rounded-xl">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">MS</span>
              </div>
              <div className="flex-1">
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
            <div className="space-y-3 mb-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Origem</p>
                  <p className="font-medium text-sm">Rua Halfeld, 1000 - Centro</p>
                  <p className="text-xs text-blue-600">2,3 km de você</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                  <MapPin className="w-3 h-3 text-red-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Destino</p>
                  <p className="font-medium text-sm">UFJF - Campus Universitário</p>
                </div>
              </div>
            </div>

            {/* Trip Stats */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="text-center p-2 bg-muted/50 rounded-xl">
                <Navigation className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                <p className="font-semibold text-sm">5,2 km</p>
                <p className="text-xs text-muted-foreground">Distância</p>
              </div>
              <div className="text-center p-2 bg-muted/50 rounded-xl">
                <Clock className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                <p className="font-semibold text-sm">~12 min</p>
                <p className="text-xs text-muted-foreground">Duração</p>
              </div>
              <div className="text-center p-2 bg-green-100 rounded-xl">
                <p className="text-lg font-bold text-green-600">R$ 14,50</p>
                <p className="text-xs text-green-700">Valor</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={handleDecline}
                className="h-12 text-base border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 bg-transparent"
              >
                <X className="w-4 h-4 mr-2" />
                Recusar
              </Button>
              <Button onClick={handleAccept} className="h-12 text-base bg-green-600 hover:bg-green-700 text-white">
                <Check className="w-4 h-4 mr-2" />
                Aceitar
              </Button>
            </div>
          </div>
        )}

        {/* Stats Overlay - só mostra quando não tem corrida */}
        {isVerified && !hasRideRequest && (
          <div className="absolute bottom-4 left-4 right-4 bg-background rounded-xl shadow-lg p-4">
            <h3 className="font-semibold mb-3">Resumo do dia</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">8</p>
                <p className="text-xs text-muted-foreground">Corridas</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">R$ 156</p>
                <p className="text-xs text-muted-foreground">Faturamento</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">4.9</p>
                <p className="text-xs text-muted-foreground">Avaliação</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Phone, MessageSquare, Share2, Shield, Star, Car } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LeafletMap } from "@/components/ui/leaflet-map"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface PassengerTrackingProps {
  onRideComplete: () => void
  rideData?: {
    origin: string
    originCoords: [number, number]
    destination: string
    destinationCoords: [number, number]
  } | null
}

export function PassengerTracking({ onRideComplete, rideData }: PassengerTrackingProps) {
  const [status, setStatus] = useState<"arriving" | "waiting" | "inProgress">("arriving")
  const [eta, setEta] = useState(5)
  const [showEmergency, setShowEmergency] = useState(false)
  const [showShare, setShowShare] = useState(false)

  // Driver location - starts near pickup, then moves towards destination
  const [driverCoords, setDriverCoords] = useState<[number, number]>(
    rideData ? [rideData.originCoords[0] + 0.002, rideData.originCoords[1] - 0.003] : [-21.7622, -43.352],
  )

  useEffect(() => {
    if (status === "arriving") {
      const interval = setInterval(() => {
        setEta((prev) => {
          if (prev <= 1) {
            setStatus("waiting")
            // Move driver to pickup location
            if (rideData) {
              setDriverCoords(rideData.originCoords)
            }
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [status, rideData])

  useEffect(() => {
    if (status === "waiting") {
      const timeout = setTimeout(() => {
        setStatus("inProgress")
      }, 3000)
      return () => clearTimeout(timeout)
    }
  }, [status])

  useEffect(() => {
    if (status === "inProgress") {
      // Move driver towards destination
      if (rideData) {
        const midLat = (rideData.originCoords[0] + rideData.destinationCoords[0]) / 2
        const midLng = (rideData.originCoords[1] + rideData.destinationCoords[1]) / 2
        setDriverCoords([midLat, midLng])
      }

      const timeout = setTimeout(() => {
        onRideComplete()
      }, 5000)
      return () => clearTimeout(timeout)
    }
  }, [status, rideData, onRideComplete])

  const getStatusText = () => {
    switch (status) {
      case "arriving":
        return `Motorista chegando em ${eta} min`
      case "waiting":
        return "Motorista chegou!"
      case "inProgress":
        return "Viagem em andamento"
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case "arriving":
        return "bg-blue-600"
      case "waiting":
        return "bg-green-600"
      case "inProgress":
        return "bg-blue-600"
    }
  }

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Status Header */}
      <div className={`${getStatusColor()} text-white p-4 pt-12 pb-6 transition-colors duration-300`}>
        <p className="text-sm text-white/80 mb-1">{status === "inProgress" ? "Destino" : "Status"}</p>
        <h1 className="text-xl font-semibold">{getStatusText()}</h1>
        {status === "inProgress" && rideData && <p className="text-sm text-white/80 mt-1">{rideData.destination}</p>}
      </div>

      {/* Map */}
      <div className="flex-1 relative min-h-0">
        <LeafletMap
          showCurrentLocation
          currentLocationCoords={rideData?.originCoords}
          showDriverLocation
          driverCoords={driverCoords}
          showRoute={status === "inProgress"}
          destinationCoords={rideData?.destinationCoords}
          destinationName={rideData?.destination}
        />
      </div>

      {/* Driver Card */}
      <div className="bg-background border-t">
        <div className="p-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-xl font-semibold text-blue-600">JC</span>
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-lg">José Carlos</h2>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span>4.9</span>
                <span className="mx-1">•</span>
                <span>352 corridas</span>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-sm">
                <Car className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">Onix Prata</span>
              </div>
              <p className="text-lg font-bold text-blue-600">ABC-1234</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-4 gap-2">
            <Button variant="outline" className="flex-col h-auto py-3 bg-transparent" onClick={() => {}}>
              <Phone className="w-5 h-5 mb-1" />
              <span className="text-xs">Ligar</span>
            </Button>
            <Button variant="outline" className="flex-col h-auto py-3 bg-transparent" onClick={() => {}}>
              <MessageSquare className="w-5 h-5 mb-1" />
              <span className="text-xs">Mensagem</span>
            </Button>
            <Button
              variant="outline"
              className="flex-col h-auto py-3 bg-transparent"
              onClick={() => setShowShare(true)}
            >
              <Share2 className="w-5 h-5 mb-1" />
              <span className="text-xs">Compartilhar</span>
            </Button>
            <Button
              variant="outline"
              className="flex-col h-auto py-3 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 bg-transparent"
              onClick={() => setShowEmergency(true)}
            >
              <Shield className="w-5 h-5 mb-1" />
              <span className="text-xs">Emergência</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Share Dialog */}
      <Dialog open={showShare} onOpenChange={setShowShare}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Compartilhar Viagem</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Compartilhe os detalhes da sua viagem com familiares ou amigos para que eles acompanhem seu trajeto em
              tempo real.
            </p>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setShowShare(false)}>
              Copiar link de compartilhamento
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Emergency Dialog */}
      <Dialog open={showEmergency} onOpenChange={setShowEmergency}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Contato de Emergência</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Em caso de emergência, você pode acionar rapidamente os serviços de segurança.
            </p>
            <Button variant="destructive" className="w-full" onClick={() => setShowEmergency(false)}>
              Ligar 190 (Polícia)
            </Button>
            <Button variant="outline" className="w-full bg-transparent" onClick={() => setShowEmergency(false)}>
              Ligar 192 (SAMU)
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

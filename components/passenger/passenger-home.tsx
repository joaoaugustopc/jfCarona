"use client"

import { useState } from "react"
import { Menu, LogOut, History } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LeafletMap } from "@/components/ui/leaflet-map"
import { AddressSearch } from "@/components/ui/address-search"

interface PassengerHomeProps {
  onRequestRide: (destination: string, coords?: [number, number]) => void
  onHistory: () => void
  onLogout: () => void
}

const suggestions = [
  { name: "Shopping Independência", coords: [-21.7583, -43.3567] as [number, number] },
  { name: "UFJF - Campus Universitário", coords: [-21.7761, -43.3689] as [number, number] },
  { name: "Rodoviária de Juiz de Fora", coords: [-21.7645, -43.3447] as [number, number] },
  { name: "Hospital Monte Sinai", coords: [-21.7598, -43.3512] as [number, number] },
  { name: "Praça da Estação", coords: [-21.7612, -43.3496] as [number, number] },
  { name: "Aeroporto Regional", coords: [-21.7924, -43.3869] as [number, number] },
]

export function PassengerHome({ onRequestRide, onHistory, onLogout }: PassengerHomeProps) {
  const [destination, setDestination] = useState("")
  const [destinationCoords, setDestinationCoords] = useState<[number, number] | null>(null)
  const [showRoute, setShowRoute] = useState(false)

  const handleAddressSelect = (address: string, lat: number, lng: number) => {
    setDestinationCoords([lat, lng])
    setShowRoute(true)
  }

  const handleMapClick = (lat: number, lng: number, address: string) => {
    setDestination(address.split(",").slice(0, 3).join(","))
    setDestinationCoords([lat, lng])
    setShowRoute(true)
  }

  const handleSuggestionClick = (suggestion: { name: string; coords: [number, number] }) => {
    setDestination(suggestion.name)
    setDestinationCoords(suggestion.coords)
    setShowRoute(true)
  }

  const handleConfirmDestination = () => {
    if (destination && destinationCoords) {
      onRequestRide(destination, destinationCoords)
    }
  }

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 pt-12 pb-6 relative z-20 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-blue-100 text-sm">Olá,</p>
            <h1 className="text-xl font-semibold">Mariana Silva</h1>
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
                    <span className="text-2xl font-semibold text-blue-600">MS</span>
                  </div>
                  <p className="text-center font-semibold">Mariana Silva</p>
                  <p className="text-center text-sm text-muted-foreground">mariana@email.com</p>
                </div>
                <nav className="flex-1 py-4 space-y-1">
                  <button
                    onClick={onHistory}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <History className="w-5 h-5 text-muted-foreground" />
                    <span>Histórico de Corridas</span>
                  </button>
                </nav>
                <button onClick={onLogout} className="flex items-center gap-3 px-4 py-3 text-red-600 border-t">
                  <LogOut className="w-5 h-5" />
                  <span>Sair</span>
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-xl p-4 shadow-lg">
          <div className="flex items-center gap-3 mb-3 pb-3 border-b">
            <div className="w-3 h-3 bg-blue-600 rounded-full" />
            <div>
              <p className="text-xs text-muted-foreground">Sua localização</p>
              <p className="text-foreground font-medium text-sm">Rua Halfeld, 1000 - Centro</p>
            </div>
          </div>
          <AddressSearch
            value={destination}
            onChange={setDestination}
            onSelect={handleAddressSelect}
            placeholder="Para onde você vai?"
          />
        </div>
      </div>

      <div className="flex-1 min-h-0 relative">
        <LeafletMap
          showCurrentLocation
          showRoute={showRoute}
          destinationCoords={destinationCoords}
          destinationName={destination}
          onMapClick={handleMapClick}
        />

        {/* Confirm destination button */}
        {destinationCoords && (
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <button
              onClick={handleConfirmDestination}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold shadow-lg transition-colors"
            >
              Confirmar Destino
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

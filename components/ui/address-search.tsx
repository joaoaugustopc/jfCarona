"use client"

import { useState, useEffect, useRef } from "react"
import { MapPin, Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"

interface AddressResult {
  display_name: string
  lat: string
  lon: string
  place_id: number
}

interface AddressSearchProps {
  value: string
  onChange: (value: string) => void
  onSelect: (address: string, lat: number, lng: number) => void
  placeholder?: string
}

export function AddressSearch({ value, onChange, onSelect, placeholder = "Para onde você vai?" }: AddressSearchProps) {
  const [results, setResults] = useState<AddressResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const searchTimeout = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current)
    }

    if (value.length < 3) {
      setResults([])
      return
    }

    setIsLoading(true)

    // Debounce search
    searchTimeout.current = setTimeout(async () => {
      try {
        // Search in Juiz de Fora area
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}, Juiz de Fora, MG, Brasil&limit=5&addressdetails=1`,
          {
            headers: {
              "Accept-Language": "pt-BR",
            },
          },
        )
        const data: AddressResult[] = await response.json()
        setResults(data)
      } catch (error) {
        console.error("Error searching address:", error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 500)

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current)
      }
    }
  }, [value])

  const handleSelect = (result: AddressResult) => {
    const shortName = result.display_name.split(",").slice(0, 3).join(",")
    onChange(shortName)
    onSelect(shortName, Number.parseFloat(result.lat), Number.parseFloat(result.lon))
    setShowResults(false)
    setResults([])
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-3">
        <MapPin className="w-5 h-5 text-red-500 shrink-0" />
        <Input
          placeholder={placeholder}
          className="border-0 p-0 h-auto text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
            setShowResults(true)
          }}
          onFocus={() => setShowResults(true)}
        />
        {isLoading ? (
          <Loader2 className="w-5 h-5 text-muted-foreground shrink-0 animate-spin" />
        ) : (
          <Search className="w-5 h-5 text-muted-foreground shrink-0" />
        )}
      </div>

      {/* Results dropdown */}
      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl z-50 border overflow-hidden">
          {results.map((result) => (
            <button
              key={result.place_id}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-left"
              onClick={() => handleSelect(result)}
            >
              <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-sm line-clamp-2">{result.display_name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Click outside to close */}
      {showResults && results.length > 0 && (
        <div className="fixed inset-0 z-40" onClick={() => setShowResults(false)} />
      )}
    </div>
  )
}

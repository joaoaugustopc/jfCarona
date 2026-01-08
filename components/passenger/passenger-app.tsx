"use client"

import { useState } from "react"
import { PassengerLogin } from "./passenger-login"
import { PassengerHome } from "./passenger-home"
import { PassengerRideRequest } from "./passenger-ride-request"
import { PassengerWaiting } from "./passenger-waiting"
import { PassengerTracking } from "./passenger-tracking"
import { PassengerRideComplete } from "./passenger-ride-complete"
import { PassengerHistory } from "./passenger-history"

export type PassengerScreen = "login" | "home" | "request" | "waiting" | "tracking" | "complete" | "history"

interface PassengerAppProps {
  onBack: () => void
}

export function PassengerApp({ onBack }: PassengerAppProps) {
  const [screen, setScreen] = useState<PassengerScreen>("login")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [destination, setDestination] = useState("")
  const [destinationCoords, setDestinationCoords] = useState<[number, number] | null>(null)

  // Store ride data to pass through the flow
  const [rideData, setRideData] = useState<{
    origin: string
    originCoords: [number, number]
    destination: string
    destinationCoords: [number, number]
  } | null>(null)

  const handleLogin = () => {
    setIsLoggedIn(true)
    setScreen("home")
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setScreen("login")
  }

  const handleRequestRide = (dest: string, coords?: [number, number]) => {
    setDestination(dest)
    if (coords) {
      setDestinationCoords(coords)
    }
    setScreen("request")
  }

  const handleConfirmRide = (data: {
    origin: string
    originCoords: [number, number]
    destination: string
    destinationCoords: [number, number]
  }) => {
    setRideData(data)
    setScreen("waiting")
  }

  const handleDriverFound = () => {
    setScreen("tracking")
  }

  const handleRideComplete = () => {
    setScreen("complete")
  }

  const handleRateComplete = () => {
    setRideData(null)
    setScreen("home")
  }

  switch (screen) {
    case "login":
      return <PassengerLogin onLogin={handleLogin} onBack={onBack} />
    case "home":
      return (
        <PassengerHome
          onRequestRide={handleRequestRide}
          onHistory={() => setScreen("history")}
          onLogout={handleLogout}
        />
      )
    case "request":
      return (
        <PassengerRideRequest
          destination={destination}
          destinationCoords={destinationCoords}
          onConfirm={handleConfirmRide}
          onBack={() => setScreen("home")}
        />
      )
    case "waiting":
      return (
        <PassengerWaiting onDriverFound={handleDriverFound} onCancel={() => setScreen("home")} rideData={rideData} />
      )
    case "tracking":
      return <PassengerTracking onRideComplete={handleRideComplete} rideData={rideData} />
    case "complete":
      return <PassengerRideComplete onComplete={handleRateComplete} rideData={rideData} />
    case "history":
      return <PassengerHistory onBack={() => setScreen("home")} />
    default:
      return null
  }
}

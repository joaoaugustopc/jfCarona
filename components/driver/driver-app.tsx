"use client"

import { useState } from "react"
import { DriverLogin } from "./driver-login"
import { DriverHome } from "./driver-home"
import { DriverNavigation } from "./driver-navigation"
import { DriverInProgress } from "./driver-in-progress"
import { DriverRatePassenger } from "./driver-rate-passenger"

export type DriverScreen = "login" | "home" | "navigation" | "inProgress" | "rate"

interface DriverAppProps {
  onBack: () => void
}

export function DriverApp({ onBack }: DriverAppProps) {
  const [screen, setScreen] = useState<DriverScreen>("login")
  const [isVerified, setIsVerified] = useState(true)

  const handleLogin = (verified: boolean) => {
    setIsVerified(verified)
    setScreen("home")
  }

  const handleLogout = () => {
    setScreen("login")
  }

  const handleAcceptRide = () => {
    setScreen("navigation")
  }

  const handleArrived = () => {
    setScreen("inProgress")
  }

  const handleFinishRide = () => {
    setScreen("rate")
  }

  const handleRateComplete = () => {
    setScreen("home")
  }

  switch (screen) {
    case "login":
      return <DriverLogin onLogin={handleLogin} onBack={onBack} />
    case "home":
      return <DriverHome isVerified={isVerified} onNewRide={handleAcceptRide} onLogout={handleLogout} />
    case "navigation":
      return <DriverNavigation onArrived={handleArrived} />
    case "inProgress":
      return <DriverInProgress onFinish={handleFinishRide} />
    case "rate":
      return <DriverRatePassenger onComplete={handleRateComplete} />
    default:
      return null
  }
}

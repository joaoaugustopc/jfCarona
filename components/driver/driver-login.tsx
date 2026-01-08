"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Car, Eye, EyeOff, Mail, Lock, User, Phone, FileText, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface DriverLoginProps {
  onLogin: (verified: boolean) => void
  onBack: () => void
}

export function DriverLogin({ onLogin, onBack }: DriverLoginProps) {
  const [isRegistering, setIsRegistering] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    cpf: "",
    cnh: "",
    plate: "",
    model: "",
    color: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isRegistering && step === 1) {
      setStep(2)
    } else if (isRegistering && step === 2) {
      setStep(3)
    } else if (isRegistering && step === 3) {
      // New registration - not verified yet
      onLogin(false)
    } else {
      // Existing login - verified
      onLogin(true)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 pt-12">
        <button
          onClick={() => {
            if (isRegistering && step > 1) {
              setStep(step - 1)
            } else {
              onBack()
            }
          }}
          className="flex items-center gap-2 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar</span>
        </button>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <Car className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Carona JF</h1>
            <p className="text-blue-100 text-sm">Área do Motorista</p>
          </div>
        </div>
      </div>

      {/* Progress Steps (Registration) */}
      {isRegistering && (
        <div className="px-6 pt-4">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    s <= step ? "bg-blue-600 text-white" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {s}
                </div>
                {s < 3 && <div className={`w-20 h-1 mx-2 ${s < step ? "bg-blue-600" : "bg-muted"}`} />}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Dados pessoais</span>
            <span>Veículo</span>
            <span>Documentos</span>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          {isRegistering ? (step === 1 ? "Dados Pessoais" : step === 2 ? "Dados do Veículo" : "Documentos") : "Entrar"}
        </h2>
        <p className="text-muted-foreground mb-6">
          {isRegistering
            ? step === 1
              ? "Informe seus dados pessoais"
              : step === 2
                ? "Informe os dados do seu veículo"
                : "Envie seus documentos para verificação"
            : "Entre com suas credenciais"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isRegistering && (
            <>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </>
          )}

          {isRegistering && step === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="Seu nome"
                    className="pl-10"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="cpf"
                    placeholder="000.000.000-00"
                    className="pl-10"
                    value={formData.cpf}
                    onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="phone"
                    placeholder="(32) 99999-9999"
                    className="pl-10"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </>
          )}

          {isRegistering && step === 2 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="cnh">CNH</Label>
                <Input
                  id="cnh"
                  placeholder="00000000000"
                  value={formData.cnh}
                  onChange={(e) => setFormData({ ...formData, cnh: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="plate">Placa do veículo</Label>
                <Input
                  id="plate"
                  placeholder="ABC-1234"
                  value={formData.plate}
                  onChange={(e) => setFormData({ ...formData, plate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Modelo do veículo</Label>
                <Input
                  id="model"
                  placeholder="Ex: Onix 2023"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Cor do veículo</Label>
                <Input
                  id="color"
                  placeholder="Ex: Prata"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                />
              </div>
            </>
          )}

          {isRegistering && step === 3 && (
            <>
              <div className="space-y-4">
                <div className="border-2 border-dashed rounded-xl p-6 text-center">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="font-medium mb-1">Foto da CNH</p>
                  <p className="text-sm text-muted-foreground mb-3">Frente e verso do documento</p>
                  <Button type="button" variant="outline" size="sm">
                    Selecionar arquivo
                  </Button>
                </div>

                <div className="border-2 border-dashed rounded-xl p-6 text-center">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="font-medium mb-1">CRLV do Veículo</p>
                  <p className="text-sm text-muted-foreground mb-3">Documento do veículo</p>
                  <Button type="button" variant="outline" size="sm">
                    Selecionar arquivo
                  </Button>
                </div>

                <div className="border-2 border-dashed rounded-xl p-6 text-center">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="font-medium mb-1">Foto do Veículo</p>
                  <p className="text-sm text-muted-foreground mb-3">Foto do carro completo</p>
                  <Button type="button" variant="outline" size="sm">
                    Selecionar arquivo
                  </Button>
                </div>
              </div>
            </>
          )}

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            {isRegistering ? (step < 3 ? "Continuar" : "Enviar Cadastro") : "Entrar"}
          </Button>
        </form>

        {!isRegistering && (
          <div className="mt-6 text-center">
            <button onClick={() => setIsRegistering(true)} className="text-blue-600 font-medium">
              Não tem conta? Cadastre-se como motorista
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Map } from 'leaflet'
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'

const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
)
const useMapEvents = dynamic(
  () => import('react-leaflet').then((mod) => mod.useMapEvents),
  { ssr: false }
)

function DraggableMarker({ position, setPosition }: { position: { lat: number, lng: number }, setPosition: (pos: { lat: number, lng: number }) => void }) {
  const mapRef = useRef<Map | null>(null)

  useEffect(() => {
    if (mapRef.current && mapRef.current.flyTo) {
      mapRef.current.flyTo(position, mapRef.current.getZoom())
    }
  }, [position])

  const map = useMapEvents({
    click() {
      map.locate()
    },
    locationfound(e) {
      setPosition(e.latlng)
      if (mapRef.current) {
        mapRef.current.flyTo(e.latlng, mapRef.current.getZoom())
      }
    },
  })

  return (
    <Marker
      draggable
      position={position}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target
          const newPos = marker.getLatLng()
          setPosition(newPos)
        },
      }}
    />
  )
}

export default function StoreSignUp() {
  const [position, setPosition] = useState({ lat: -23.55052, lng: -46.633309 }) // São Paulo

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Loja cadastrada!', { position })
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Cadastro de Loja</CardTitle>
          <CardDescription>Crie sua conta para começar a vender no Compra Barato</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="storeName">Nome da Loja</Label>
                <Input id="storeName" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" required />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input id="confirmPassword" type="password" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Localização</Label>
              <div className="h-[300px] rounded-md overflow-hidden">
                <MapContainer
                  center={[position.lat, position.lng]}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                  whenCreated={(mapInstance) => { mapRef.current = mapInstance }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
                  <DraggableMarker position={position} setPosition={setPosition} />
                </MapContainer>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Arraste o marcador para selecionar a localização da sua loja
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="storeType">Tipo de Loja</Label>
                <Select>
                  <SelectTrigger id="storeType">
                    <SelectValue placeholder="Selecione o tipo de loja" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="supermarket">Supermercado</SelectItem>
                    <SelectItem value="electronics">Eletrônicos</SelectItem>
                    <SelectItem value="clothing">Roupas</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" type="tel" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição da Loja</Label>
              <Textarea id="description" />
            </div>
            <Button type="submit">Cadastrar Loja</Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Já tem uma conta? <a href="/login" className="text-primary hover:underline">Faça login</a>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

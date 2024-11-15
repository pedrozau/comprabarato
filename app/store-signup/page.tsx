'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { MapPin } from 'lucide-react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import 'leaflet/dist/leaflet.css'
import { useMap } from 'react-leaflet'
import { useMapEvents } from 'react-leaflet'

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

interface DraggableMarkerProps {
  position: { lat: number; lng: number };
  setPosition: (position: { lat: number; lng: number }) => void;
}

function DraggableMarker({ position, setPosition }: DraggableMarkerProps) {
  const map = useMap()

  useMapEvents({
    click() {
      map.locate()
    },
    locationfound(e) {
      setPosition(e.latlng)
      map.flyTo(e.latlng, map.getZoom())
    },
  })

  useEffect(() => {
    map.flyTo(position, map.getZoom())
  }, [map, position])

  return (
    <Marker
      draggable={true}
      position={position}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target
          const position = marker.getLatLng()
          setPosition(position)
        },
      }}
    />
  )
}

export default function StoreSignUp() {
  const [position, setPosition] = useState({ lat: -8.838333, lng: 13.234444 }) // Luanda, Angola

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui você implementaria a lógica para enviar os dados da loja para o backend
    console.log('Loja cadastrada!', { position })
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
        <div className="w-full lg:w-1/2 max-w-2xl">
          <Image
            src="/Ecommerce-campaign.gif"
            alt="Ilustração de cadastro de loja"
            width={600}
            height={600}
            className="rounded-lg shadow-lg"
          />
        </div>
        <Card className="w-full lg:w-1/2 max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Cadastro de Loja</CardTitle>
            <CardDescription>Crie sua conta para começar a vender no Compra Barato</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Nome da Loja</Label>
                  <Input id="storeName" required className="w-full" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" type="email" required className="w-full" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input id="password" type="password" required className="w-full" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <Input id="confirmPassword" type="password" required className="w-full" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Localização</Label>
                <div className="h-[200px] rounded-md overflow-hidden border border-input">
                  <MapContainer
                    center={[position.lat, position.lng]}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
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
                  <Label htmlFor="province">Província</Label>
                  <Select>
                    <SelectTrigger id="province">
                      <SelectValue placeholder="Selecione a província" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="luanda">Luanda</SelectItem>
                      <SelectItem value="benguela">Benguela</SelectItem>
                      <SelectItem value="huambo">Huambo</SelectItem>
                      <SelectItem value="huila">Huíla</SelectItem>
                      <SelectItem value="cabinda">Cabinda</SelectItem>
                      <SelectItem value="other">Outra</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" type="tel" required className="w-full" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição da Loja</Label>
                  <Textarea id="description" className="w-full" />
                </div>
              </div>
              <Button type="submit" className="w-full">Cadastrar Loja</Button>
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              Já tem uma conta? <a href="/login" className="text-primary hover:underline">Faça login</a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
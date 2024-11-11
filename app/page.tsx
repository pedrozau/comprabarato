'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link'
import {
  Search,
  MapPin,
  Phone,
  MessageSquare,
  SlidersHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import dynamic from 'next/dynamic';

const StoreMap = dynamic(() => import('./store-map'), { ssr: false });

// Simulated product data
const allProducts = [
  {
    id: 1,
    name: 'Smartphone XYZ',
    price: 999.99,
    store: 'Loja A',
    distance: 0.5,
    lat: -23.55052,
    lng: -46.633308,
    image:
      'data:image/jpeg;base64,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',
    phone: '+55 11 1234-5678',
    city: 'São Paulo',
  },
  {
    id: 2,
    name: 'Laptop ABC',
    price: 3499.99,
    store: 'Loja B',
    distance: 1.2,
    lat: -23.55782,
    lng: -46.640309,
    image: '/placeholder.svg?height=200&width=200',
    phone: '+55 11 2345-6789',
    city: 'Rio de Janeiro',
  },
  {
    id: 3,
    name: 'Tablet 123',
    price: 1299.99,
    store: 'Loja C',
    distance: 0.8,
    lat: -23.55399,
    lng: -46.631805,
    image: '/placeholder.svg?height=200&width=200',
    phone: '+55 11 3456-7890',
    city: 'São Paulo',
  },
  {
    id: 4,
    name: 'Smartwatch Pro',
    price: 599.99,
    store: 'Loja D',
    distance: 1.5,
    lat: -23.561234,
    lng: -46.655432,
    image: '/placeholder.svg?height=200&width=200',
    phone: '+55 11 4567-8901',
    city: 'Belo Horizonte',
  },
  {
    id: 5,
    name: 'Câmera DSLR',
    price: 2799.99,
    store: 'Loja E',
    distance: 2.0,
    lat: -23.549876,
    lng: -46.629876,
    image: '/placeholder.svg?height=200&width=200',
    phone: '+55 11 5678-9012',
    city: 'Curitiba',
  },
];

export default function CompraBarat() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('price');
  const [priceRange, setPriceRange] = useState([0, 4000]);
  const [selectedCity, setSelectedCity] = useState('Todas');
  const [products, setProducts] = useState(allProducts);

  const cities = [
    'Todas',
    ...new Set(allProducts.map((product) => product.city)),
  ];

  useEffect(() => {
    const filtered = allProducts.filter(
      (product) =>
        (selectedCity === 'Todas' || product.city === selectedCity) &&
        product.price >= priceRange[0] &&
        product.price <= priceRange[1] &&
        (searchQuery === '' ||
          product.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    const sorted = [...filtered].sort((a, b) =>
      sortBy === 'price' ? a.price - b.price : a.distance - b.distance
    );
    setProducts(sorted);
  }, [searchQuery, sortBy, priceRange, selectedCity]);

  const userLocation: [number, number] = [-23.55577, -46.63968]; // Example user location

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Compra Barato</h1>
          <nav>
            <Button variant="ghost"><Link href="store-login">Login</Link></Button>           
            <Button variant="ghost"><Link href="/faq">FAQ</Link></Button>
            <Button variant="ghost"><Link href="/store-signup">Registrar Loja</Link></Button>
            <Button variant="ghost"><Link href="/about">Sobre Nós</Link></Button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Compare preços e encontre as melhores ofertas perto de você!
          </h2>
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex-grow">
              <Input
                type="text"
                placeholder="Digite o nome do produto"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecione a cidade" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <SlidersHorizontal className="mr-2 h-4 w-4" /> Filtrar Preço
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Faixa de Preço</h4>
                    <p className="text-sm text-muted-foreground">
                      R$ {priceRange[0]} - R$ {priceRange[1]}
                    </p>
                  </div>
                  <Slider
                    min={0}
                    max={4000}
                    step={100}
                    value={priceRange}
                    onValueChange={setPriceRange}
                  />
                </div>
              </PopoverContent>
            </Popover>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price">Menor Preço</SelectItem>
                <SelectItem value="distance">Mais Próximo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Card key={product.id}>
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>
                    {product.store} - {product.city}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-square relative mb-4">
                    <Image
                      src={product.image}
                      alt={product.name}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-md"
                    />
                  </div>
                  <p className="text-2xl font-bold">
                    R$ {product.price.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center mt-2">
                    <MapPin className="mr-1 h-4 w-4" /> {product.distance} km de
                    distância
                  </p>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                  <div className="flex justify-between w-full">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          <MapPin className="mr-2 h-4 w-4" /> Ver no Mapa
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[800px]">
                        <DialogHeader>
                          <DialogTitle>Localização da Loja</DialogTitle>
                          <DialogDescription>
                            Veja a localização da loja no mapa
                          </DialogDescription>
                        </DialogHeader>
                        <StoreMap
                          stores={[
                            {
                              id: product.id,
                              name: product.store,
                              lat: product.lat,
                              lng: product.lng,
                              address: 'Endereço da loja',
                            },
                          ]}
                          userLocation={userLocation}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="flex justify-between w-full space-x-2">
                    <Button
                      as="a"
                      href={`tel:${product.phone}`}
                      className="flex-1"
                    >
                      <Phone className="mr-2 h-4 w-4" /> Ligar
                    </Button>
                    <Button
                      as="a"
                      href={`sms:${product.phone}`}
                      className="flex-1"
                    >
                      <MessageSquare className="mr-2 h-4 w-4" /> Mensagem
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <footer className="bg-white shadow mt-8">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <p>&copy; 2023 Compra Barato. Todos os direitos reservados.</p>
          <div className="flex space-x-4">
            <Button variant="ghost" size="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-facebook"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </Button>
            <Button variant="ghost" size="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-twitter"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
            </Button>
            <Button variant="ghost" size="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-instagram"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}

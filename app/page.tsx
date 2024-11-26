'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link'
import {
  Search,
  MapPin,
  Phone,
  MessageSquare,
  SlidersHorizontal,
  Menu,
  X,
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
import InfiniteScroll from 'react-infinite-scroll-component';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { supabase } from '@/lib/supabaseClient';

const StoreMap = dynamic(() => import('./store-map'), { 
  ssr: false,
  loading: () => <p>Carregando mapa...</p>
});

const generateRandomPrice = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const generateRandomCoordinates = (baseLocation: { lat: number, lng: number }, radiusKm: number) => {
  const earthRadius = 6371; // raio da Terra em km
  const maxLat = baseLocation.lat + (radiusKm / earthRadius) * (180 / Math.PI);
  const minLat = baseLocation.lat - (radiusKm / earthRadius) * (180 / Math.PI);
  const maxLng = baseLocation.lng + (radiusKm / earthRadius) * (180 / Math.PI) / Math.cos(baseLocation.lat * Math.PI / 180);
  const minLng = baseLocation.lng - (radiusKm / earthRadius) * (180 / Math.PI) / Math.cos(baseLocation.lat * Math.PI / 180);
  
  return {
    lat: minLat + Math.random() * (maxLat - minLat),
    lng: minLng + Math.random() * (maxLng - minLng)
  };
};



export default function CompraBarat() {
  const [products, setProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('price');
  const [priceRange, setPriceRange] = useState([0, 1500000]);
  const [selectedCity, setSelectedCity] = useState('Todas');
  const [isLoading, setIsLoading] = useState(true);
  const [visibleProducts, setVisibleProducts] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const productsPerPage = 12;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data: products, error } = await supabase
        .from('products')
        .select(`
          *,
          stores (
            id,
            name,
            email,
            province,
            store_type,
            phone,
            description,
            latitude,
            longitude
          )
        `);

      if (error) {
        console.error('Erro ao buscar produtos:', error);
      } else {
        setProducts(products);
      }
      setIsLoading(false);
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Erro ao obter localização do usuário:", error);
        }
      );
    } else {
      console.error("Geolocalização não é suportada pelo navegador.");
    }
  }, []);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const toRadians = (degree: number) => (degree * Math.PI) / 180;

    const R = 6371; // Raio da Terra em km
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distância em km
  };

  const productsWithDistance = useMemo(() => {
    if (!userLocation) return products;

    return products.map(product => {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lon,
        product.stores.latitude,
        product.stores.longitude
      );
      return { ...product, distance };
    });
  }, [products, userLocation]);

  const filteredProducts = useMemo(() => {
    return productsWithDistance.filter(
      (product) =>
        (selectedCity === 'Todas' || product.stores.province === selectedCity) &&
        product.price >= priceRange[0] &&
        product.price <= priceRange[1] &&
        (searchQuery === '' ||
          product.name.toLowerCase().includes(searchQuery.toLowerCase()))
    ).sort((a, b) => a.distance - b.distance);
  }, [productsWithDistance, searchQuery, priceRange, selectedCity]);

  useEffect(() => {
    const initialProducts = filteredProducts.slice(0, productsPerPage);
    setVisibleProducts(initialProducts);
    setPage(1);
    setHasMore(filteredProducts.length > productsPerPage);
  }, [searchQuery, sortBy, priceRange, selectedCity, filteredProducts, productsPerPage]);

  const fetchMoreData = () => {
    const startIndex = visibleProducts.length;
    const endIndex = startIndex + productsPerPage;
    const nextProducts = filteredProducts.slice(startIndex, endIndex);

    if (nextProducts.length > 0) {
      setVisibleProducts(prev => [...prev, ...nextProducts]);
      setPage(prev => prev + 1);
    }
    
    setHasMore(endIndex < filteredProducts.length);
  };

  const cities = useMemo(() => {
    return ['Todas', ...Array.from(new Set(products.map((product) => product.stores.province)))];
  }, [products]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Compra Barato</h1>
          
          {/* Menu Mobile */}
          <div className="flex items-center gap-2 md:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsSearchModalOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Menu Desktop */}
          <nav className="hidden md:flex space-x-2">
            <Button variant="ghost"><Link href="store-login">Login</Link></Button>           
            <Button variant="ghost"><Link href="/faq">FAQ</Link></Button>
            <Button variant="ghost"><Link href="/store-signup">Registrar Loja</Link></Button>
            <Button variant="ghost"><Link href="/about">Sobre Nós</Link></Button>
          </nav>
        </div>

        {/* Menu Mobile Dropdown - Adicione absolute para sobrepor o conteúdo */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white absolute w-full shadow-lg">
            <div className="flex flex-col space-y-2 p-4">
              <Link href="store-login" className="w-full">
                <Button variant="ghost" className="w-full justify-start">Login</Button>
              </Link>
              <Link href="/faq" className="w-full">
                <Button variant="ghost" className="w-full justify-start">FAQ</Button>
              </Link>
              <Link href="/store-signup" className="w-full">
                <Button variant="ghost" className="w-full justify-start">Registrar Loja</Button>
              </Link>
              <Link href="/about" className="w-full">
                <Button variant="ghost" className="w-full justify-start">Sobre Nós</Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 md:pt-0 pt-4">
        {/* Barra de pesquisa desktop */}
        <div className="hidden md:block px-4 py-6 sm:px-0">
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
                <SelectValue placeholder="Todas as cidades" />
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
                      Kz {priceRange[0].toLocaleString()} - Kz {priceRange[1].toLocaleString()}
                    </p>
                  </div>
                  <Slider
                    min={0}
                    max={1500000}
                    step={10000}
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
        </div>

        {/* Modal de pesquisa mobile */}
        <Dialog open={isSearchModalOpen} onOpenChange={setIsSearchModalOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Filtros de Pesquisa</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <Input
                type="text"
                placeholder="Digite o nome do produto"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as cidades" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="space-y-2">
                <Label>Faixa de Preço</Label>
                <p className="text-sm text-muted-foreground">
                  Kz {priceRange[0].toLocaleString()} - Kz {priceRange[1].toLocaleString()}
                </p>
                <Slider
                  min={0}
                  max={1500000}
                  step={10000}
                  value={priceRange}
                  onValueChange={setPriceRange}
                />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price">Menor Preço</SelectItem>
                  <SelectItem value="distance">Mais Próximo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </DialogContent>
        </Dialog>

        {/* Grid de produtos com cards menores */}
        <InfiniteScroll
          dataLength={visibleProducts.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<div className="flex justify-center p-4"><p>Carregando mais produtos...</p></div>}
        >
          <div className="grid grid-cols-2 gap-2 px-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-4 sm:px-0">
            {visibleProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <CardHeader className="p-3">
                  <CardTitle className="text-sm sm:text-base">{product.name}</CardTitle>
                  <CardDescription className="text-xs">
                    {product.stores.name} - {product.stores.province}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="aspect-square relative mb-2">
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-md"
                    />
                  </div>
                  <p className="text-lg font-bold">
                    Kz {product.price.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center mt-1">
                    <MapPin className="mr-1 h-3 w-3" /> {product.distance} km
                  </p>
                </CardContent>
                <CardFooter className="p-3 flex flex-col gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full">
                        <MapPin className="mr-1 h-3 w-3" /> Ver Mapa
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[800px] h-[500px]">
                      <DialogHeader>
                        <DialogTitle>Localização da Loja</DialogTitle>
                        <DialogDescription>
                          Veja a localização da loja no mapa
                        </DialogDescription>
                      </DialogHeader>
                      <div className="h-[400px] w-full">
                        <StoreMap
                          stores={[
                            {
                              id: product.stores.id,
                              name: product.stores.name,
                              lat: product.stores.latitude,
                              lng: product.stores.longitude,
                              address: 'Endereço da loja',
                            },
                          ]}
                          userLocation={userLocation ? [userLocation.lat, userLocation.lon] : [0, 0]}
                          setLocation={() => {}}
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                  <div className="flex gap-2">
                    <a href={`tel:${product.stores.phone}`} className="flex-1">
                      <Button size="sm" className="w-full">
                        <Phone className="h-3 w-3" />
                      </Button>
                    </a>
                    <a href={`sms:${product.stores.phone}`} className="flex-1">
                      <Button size="sm" className="w-full">
                        <MessageSquare className="h-3 w-3" />
                      </Button>
                    </a>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </InfiniteScroll>
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
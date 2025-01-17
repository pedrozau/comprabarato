'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link'
import { Search, MapPin, Phone, MessageSquare, SlidersHorizontal, Menu, X } from 'lucide-react';
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
import { Slider as UISlider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import dynamic from 'next/dynamic';
import InfiniteScroll from 'react-infinite-scroll-component';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { supabase } from '@/lib/supabaseClient';
import { Skeleton } from '@/components/ui/skeleton';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const StoreMap = dynamic(() => import('./store-map'), { 
  ssr: false,
  loading: () => <p>Carregando mapa...</p>
});

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};



const whatsappMessageLink  = (produt: string,) => {
    return 'Olá! Vi seu produto no Compra Barato, estou interessado em comprar o produto ' + produt + ' e gostaria de saber mais informações.';
}


const formatDistance = (distanceInMeters: number): string => {
  if (distanceInMeters < 1000) {
    return `${Math.round(distanceInMeters)} m`;
  } else {
    return `${(distanceInMeters / 1000).toFixed(1)} km`;
  }
};

export default function CompraBarat() {
  const [products, setProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('distance');
  const [priceRange, setPriceRange] = useState([0, 9000000]);
  const [selectedCity, setSelectedCity] = useState('Todas');
  const [isLoading, setIsLoading] = useState(true);
  const [visibleProducts, setVisibleProducts] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const productsPerPage = 12;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Erro ao obter localização do usuário:", error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 27000
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    const detectKeyboard = () => {
      if (window.innerHeight < window.outerHeight) {
        setIsKeyboardOpen(true);
      } else {
        setIsKeyboardOpen(false);
      }
    };

    window.addEventListener('resize', detectKeyboard);
    return () => window.removeEventListener('resize', detectKeyboard);
  }, []);

  const productsWithDistance = useMemo(() => {
    if (!userLocation) return products;

    return products.map(product => {
      const distanceInMeters = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        product.stores.latitude,
        product.stores.longitude
      );
      return {
        ...product,
        distance: formatDistance(distanceInMeters),
        distanceValue: distanceInMeters
      };
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
    ).sort((a, b) => {
      if (sortBy === 'price') {
        return a.price - b.price;
      }
      return a.distanceValue - b.distanceValue;
    });
  }, [productsWithDistance, searchQuery, priceRange, selectedCity, sortBy]);

  useEffect(() => {
    const initialProducts = filteredProducts.slice(0, productsPerPage);
    setVisibleProducts(initialProducts);
    setPage(1);
    setHasMore(filteredProducts.length > productsPerPage);
  }, [searchQuery, sortBy, priceRange, selectedCity, filteredProducts]);

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
          <svg
            width="150"
            height="50"
            viewBox="0 0 160 50"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#FF5733", stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: "#FFC300", stopOpacity: 1 }} />
              </linearGradient>
              <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#DAF7A6", stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: "#33FF57", stopOpacity: 1 }} />
              </linearGradient>
            </defs>

            <circle cx="25" cy="25" r="20" fill="url(#grad1)" />

            <path
              d="M15 20 L20 20 L22 30 L35 30 L37 25 L20 25"
              fill="none"
              stroke="#fff"
              strokeWidth="1.5"
            />
            <circle cx="25" cy="35" r="2" fill="#fff" />
            <circle cx="32" cy="35" r="2" fill="#fff" />

            <text
              x="55"
              y="30"
              fontFamily="Verdana, sans-serif"
              fontSize="14"
              fill="#1E3A8A"
              style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)" }}
            >
              Compra Barato
            </text>
          </svg>
          
          {/* Menu Mobile */}
          <div className="flex items-center gap-2 md:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsSearchModalOpen(true)}
              className="text-blue-500"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-blue-500"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Menu Desktop */}
          <nav className="hidden md:flex space-x-2">
            <Button variant="ghost" className="text-blue-500"><Link href="https://lojacomprabarato.vercel.app/#login">Login</Link></Button>           
            <Button variant="ghost" className="text-blue-500"><Link href="/faq">FAQ</Link></Button>
            <Button variant="ghost" className="text-blue-500"><Link href="https://lojacomprabarato.vercel.app/register">Registrar Loja</Link></Button>
            <Button variant="ghost" className="text-blue-500"><Link href="/about">Sobre Nós</Link></Button>
          </nav>
        </div>

        {/* Menu Mobile Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white absolute w-full shadow-lg">
            <div className="flex flex-col space-y-2 p-4">
              <Link href="store-login" className="w-full">
                <Button variant="ghost" className="w-full justify-start text-blue-500">Login</Button>
              </Link>
              <Link href="/faq" className="w-full">
                <Button variant="ghost" className="w-full justify-start text-blue-500">FAQ</Button>
              </Link>
              <Link href="https://loja-comparabarato.vercel.app/register" className="w-full">
                <Button variant="ghost" className="w-full justify-start text-blue-500">Registrar Loja</Button>
              </Link>
              <Link href="/about" className="w-full">
                <Button variant="ghost" className="w-full justify-start text-blue-500">Sobre Nós</Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 md:pt-0 pt-4">
        {/* Barra de pesquisa desktop */}
        <div className="hidden md:block px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-semibold text-blue-900 mb-4">
            Compare preços e encontre as melhores ofertas perto de você!
          </h2>
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex-grow">
              <Input
                type="text"
                placeholder="Digite o nome do produto"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-2 border-blue-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-blue-50 text-blue-900 placeholder-blue-400"
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
                <Button variant="outline" className="text-blue-500 border-blue-500">
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
                  <UISlider
                    min={0}
                    max={9000000}
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
          <DialogContent 
            className={`sm:max-w-[600px] ${isKeyboardOpen ? 'absolute top-0 left-0 right-0' : ''}`}
          >
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
                <UISlider
                  min={0}
                  max={9000000}
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

        {/* Verificação de produtos filtrados */}
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Image
              src="/Questions-cuate.svg"
              alt="Nenhum produto encontrado"
              width={200}
              height={200}
              className="mb-4"
            />
            <p className="md:text-lg text-center text-gray-700">Nenhum produto encontrado. Tente ajustar seus filtros ou pesquisar por outro termo.</p>
          </div>
        ) : (
          <InfiniteScroll
            dataLength={visibleProducts.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<div className="flex justify-center p-4"><p>Carregando mais produtos...</p></div>}
          >
            <div className="grid grid-cols-2 gap-2 px-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-4 sm:px-0">
              {visibleProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <CardHeader className="p-3 bg-blue-50">
                    <CardTitle className="text-sm sm:text-base text-blue-900">{product.name}</CardTitle>
                    <CardDescription className="text-xs text-blue-700">
                      {product.stores.name} - {product.stores.province}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-3">
                    <Slider {...{ dots: true, infinite: true, speed: 500, slidesToShow: 1, slidesToScroll: 1 }}>
                      {product.image_urls.map((url: string, index: number) => (
                        <div key={index} className="aspect-square relative">
                          <Image
                            src={url}
                            alt={`${product.name} image ${index + 1}`}
                            layout="fill"
                            objectFit="contain"
                            quality={100}
                            priority={index === 0}
                            className="rounded-md cursor-pointer"
                            onClick={() => setSelectedImage(url)}
                          />
                        </div>
                      ))}
                    </Slider>
                    <p className="text-lg mt-5 font-bold text-orange-600">
                      Kz {product.price.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center mt-1">
                      <MapPin className="mr-1 h-3 w-3" /> {product.distance}
                    </p>
                  </CardContent>
                  <CardFooter className="p-3 flex flex-col gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full text-blue-500 border-blue-500">
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
                            userLocation={userLocation ? [userLocation.latitude, userLocation.longitude] : [0, 0]}
                            setLocation={() => {}}
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                    <div className="flex gap-2">
                      <a href={`tel:${product.stores.phone}`} className="flex-1">
                        <Button size="sm" className="w-full text-blue-500 border-blue-500">
                          <Phone className="h-3 w-3" />
                        </Button>
                      </a>
                      <a href={`https://wa.me/${product.stores.phone}?text=${encodeURIComponent(whatsappMessageLink(product.name))}`} className="flex-1">
                        <Button size="sm" className="w-full text-blue-500 border-blue-500">
                          <MessageSquare className="h-3 w-3" />
                        </Button>
                      </a>
                    </div>
                  </CardFooter>
                </Card>
              ))}

              {/* Skeleton para carregamento */}
              {isLoading && Array.from({ length: productsPerPage }).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader className="p-3 bg-blue-50">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2" />
                  </CardHeader>
                  <CardContent className="p-3">
                    <Skeleton className="aspect-square mb-2" />
                    <Skeleton className="h-5 w-1/2 mb-1" />
                    <Skeleton className="h-3 w-1/3" />
                  </CardContent>
                  <CardFooter className="p-3 flex flex-col gap-2">
                    <Skeleton className="h-8 w-full mb-2" />
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-1/2" />
                      <Skeleton className="h-8 w-1/2" />
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </InfiniteScroll>
        )}
      </main>

      <footer className="bg-white shadow mt-8">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <p className="text-blue-900">&copy; 2023 Compra Barato. Todos os direitos reservados.</p>
          <div className="flex space-x-4">
            <Button variant="ghost" size="icon" className="text-blue-500">
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
            <Button variant="ghost" size="icon" className="text-blue-500">
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
            <Button variant="ghost" size="icon" className="text-blue-500">
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

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Imagem em Destaque</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="relative w-full h-[400px]">
              <Image
                src={selectedImage}
                alt="Imagem em destaque"
                layout="fill"
                objectFit="contain"
                quality={100}
                className="rounded-md"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}


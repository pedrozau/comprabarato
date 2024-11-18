'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Clock, Phone, Trash2, Edit, User, Mail, BarChart, Bell, Search, LogOut, Menu, Package } from 'lucide-react';
import Image from 'next/image';

// Dados simulados de produtos
const initialProducts = [
  {
    id: 1,
    name: 'Smartphone XYZ',
    price: 999.99,
    stock: 50,
    image: '/placeholder.svg?height=100&width=100',
    category: 'Eletrônicos',
    description: 'Um smartphone avançado com ótima câmera.',
  },
  {
    id: 2,
    name: 'Laptop ABC',
    price: 1499.99,
    stock: 30,
    image: '/placeholder.svg?height=100&width=100',
    category: 'Eletrônicos',
    description: 'Laptop potente para trabalho e jogos.',
  },
  {
    id: 3,
    name: 'Tablet 123',
    price: 399.99,
    stock: 100,
    image: '/placeholder.svg?height=100&width=100',
    category: 'Eletrônicos',
    description: 'Tablet leve e portátil para entretenimento.',
  },
];

// Dados simulados do perfil do usuário
const initialProfile = {
  name: 'João da Silva',
  email: 'joao@example.com',
  phone: '(11) 98765-4321',
  address: 'Rua das Flores, 123 - São Paulo, SP',
};

// Adicionar novos dados simulados
const metricsData = {
  totalProdutos: 150,
  totalVisualizacoes: 1500,
  totalUsuarios: 45,
};

export default function StoreDashboard() {
  const [products, setProducts] = useState(initialProducts);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: '',
    image: null as File | null,
    description: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profile, setProfile] = useState(initialProfile);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editingProduct, setEditingProduct] = useState<typeof initialProducts[0] | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditingProduct(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleCategoryChange = (value: string) => {
    setNewProduct({ ...newProduct, category: value });
  };

  const handleEditCategoryChange = (value: string) => {
    setEditingProduct(prev => prev ? { ...prev, category: value } : null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewProduct({ ...newProduct, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProductWithId = {
      ...newProduct,
      id: products.length + 1,
      price: parseFloat(newProduct.price),
      stock: 0,
      image: imagePreview || '/placeholder.svg?height=100&width=100',
    };
    setProducts([...products, newProductWithId]);
    setNewProduct({ name: '', price: '', category: '', image: null, description: '' });
    setImagePreview(null);
    setIsModalOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
      setEditingProduct(null);
      setIsEditModalOpen(false);
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditingProfile(false);
    // Aqui você implementaria a lógica para salvar as alterações do perfil no backend
    console.log('Perfil atualizado:', profile);
  };

  const openEditModal = (product: typeof initialProducts[0]) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className={`bg-primary text-white ${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300`}>
        <div className="p-4">
          <div className="flex justify-between items-center">
            <h2 className={`font-bold ${!sidebarOpen && 'hidden'}`}>Compra Barato</h2>
            <Button variant="ghost" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
          <div className="mt-6 space-y-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={() =>(document.querySelector('[value="products"]') as HTMLElement)?.click()}
            >
              <Package className="h-5 w-5 mr-2" />
              {sidebarOpen && <span>Produtos</span>}
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => (document.querySelector('[value="info"]') as HTMLElement)?.click()}
            >
              <MapPin className="h-5 w-5 mr-2" />
              {sidebarOpen && <span>Loja</span>}
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => (document.querySelector('[value="profile"]') as HTMLElement)?.click()}
            >
              <User className="h-5 w-5 mr-2" />
              {sidebarOpen && <span>Usuário</span>}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b p-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar..."
                className="pl-10 w-64"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Conteúdo principal */}
        <main className="p-6">
          {/* Cards de métricas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Produtos</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metricsData.totalProdutos}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Visualizações</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metricsData.totalVisualizacoes}</div>
              </CardContent>
            </Card>
            
            {/* ... outros cards de métricas ... */}
          </div>

          {/* Gráfico */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Produtos Mais Vistos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {/* Adicione aqui sua biblioteca de gráficos preferida */}
              </div>
            </CardContent>
          </Card>

          {/* Resto do conteúdo existente */}
         

          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Editar Produto</DialogTitle>
                <DialogDescription>
                  Atualize os detalhes do produto abaixo.
                </DialogDescription>
              </DialogHeader>
              {editingProduct && (
                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Nome do Produto</Label>
                    <Input
                      id="edit-name"
                      name="name"
                      value={editingProduct.name}
                      onChange={handleEditInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-price">Preço (R$)</Label>
                    <Input
                      id="edit-price"
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={editingProduct.price}
                      onChange={handleEditInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-category">Categoria</Label>
                    <Select onValueChange={handleEditCategoryChange} value={editingProduct.category}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="electronics">Eletrônicos</SelectItem>
                        <SelectItem value="clothing">Roupas</SelectItem>
                        <SelectItem value="food">Alimentos</SelectItem>
                        <SelectItem value="home">Casa e Decoração</SelectItem>
                        <SelectItem value="other">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-description">Descrição</Label>
                    <Textarea
                      id="edit-description"
                      name="description"
                      value={editingProduct.description}
                      onChange={handleEditInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-stock">Estoque</Label>
                    <Input
                      id="edit-stock"
                      name="stock"
                      type="number"
                      min="0"
                      value={editingProduct.stock}
                      onChange={handleEditInputChange}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">Atualizar Produto</Button>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
}
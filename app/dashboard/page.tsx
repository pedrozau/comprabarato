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
import { MapPin, Clock, Phone, Trash2, Edit, User, Mail } from 'lucide-react';
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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard da Loja</h1>

      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Produtos</TabsTrigger>
          <TabsTrigger value="info">Informações da Loja</TabsTrigger>
          <TabsTrigger value="profile">Perfil</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Produtos Cadastrados</h2>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button>Adicionar Produto</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Produto</DialogTitle>
                  <DialogDescription>
                    Preencha os detalhes do novo produto abaixo.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome do Produto</Label>
                    <Input
                      id="name"
                      name="name"
                      value={newProduct.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Preço (R$)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={newProduct.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Select onValueChange={handleCategoryChange} required>
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
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={newProduct.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image">Imagem do Produto</Label>
                    <Input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      required
                    />
                    {imagePreview && (
                      <div className="mt-2">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-w-full h-auto max-h-48 rounded-md"
                        />
                      </div>
                    )}
                  </div>
                  <Button type="submit" className="w-full">Cadastrar Produto</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Card key={product.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {product.name}
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditModal(product)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={100}
                      height={100}
                      className="rounded-md"
                    />
                    <div>
                      <p className="text-xl font-bold">
                        R$ {product.price.toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Estoque: {product.stock}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Categoria: {product.category}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        {product.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Loja</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span>Rua Exemplo, 123 - Cidade, Estado</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span>Segunda a Sexta: 9h às 18h | Sábado: 9h às 13h</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <span>(11) 1234-5678</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Perfil do Usuário</CardTitle>
              <CardDescription>Gerencie suas informações pessoais</CardDescription>
            </CardHeader>
            <CardContent>
              {isEditingProfile ? (
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      name="name"
                      value={profile.name}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={profile.email}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={profile.phone}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Endereço</Label>
                    <Input
                      id="address"
                      name="address"
                      value={profile.address}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsEditingProfile(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">Salvar Alterações</Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <span>{profile.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <span>{profile.address}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <span>{profile.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <span>{profile.email}</span>
                  </div>
                  <Button onClick={() => setIsEditingProfile(true)}>Editar Perfil</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
    </div>
  );
}
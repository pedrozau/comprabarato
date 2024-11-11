'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

export default function ProductForm() {
  const [images, setImages] = useState<File[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você implementaria a lógica para enviar os dados do produto para o backend
    console.log('Produto cadastrado!');
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Cadastro de Produto</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Produto</Label>
                <Input id="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Preço (R$)</Label>
                <Input id="price" type="number" step="0.01" min="0" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea id="description" required />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Eletrônicos</SelectItem>
                    <SelectItem value="clothing">Roupas</SelectItem>
                    <SelectItem value="food">Alimentos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Quantidade em Estoque</Label>
                <Input id="stock" type="number" min="0" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="images">Imagens do Produto</Label>
              <Input
                id="images"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {images.map((image, index) => (
                  <div key={index} className="w-20 h-20 relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Prévia ${index + 1}`}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="discount" />
              <Label htmlFor="discount">Aplicar Desconto</Label>
            </div>
            <Button type="submit">Cadastrar Produto</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

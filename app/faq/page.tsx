import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from '@/components/ui/accordion';
  
  export default function FAQ() {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Perguntas Frequentes</h1>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Como o Compra Barato funciona?</AccordionTrigger>
            <AccordionContent>
              O Compra Barato permite que você compare preços de produtos em lojas
              físicas próximas. Basta digitar o nome do produto que você está
              procurando, e nós mostraremos as melhores opções com base no preço e
              na proximidade.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              As informações de preço são atualizadas em tempo real?
            </AccordionTrigger>
            <AccordionContent>
              Fazemos o possível para manter as informações de preço atualizadas,
              mas recomendamos sempre confirmar com a loja antes de fazer a
              compra, pois os preços podem variar.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>
              Como posso entrar em contato com uma loja?
            </AccordionTrigger>
            <AccordionContent>
              Cada resultado de busca inclui um botão "Falar com a Loja" que
              permite iniciar uma conversa em tempo real com o estabelecimento.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>O serviço é gratuito?</AccordionTrigger>
            <AccordionContent>
              Sim, o uso do Compra Barato é totalmente gratuito para os
              consumidores.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  }
  
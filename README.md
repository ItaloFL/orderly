# Orderly

> Plataforma de pedidos construída com arquitetura de microserviços,
> comunicação assíncrona via RabbitMQ e deploy orquestrado com Docker.

## 📐 Arquitetura

Em Breve

## 🔄 Fluxo de eventos

Em Breve 

## Cartões de teste

| Cartão              | Resultado        |
|---------------------|------------------|
| 4242 4242 4242 4242 | Sempre aprovado  |
| 4000 0000 0000 0002 | Sempre recusado  |
| 4000 0025 0000 3155 | Requer 3D Secure |

Validade: qualquer data futura. CVC: qualquer 3 dígitos.

## 🛠 Stack

- Node.js + TypeScript
- RabbitMQ
- PostgreSQL
- Docker + Nginx
- React + Tailwind

## 🚀 Como rodar

docker-compose up --build

## 📡 Serviços

| Serviço | Porta | Responsabilidade |
| ------- | ----- | ---------------- |
| Auth    | 3001  | JWT              |
| Orders  | 3002  | Pedidos          |
| Payment | 3003  | Pagamentos       |
| Stock   | 3004  | Estoque          |
| Notify  | 3005  | E-mails          |
| Catalog | 3006  | Produtos         |

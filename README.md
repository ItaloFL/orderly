# Orderly

> Plataforma de pedidos construída com arquitetura de microserviços,
> comunicação assíncrona via RabbitMQ e deploy orquestrado com Docker.

## 📐 Arquitetura

Em Breve

## 🔄 Fluxo de eventos

Em Breve 

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

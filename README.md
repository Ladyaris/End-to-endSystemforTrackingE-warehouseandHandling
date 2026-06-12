# End-to-end System for Tracking, E-warehouse & Handling (ESTEH)

Sistem integrasi logistik berbasis microservices: **Order Management + Warehouse + Shipping & Tracking**, terintegrasi melalui REST API dan RabbitMQ

## Anggota & Pembagian Tugas

| Lord Esteh -> Order Service -> `order-service/` |
| Teteh Cimol -> Warehouse Service -> `warehouse-service/` |
| Ratu Study Group -> Shipping Service -> `shipping-service/` |
| Anak Seni -> API Gateway + RabbitMQ + Docker -> `api-gateway/`, `docker-compose.yml` |

## Arsitektur

```
Frontend (HTML)
      API Gateway 3000
      Order 3001
      Warehouse 3002
      Shipping 3003
            RabbitMQ
      (order.created, stock.updated, dst)
```

## Port & Database

order_db
warehouse_db
shipping_db

## Cara Kerja

Nanti kelen buat struktur foldernya gini yeah:

```bash
git clone <repo-url>
cd esteh/<folder-kelen>
npm install
npm start
```

Jangan edit folder orang lain ye, biar egk berantakan pas push/pull

## Status Pengerjaan

Order Service — CRUD + publish event ke RabbitMQ
Warehouse Service — CRUD produk + consume event (kurangi stok)
Shipping Service — CRUD pengiriman + consume event (buat kiriman)
API Gateway — routing ke 3 service
RabbitMQ setup
Docker Compose
Frontend
Swagger docs tiap service
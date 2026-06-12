# API Gateway + Integration Layer (Port 3000)

**PIC: [Nama 4]**

## Tugas
- Routing request dari frontend ke 3 service (Order, Warehouse, Shipping)
- Setup RabbitMQ (message broker) — buat exchange/queue yang dipakai semua service
- Bikin `docker-compose.yml` di root project — jalanin semua service + RabbitMQ + MySQL sekaligus
- Testing integrasi end-to-end

## Routing Rencana
| Frontend Path | Diteruskan ke |
|---------------|----------------|
| /api/orders/** | Order Service (3001) |
| /api/products/** | Warehouse Service (3002) |
| /api/shipments/** | Shipping Service (3003) |

## RabbitMQ — Event yang Dipakai
| Event | Publisher | Consumer |
|-------|-----------|----------|
| order.created | Order Service | Warehouse Service |
| stock.updated | Warehouse Service | Shipping Service |

## Status
- [ ] Setup API Gateway (bisa contek dari project UTS, tambah 1 routing baru)
- [ ] Setup RabbitMQ (docker image: rabbitmq:management)
- [ ] docker-compose.yml — semua service + RabbitMQ + 3 MySQL database
- [ ] Testing alur: buat order → stok warehouse berkurang → shipment otomatis terbuat
- [ ] Koordinasi nama event & format pesan RabbitMQ dengan semua anggota

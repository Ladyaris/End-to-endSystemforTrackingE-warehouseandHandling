# Order Service (Port 3001)

**PIC: [Nama 1 - Led]**

## Tugas
- Endpoint CRUD untuk pesanan
- Saat order dibuat → publish event `order.created` ke RabbitMQ
- Bisa contek struktur dari project UTS Food Delivery (restaurant → order)

## Endpoint Rencana
| Method | Endpoint | Keterangan |
|--------|----------|------------|
| GET | /orders | Ambil semua pesanan |
| GET | /orders/:id | Ambil pesanan by ID |
| POST | /orders | Buat pesanan baru → publish event ke RabbitMQ |
| PATCH | /orders/:id/status | Update status pesanan |
| DELETE | /orders/:id | Hapus pesanan |

## Database: order_db

## Status
- [ ] Setup project (package.json, index.js, db.js)
- [ ] CRUD endpoint
- [ ] Swagger docs
- [ ] Publish event ke RabbitMQ saat order dibuat
- [ ] Dockerfile

# Shipping Service (Port 3003)

**PIC: [Nama 3]**

## Tugas
- Endpoint CRUD untuk data pengiriman & tracking
- Consume event `stock.updated` (atau `order.created`, didiskusikan dengan tim) dari RabbitMQ → otomatis buat data pengiriman baru

## Endpoint Rencana
| Method | Endpoint | Keterangan |
|--------|----------|------------|
| GET | /shipments | Ambil semua data pengiriman |
| GET | /shipments/:id | Tracking pengiriman by ID |
| POST | /shipments | Buat data pengiriman baru |
| PATCH | /shipments/:id/status | Update status pengiriman |
| DELETE | /shipments/:id | Hapus data pengiriman |

## Database: shipping_db

Tabel `shipments`: id, order_id, status (pending/picked_up/on_the_way/delivered), courier, resi, created_at

## Status
- [ ] Setup project (package.json, index.js, db.js) — bisa contek struktur restaurant-service di project UTS
- [ ] CRUD endpoint shipment
- [ ] Swagger docs
- [ ] Consume event dari RabbitMQ → buat shipment otomatis
- [ ] Dockerfile

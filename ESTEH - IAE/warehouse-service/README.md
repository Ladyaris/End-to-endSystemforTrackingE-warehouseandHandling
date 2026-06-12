# Warehouse Service (Port 3002)

**PIC: Dinar Fadlilatunnisa**

## Tugas
- Endpoint CRUD untuk produk & stok
- Consume event `order.created` dari RabbitMQ → otomatis kurangi stok
- Setelah stok dikurangi → publish event `stock.updated` ke RabbitMQ

## Endpoint Rencana
| Method | Endpoint | Keterangan |
|--------|----------|------------|
| GET | /products | Ambil semua produk & stok |
| GET | /products/:id | Ambil produk by ID |
| POST | /products | Tambah produk baru |
| PUT | /products/:id/stock | Update stok produk |
| DELETE | /products/:id | Hapus produk |

## Database: warehouse_db

Tabel `products`: id, name, stock, price, created_at

## Status
- [ ] Setup project (package.json, index.js, db.js) — bisa contek struktur restaurant-service di project UTS
- [ ] CRUD endpoint produk
- [ ] Swagger docs
- [ ] Consume event order.created dari RabbitMQ → kurangi stok
- [ ] Publish event stock.updated
- [ ] Dockerfile

## Catatan
- Port 3002 di sini BEDA dengan project UTS (di UTS, 3002 = order service). Project ini terpisah, jangan disamakan.

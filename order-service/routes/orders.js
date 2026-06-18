const express = require('express');
const router = express.Router();
const db = require('../db');
const axios = require('axios');

const WAREHOUSE_SERVICE_URL = process.env.WAREHOUSE_SERVICE_URL || 'http://localhost:3002';

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Ambil semua order
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Berhasil
 */
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM orders ORDER BY id DESC');
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Ambil order berdasarkan ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Berhasil
 *       404:
 *         description: Order tidak ditemukan
 */
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (rows.length === 0)
      return res.status(404).json({ success: false, message: 'Order tidak ditemukan' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Buat order baru (validasi & kurangi stok ke Warehouse Service)
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [product_name, quantity, customer_name]
 *             properties:
 *               product_name:
 *                 type: string
 *                 example: Indomie Goreng
 *               quantity:
 *                 type: integer
 *                 example: 5
 *               customer_name:
 *                 type: string
 *                 example: Ledi
 *     responses:
 *       201:
 *         description: Order berhasil dibuat
 *       400:
 *         description: Stok tidak cukup
 *       503:
 *         description: Warehouse Service tidak tersedia
 */
router.post('/', async (req, res) => {
  const { product_name, quantity, customer_name } = req.body;
  if (!product_name || !quantity || !customer_name)
    return res.status(400).json({ success: false, message: 'Data tidak lengkap' });

  try {
    // ── Step 1: Ambil semua barang dari Warehouse Service ──────────────────
    let warehouseList;
    try {
      const warehouseRes = await axios.get(`${WAREHOUSE_SERVICE_URL}/warehouses`);
      warehouseList = warehouseRes.data.data;
    } catch (err) {
      return res.status(503).json({ success: false, message: 'Warehouse Service tidak tersedia' });
    }

    // ── Step 2: Cari produk berdasarkan nama ───────────────────────────────
    const product = warehouseList.find(
      item => item.nama_barang?.toLowerCase() === product_name.toLowerCase() ||
              item.name?.toLowerCase() === product_name.toLowerCase() ||
              item.nama?.toLowerCase() === product_name.toLowerCase()
    );

    if (!product)
      return res.status(404).json({ success: false, message: `Produk "${product_name}" tidak ditemukan di warehouse` });

    // ── Step 3: Cek stok cukup atau tidak ────────────────────────────────
    const currentStock = product.stok ?? product.stock ?? product.jumlah ?? 0;
    if (currentStock < quantity)
      return res.status(400).json({ success: false, message: `Stok tidak cukup. Stok tersedia: ${currentStock}` });

    // ── Step 4: Simpan order ke database ─────────────────────────────────
    const [result] = await db.query(
      'INSERT INTO orders (product_name, quantity, customer_name, status) VALUES (?, ?, ?, ?)',
      [product_name, quantity, customer_name, 'pending']
    );

    // ── Step 5: Kurangi stok di Warehouse Service ─────────────────────────
    try {
      await axios.patch(`${WAREHOUSE_SERVICE_URL}/warehouses/${product.id}/kurangi`, {
        jumlah: quantity
      });
    } catch (err) {
      console.error('Gagal kurangi stok warehouse:', err.message);
      // Order tetap berhasil dibuat, stok gagal dikurangi → log error
    }

    res.status(201).json({
      success: true,
      message: 'Order berhasil dibuat',
      id: result.insertId,
      product: product_name,
      remaining_stock: currentStock - quantity
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * @swagger
 * /orders/{id}/status:
 *   patch:
 *     summary: Update status order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, shipped, delivered, cancelled]
 *                 example: confirmed
 *     responses:
 *       200:
 *         description: Status diupdate
 */
router.patch('/:id/status', async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status))
    return res.status(400).json({ success: false, message: 'Status tidak valid' });
  try {
    const [check] = await db.query('SELECT id FROM orders WHERE id = ?', [req.params.id]);
    if (check.length === 0)
      return res.status(404).json({ success: false, message: 'Order tidak ditemukan' });
    await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ success: true, message: `Status order diupdate menjadi "${status}"` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Hapus order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order dihapus
 */
router.delete('/:id', async (req, res) => {
  try {
    const [check] = await db.query('SELECT id FROM orders WHERE id = ?', [req.params.id]);
    if (check.length === 0)
      return res.status(404).json({ success: false, message: 'Order tidak ditemukan' });
    await db.query('DELETE FROM orders WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Order berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

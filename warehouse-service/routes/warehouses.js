const express = require('express');
const router = express.Router();
const db = require('../db');


/**
 * @swagger
 * tags:
 *   name: Warehouse
 *   description: API manajemen stok barang
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Barang:
 *       type: object
 *       properties:
 *         idBarang:
 *           type: integer
 *           example: 1
 *         namaBarang:
 *           type: string
 *           example: Indomie
 *         stok:
 *           type: integer
 *           example: 20
 *
 *     CreateBarang:
 *       type: object
 *       required:
 *         - namaBarang
 *         - stok
 *       properties:
 *         namaBarang:
 *           type: string
 *           example: Indomie
 *         stok:
 *           type: integer
 *           example: 20
 *
 *     UpdateStok:
 *       type: object
 *       required:
 *         - jumlah
 *       properties:
 *         jumlah:
 *           type: integer
 *           example: 5
 */

// Menampilkan semua barang
/**
 * @swagger
 * /warehouses:
 *   get:
 *     summary: Ambil semua data barang
 *     tags: [Warehouse]
 *     responses:
 *       200:
 *         description: Berhasil mengambil data barang
 */
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM barang ORDER BY idBarang");

    res.json({
      success: true,
      data: rows,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// Menampilkan barang berdasarkan id
/**
 * @swagger
 * /warehouses/{id}:
 *   get:
 *     summary: Ambil detail barang berdasarkan ID
 *     tags: [Warehouse]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Data barang ditemukan
 *       404:
 *         description: Barang tidak ditemukan
 */
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM barang WHERE idBarang = ?", [
      req.params.id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Barang tidak ditemukan",
      });
    }

    res.json({
      success: true,
      data: rows[0],
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// Tambah Barang
/**
 * @swagger
 * /warehouses:
 *   post:
 *     summary: Tambah barang baru
 *     tags: [Warehouse]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBarang'
 *     responses:
 *       201:
 *         description: Barang berhasil ditambahkan
 *       400:
 *         description: Data tidak valid
 */
router.post("/", async (req, res) => {
  const { namaBarang, stok } = req.body;

  if (!namaBarang || stok == null) {
    return res.status(400).json({
      success: false,
      message: "Nama barang dan stok wajib diisi",
    });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO barang (namaBarang, stok) VALUES (?, ?)",
      [namaBarang, stok],
    );

    res.status(201).json({
      success: true,
      message: "Barang berhasil ditambahkan",
      idBarang: result.insertId,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// Perbarui Barang
/**
 * @swagger
 * /warehouses/{id}:
 *   put:
 *     summary: Update data barang
 *     tags: [Warehouse]
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
 *             $ref: '#/components/schemas/CreateBarang'
 *     responses:
 *       200:
 *         description: Barang berhasil diperbarui
 *       404:
 *         description: Barang tidak ditemukan
 */
router.put("/:id", async (req, res) => {
  const { namaBarang, stok } = req.body;

  try {
    const [check] = await db.query("SELECT * FROM barang WHERE idBarang = ?", [
      req.params.id,
    ]);

    if (check.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Barang tidak ditemukan",
      });
    }

    await db.query(
      "UPDATE barang SET namaBarang = ?, stok = ? WHERE idBarang = ?",
      [namaBarang, stok, req.params.id],
    );

    res.json({
      success: true,
      message: "Barang berhasil diperbarui",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// Tambah Stok
/**
 * @swagger
 * /warehouses/{id}/tambah:
 *   patch:
 *     summary: Menambah stok barang
 *     tags: [Warehouse]
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
 *             $ref: '#/components/schemas/UpdateStok'
 *     responses:
 *       200:
 *         description: Stok berhasil ditambahkan
 *       404:
 *         description: Barang tidak ditemukan
 */
router.patch("/:id/tambah", async (req, res) => {
  const { jumlah } = req.body;

  try {
    await db.query("UPDATE barang SET stok = stok + ? WHERE idBarang = ?", [
      jumlah,
      req.params.id,
    ]);

    res.json({
      success: true,
      message: `Stok bertambah ${jumlah}`,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// Kurangi stok
/**
 * @swagger
 * /warehouses/{id}/kurangi:
 *   patch:
 *     summary: Mengurangi stok barang
 *     tags: [Warehouse]
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
 *             $ref: '#/components/schemas/UpdateStok'
 *     responses:
 *       200:
 *         description: Stok berhasil dikurangi
 *       400:
 *         description: Stok tidak mencukupi
 *       404:
 *         description: Barang tidak ditemukan
 */
router.patch("/:id/kurangi", async (req, res) => {
  const { jumlah } = req.body;

  try {
    const [rows] = await db.query(
      "SELECT stok FROM barang WHERE idBarang = ?",
      [req.params.id],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Barang tidak ditemukan",
      });
    }

    if (rows[0].stok < jumlah) {
      return res.status(400).json({
        success: false,
        message: "Stok tidak mencukupi",
      });
    }

    await db.query("UPDATE barang SET stok = stok - ? WHERE idBarang = ?", [
      jumlah,
      req.params.id,
    ]);

    res.json({
      success: true,
      message: `Stok berkurang ${jumlah}`,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// Hapus Barang
/**
 * @swagger
 * /warehouses/{id}:
 *   delete:
 *     summary: Hapus data barang
 *     tags: [Warehouse]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Barang berhasil dihapus
 *       404:
 *         description: Barang tidak ditemukan
 */
router.delete("/:id", async (req, res) => {
  try {
    const [check] = await db.query("SELECT * FROM barang WHERE idBarang = ?", [
      req.params.id,
    ]);

    if (check.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Barang tidak ditemukan",
      });
    }

    await db.query("DELETE FROM barang WHERE idBarang = ?", [req.params.id]);

    res.json({
      success: true,
      message: "Barang berhasil dihapus",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
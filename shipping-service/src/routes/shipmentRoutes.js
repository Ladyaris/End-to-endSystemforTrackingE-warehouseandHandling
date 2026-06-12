const express = require("express");

const router = express.Router();

const shipmentController =
require("../controllers/shipmentController");

/**
 * @swagger
 * /shipments:
 *   get:
 *     summary: Get all shipments
 *     tags: [Shipments]
 *     responses:
 *       200:
 *         description: List all shipments
 */
router.get(
  "/",
  shipmentController.getAllShipments
);

/**
 * @swagger
 * /shipments/{id}:
 *   get:
 *     summary: Get shipment by ID
 *     tags: [Shipments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Shipment found
 */
router.get(
  "/:id",
  shipmentController.getShipmentById
);


 /**
 * @swagger
 * /shipments:
 *   post:
 *     summary: Create shipment
 *     tags: [Shipments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - order_id
 *               - customer_name
 *               - address
 *             properties:
 *               order_id:
 *                 type: integer
 *                 example: 1002
 *               customer_name:
 *                 type: string
 *                 example: Andi
 *               address:
 *                 type: string
 *                 example: Jakarta
 *     responses:
 *       201:
 *         description: Shipment created
 */
router.post(
  "/",
  shipmentController.createShipment
);


/**
 * @swagger
 * /shipments/{id}/status:
 *   put:
 *     summary: Update shipment status
 *     tags: [Shipments]
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
 *                 example: SHIPPED
 *               location:
 *                 type: string
 *                 example: Jakarta
 *     responses:
 *       200:
 *         description: Status updated
 */
router.put(
  "/:id/status",
  shipmentController.updateShipmentStatus
);

/**
 * @swagger
 * /shipments/{id}:
 *   delete:
 *     summary: Delete shipment
 *     tags: [Shipments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Shipment deleted
 */
router.delete(
  "/:id",
  shipmentController.deleteShipment
);

/**
 * @swagger
 * /shipments/{id}/history:
 *   get:
 *     summary: Get shipment tracking history
 *     tags: [Shipments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Shipment ID
 *         schema:
 *           type: integer
 *           example: 2
 *     responses:
 *       200:
 *         description: Tracking history found
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 4
 *                   shipment_id:
 *                     type: integer
 *                     example: 2
 *                   status:
 *                     type: string
 *                     example: SHIPPED
 *                   location:
 *                     type: string
 *                     example: Jakarta Distribution Center
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: Shipment not found
 */
router.get(
  "/:id/history",
  shipmentController.getTrackingHistory
);

module.exports = router;
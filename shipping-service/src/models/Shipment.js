const pool = require("../config/db");

const getAllShipments = async () => {
  return await pool.query(
    "SELECT * FROM shipments ORDER BY shipment_id"
  );
};

const getShipmentById = async (id) => {
  return await pool.query(
    "SELECT * FROM shipments WHERE shipment_id = $1",
    [id]
  );
};

const createShipment = async (
  orderId,
  customerName,
  address,
  trackingNumber
) => {

  

  const result = await pool.query(
    `INSERT INTO shipments
    (
      order_id,
      customer_name,
      address,
      tracking_number
    )
    VALUES ($1,$2,$3,$4)
    RETURNING *`,
    [
      orderId,
      customerName,
      address,
      trackingNumber
    ]
  );



  return result;
};

const updateStatus = async (
  shipmentId,
  status
) => {

  return await pool.query(
    `UPDATE shipments
     SET status = $1
     WHERE shipment_id = $2
     RETURNING *`,
    [
      status,
      shipmentId
    ]
  );

};

const deleteShipment = async (
  shipmentId
) => {

  return await pool.query(
    `DELETE FROM shipments
     WHERE shipment_id = $1`,
    [shipmentId]
  );

};

const getTrackingHistory = async (
  shipmentId
) => {

  return await pool.query(
    `SELECT *
     FROM tracking_history
     WHERE shipment_id = $1
     ORDER BY updated_at`,
    [shipmentId]
  );

};

const addTrackingHistory = async (
  shipmentId,
  status,
  location
) => {

  return await pool.query(
    `INSERT INTO tracking_history
    (
      shipment_id,
      status,
      location
    )
    VALUES ($1,$2,$3)
    RETURNING *`,
    [
      shipmentId,
      status,
      location
    ]
  );

};

module.exports = {
  getAllShipments,
  getShipmentById,
  createShipment,
  updateStatus,
  deleteShipment,
  getTrackingHistory,
  addTrackingHistory
};

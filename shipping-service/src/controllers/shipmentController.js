const Shipment = require("../models/Shipment");
const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");

/*
=================================
GET ALL SHIPMENTS
=================================
*/
exports.getAllShipments = async (
  req,
  res
) => {

  try {

    const result =
      await Shipment.getAllShipments();

    res.json(
      result.rows
    );

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

/*
=================================
GET SHIPMENT BY ID
=================================
*/
exports.getShipmentById = async (
  req,
  res
) => {

  try {

    const shipment =
      await Shipment.getShipmentById(
        req.params.id
      );

    if (
      shipment.rows.length === 0
    ) {

      return res.status(404).json({
        message:
          "Shipment not found"
      });

    }

    const history =
      await pool.query(
        `
        SELECT *
        FROM tracking_history
        WHERE shipment_id = $1
        ORDER BY updated_at
        `,
        [req.params.id]
      );

    res.json({
      shipment:
        shipment.rows[0],
      tracking_history:
        history.rows
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

/*
=================================
GET TRACKING HISTORY
=================================
*/
exports.getTrackingHistory =
async (req, res) => {

  try {

    const result =
      await Shipment.getTrackingHistory(
        req.params.id
      );

    res.json(
      result.rows
    );

  } catch(error) {

    res.status(500).json({
      message: error.message
    });

  }

};

/*
=================================
CREATE SHIPMENT
=================================
*/
exports.createShipment = async (
  req,
  res
) => {

  try {

    const {
      order_id,
      customer_name,
      address
    } = req.body;

    const trackingNumber =
      "TRK-" +
      uuidv4()
      .substring(0,8)
      .toUpperCase();

    const shipment =
      await Shipment.createShipment(
        order_id,
        customer_name,
        address,
        trackingNumber
      );

    const shipmentId =
      shipment.rows[0]
      .shipment_id;

    await pool.query(
      `
      INSERT INTO tracking_history
      (
        shipment_id,
        status,
        location
      )
      VALUES
      (
        $1,
        'PENDING',
        'Warehouse'
      )
      `,
      [shipmentId]
    );

    await pool.query(
      `
      INSERT INTO shipping_logs
      (
        shipment_id,
        action,
        description
      )
      VALUES
      (
        $1,
        'CREATE SHIPMENT',
        'Shipment created'
      )
      `,
      [shipmentId]
    );

    res.status(201).json(
      shipment.rows[0]
    );

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

/*
=================================
UPDATE SHIPMENT STATUS
=================================
*/
exports.updateShipmentStatus =
async (req,res)=>{

  try {

    const {
      status,
      location
    } = req.body;

    const updated =
      await Shipment.updateStatus(
        req.params.id,
        status
      );

    await pool.query(
      `
      INSERT INTO tracking_history
      (
        shipment_id,
        status,
        location
      )
      VALUES
      (
        $1,
        $2,
        $3
      )
      `,
      [
        req.params.id,
        status,
        location
      ]
    );

    await pool.query(
      `
      INSERT INTO shipping_logs
      (
        shipment_id,
        action,
        description
      )
      VALUES
      (
        $1,
        'UPDATE STATUS',
        $2
      )
      `,
      [
        req.params.id,
        `Status changed to ${status}`
      ]
    );

    res.json(
      updated.rows[0]
    );

  } catch(error){

    res.status(500).json({
      message: error.message
    });

  }

};

/*
=================================
DELETE SHIPMENT
=================================
*/
exports.deleteShipment =
async (req,res)=>{

  try {

    await pool.query(
      `
      DELETE FROM tracking_history
      WHERE shipment_id = $1
      `,
      [req.params.id]
    );

    await pool.query(
      `
      DELETE FROM shipping_logs
      WHERE shipment_id = $1
      `,
      [req.params.id]
    );

    await Shipment.deleteShipment(
      req.params.id
    );

    res.json({
      message:
      "Shipment deleted"
    });

  } catch(error){

    res.status(500).json({
      message: error.message
    });

  }

};
ini untuk database karena aku pakai postgresql, 

kalau nanti ada yg pake mysql

ini struktur database tiap tabel:

shipments
(
 shipment_id,
 order_id,
 customer_name,
 address,
 tracking_number,
 status,
 created_at
)

tracking_history
(
 id,
 shipment_id,
 status,
 location,
 updated_at
)

shipping_logs
(
 id,
 shipment_id,
 action,
 description,
 created_at
)
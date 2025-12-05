-- Sample Purchase Orders Data for Fiora Atelier

-- Insert sample purchase orders
INSERT IGNORE INTO purchase_orders (id, supplier_id, status, total_amount, order_date, expected_date, notes) VALUES
(1, 1, 'received', 45000.00, '2024-01-15', '2024-01-20', 'Urgent order for Valentine''s season'),
(2, 2, 'ordered', 32000.00, '2024-02-01', '2024-02-10', 'Regular monthly supply'),
(3, 3, 'pending', 28000.00, '2024-02-15', '2024-02-25', 'New supplier trial order'),
(4, 1, 'received', 52000.00, '2024-01-25', '2024-01-30', 'Wedding season stock'),
(5, 2, 'cancelled', 15000.00, '2024-02-05', '2024-02-12', 'Cancelled due to supplier issues');

-- Insert purchase order items - FIXED: using unit_cost instead of unit_price
INSERT IGNORE INTO purchase_order_items (purchase_order_id, product_id, quantity, unit_cost) VALUES
-- PO 1 Items
(1, 1, 10, 850.00),
(1, 7, 5, 1200.00),
(1, 8, 20, 450.00),

-- PO 2 Items  
(2, 2, 15, 380.00),
(2, 9, 25, 280.00),
(2, 16, 30, 120.00),

-- PO 3 Items
(3, 3, 8, 920.00),
(3, 10, 12, 350.00),
(3, 17, 40, 95.00),

-- PO 4 Items
(4, 4, 18, 420.00),
(4, 11, 10, 680.00),
(4, 25, 25, 320.00),

-- PO 5 Items (cancelled)
(5, 5, 12, 480.00),
(5, 12, 8, 390.00);

-- Update purchase order totals based on items
UPDATE purchase_orders po
JOIN (
    SELECT purchase_order_id, SUM(quantity * unit_cost) as calculated_total
    FROM purchase_order_items 
    GROUP BY purchase_order_id
) poi ON po.id = poi.purchase_order_id
SET po.total_amount = poi.calculated_total;
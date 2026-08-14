-- ============================================================
-- INVENTORY MANAGEMENT SYSTEM - SQL ASSESSMENT QUERIES
-- Database: inventory_management_db
-- ============================================================

-- 1. Display all products
SELECT id, name, sku, price, quantity, category_id, created_at, updated_at
FROM products;

-- 2. Find product by SKU
SELECT id, name, sku, price, quantity, category_id
FROM products
WHERE LOWER(sku) = LOWER('SKU-1001');

-- 3. Find low-stock products (quantity less than low-stock threshold 5)
SELECT id, name, sku, price, quantity, category_id
FROM products
WHERE quantity < 5
ORDER BY quantity ASC;

-- 4. Count products by category
SELECT c.id AS category_id, c.name AS category_name, COUNT(p.id) AS total_products
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
GROUP BY c.id, c.name;

-- 5. Calculate total inventory value (Sum of price * quantity across all products)
SELECT SUM(price * quantity) AS total_inventory_value
FROM products;

-- 6. Join products with categories to get product details with category name
SELECT p.id, p.name AS product_name, p.sku, p.price, p.quantity, c.name AS category_name, p.created_at
FROM products p
INNER JOIN categories c ON p.category_id = c.id
ORDER BY p.id ASC;

-- 7. Update product quantity
UPDATE products
SET quantity = 15, updated_at = NOW()
WHERE id = 1;

-- 8. Delete a product
DELETE FROM products
WHERE id = 1;

-- Add all products from your catalog
INSERT IGNORE INTO products (id, name, description, category, price, image_url) VALUES
(1, 'Candy Pink', 'A vibrant pink arrangement perfect for celebrations.', 'best-sellers', 9999.00, 'pics/b1.webp'),
(2, 'Bright but Light', 'A cheerful mix of bright flowers to light up any room.', 'best-sellers', 2850.00, 'pics/b2.webp'),
(3, 'Berry Cheesecake', 'Rich tones of berry and cream in an elegant display.', 'best-sellers', 6880.00, 'pics/b3.webp'),
(4, 'Dream Land', 'Soft pastel blooms that evoke a dreamy atmosphere.', 'best-sellers', 3990.00, 'pics/b4.webp'),
(5, 'Pinkish Belle', 'Delicate pink flowers arranged with timeless elegance.', 'best-sellers', 5390.00, 'pics/b5.webp'),
(6, 'Normandiana Wreath', 'Normandiana Wreath in Pink and Gold for Christmas season.', 'best-sellers', 6500.00, 'pics/b6.jpg'),
(7, 'Blooms Blush', 'A luxurious bouquet of premium fresh blooms.', 'fresh', 15999.00, 'pics/f1.jpg'),
(8, 'Blissful Roses', 'Classic roses arranged to perfection.', 'fresh', 6670.00, 'pics/f2.jpg'),
(9, 'Rosette', 'A charming arrangement of roses and complementary flowers.', 'fresh', 3490.00, 'pics/ff3.webp'),
(10, 'Garden Delight', 'A beautiful mix of garden fresh flowers.', 'fresh', 4290.00, 'pics/Garden delight .jpeg'),
(11, 'White Elegance', 'Pure white flowers including lilies, roses, and orchids.', 'fresh', 5590.00, 'pics/White elegance .jpg'),
(12, 'Tropical Bliss', 'Exotic tropical flowers featuring birds of paradise.', 'fresh', 3890.00, 'pics/Tropicalbliss.jpg'),
(13, 'Pastel Mixed', 'A symphony of pastels, a harmony of blooms with gentle gestures.', 'fresh', 4290.00, 'pics/T2.jpg'),
(14, 'Vintage Peach Cream', 'Where timeless beauty meets modern elegance.', 'fresh', 5590.00, 'pics/W1.jpeg'),
(15, 'Golden Sunshine', 'A radiant reminder of all things bright and beautiful.', 'fresh', 3890.00, 'pics/T1.jpeg'),
(16, 'Eterna', 'Lifelike synthetic flowers that last forever.', 'synthetic', 349.00, 'pics/s1.jpg'),
(17, 'Silken', 'Silk flowers with remarkable realism.', 'synthetic', 299.00, 'pics/ff2.jpg'),
(18, 'Velvessa', 'Velvety textures that mimic real petals.', 'synthetic', 349.00, 'pics/s2.jpg'),
(19, 'Classic Roses', 'Timeless synthetic roses that never wilt.', 'synthetic', 399.00, 'pics/s3.jpg'),
(20, 'Orchid Elegance', 'Lifelike synthetic orchids that capture delicate beauty.', 'synthetic', 449.00, 'pics/s4.jpg'),
(21, 'Mixed Bloom', 'A beautiful arrangement of mixed synthetic flowers.', 'synthetic', 499.00, 'pics/s5.jpg'),
(25, 'Spring Tulips', 'Fresh spring tulips in vibrant colors.', 'seasonal', 1999.00, 'pics/spring1.webp'),
(26, 'Summer Sunflowers', 'Bright sunflowers to capture summer joy.', 'seasonal', 2499.00, 'pics/summer1.jpg'),
(27, 'Autumn Harvest', 'Warm autumn colors featuring chrysanthemums.', 'seasonal', 2899.00, 'pics/fall.jpg');

-- Initialize inventory for all products
INSERT IGNORE INTO inventory (product_id, current_stock, min_stock_level, max_stock_level) 
SELECT id, 25, 5, 50 FROM products 
WHERE id NOT IN (SELECT product_id FROM inventory);
DELETE FROM listings;
INSERT INTO listings (name, image, description, price, category, is_postage, is_meet_up, is_brand_new, is_used, user_id) 
VALUES 
('Item 1', 'cat.jpeg', 'Item 1', '100', 'books', true, true, false, true, 1),
('Item 2', 'cat.jpeg', 'Item 2', '100', 'books', true, true, false, true, 1),
('Jason 3', 'cat.jpeg', 'Item 3', '100', 'books', true, true, false, true, 1),
('Peter 4', 'cat.jpeg', 'Item 4', '100', 'books', true, true, false, true, 1),
('James 5', 'cat.jpeg', 'Item 5', '100', 'figures', true, true, false, true, 1),
('Alex 6', 'cat.jpeg', 'Item 6', '100', 'figures', true, true, false, true, 1),
('Tom 7', 'cat.jpeg', 'Item 7', '100', 'figures', true, true, false, true, 1);

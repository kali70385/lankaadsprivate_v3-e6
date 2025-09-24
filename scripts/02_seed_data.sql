-- Insert categories
INSERT INTO categories (name, slug, description, icon) VALUES
('Electronics', 'electronics', 'Mobile phones, computers, gadgets', 'Smartphone'),
('Vehicles', 'vehicles', 'Cars, motorcycles, bicycles', 'Car'),
('Property', 'property', 'Houses, apartments, land', 'Home'),
('Jobs', 'jobs', 'Employment opportunities', 'Briefcase'),
('Services', 'services', 'Professional services', 'Settings'),
('Fashion', 'fashion', 'Clothing, accessories, shoes', 'Shirt'),
('Home & Garden', 'home-garden', 'Furniture, appliances, tools', 'Home'),
('Sports', 'sports', 'Sports equipment, fitness', 'Trophy'),
('Books & Education', 'books-education', 'Books, courses, education', 'Book'),
('Pets', 'pets', 'Pet supplies, animals', 'Heart')
ON CONFLICT (slug) DO NOTHING;

-- Insert locations (Sri Lankan provinces and major cities)
INSERT INTO locations (name, slug, type) VALUES
('Western Province', 'western-province', 'province'),
('Central Province', 'central-province', 'province'),
('Southern Province', 'southern-province', 'province'),
('Northern Province', 'northern-province', 'province'),
('Eastern Province', 'eastern-province', 'province'),
('North Western Province', 'north-western-province', 'province'),
('North Central Province', 'north-central-province', 'province'),
('Uva Province', 'uva-province', 'province'),
('Sabaragamuwa Province', 'sabaragamuwa-province', 'province')
ON CONFLICT (slug) DO NOTHING;

-- Insert major cities
INSERT INTO locations (name, slug, type, parent_id) VALUES
('Colombo', 'colombo', 'city', (SELECT id FROM locations WHERE slug = 'western-province')),
('Kandy', 'kandy', 'city', (SELECT id FROM locations WHERE slug = 'central-province')),
('Galle', 'galle', 'city', (SELECT id FROM locations WHERE slug = 'southern-province')),
('Jaffna', 'jaffna', 'city', (SELECT id FROM locations WHERE slug = 'northern-province')),
('Batticaloa', 'batticaloa', 'city', (SELECT id FROM locations WHERE slug = 'eastern-province')),
('Kurunegala', 'kurunegala', 'city', (SELECT id FROM locations WHERE slug = 'north-western-province')),
('Anuradhapura', 'anuradhapura', 'city', (SELECT id FROM locations WHERE slug = 'north-central-province')),
('Badulla', 'badulla', 'city', (SELECT id FROM locations WHERE slug = 'uva-province')),
('Ratnapura', 'ratnapura', 'city', (SELECT id FROM locations WHERE slug = 'sabaragamuwa-province'))
ON CONFLICT (slug) DO NOTHING;

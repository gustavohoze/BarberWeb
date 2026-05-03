-- =====================================================
-- MASTER BARBER DATABASE SCHEMA
-- Supabase PostgreSQL Schema Setup
-- =====================================================

-- Run these queries in Supabase SQL Editor
-- Copy entire sections and run them

-- =====================================================
-- 1. BOOKINGS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20),
    service VARCHAR(255) NOT NULL,
    barber VARCHAR(255),
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 2. ADMINS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 3. SERVICES TABLE (Reference Data)
-- =====================================================

CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    duration_minutes INT NOT NULL,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 4. BARBERS TABLE (Reference Data)
-- =====================================================

CREATE TABLE IF NOT EXISTS barbers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    bio TEXT,
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 5. AVAILABILITY TABLE (Future Use)
-- =====================================================

CREATE TABLE IF NOT EXISTS availability (
    id SERIAL PRIMARY KEY,
    barber_id INT REFERENCES barbers(id) ON DELETE CASCADE,
    day_of_week INT, -- 0=Sunday, 1=Monday, etc.
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 6. AUDIT LOG TABLE (Future Use)
-- =====================================================

CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(255),
    operation VARCHAR(50), -- INSERT, UPDATE, DELETE
    record_id TEXT,
    old_data JSONB,
    new_data JSONB,
    performed_by VARCHAR(255),
    performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 7. INDEXES FOR PERFORMANCE
-- =====================================================

-- Booking indexes
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(customer_email);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);

-- Admin indexes
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);

-- Service indexes
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);

-- Barber indexes
CREATE INDEX IF NOT EXISTS idx_barbers_active ON barbers(is_active);

-- Availability indexes
CREATE INDEX IF NOT EXISTS idx_availability_barber ON availability(barber_id);
CREATE INDEX IF NOT EXISTS idx_availability_day ON availability(day_of_week);

-- =====================================================
-- 8. INSERT ADMIN USER
-- =====================================================

INSERT INTO admins (email, password_hash, created_at)
VALUES ('admin@masterbarber.com', 'password123', NOW())
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- 9. INSERT SERVICES (Reference Data)
-- =====================================================

INSERT INTO services (name, description, price, duration_minutes, category)
VALUES 
    ('Executive Haircut', 'A meticulous consultation followed by a precision cut using shears and clippers. Finished with a hot lather neck shave and premium styling products.', 45.00, 45, 'Hair'),
    ('Classic Fade', 'Seamless blending from skin to desired length. Sharp line-up and finished with our signature matte clay.', 40.00, 30, 'Hair'),
    ('Buzz Cut & Line Up', 'One guard all over, precise edging around the ears and neck. Clean, fast, and sharp.', 25.00, 20, 'Hair'),
    ('Luxury Hot Towel Shave', 'The ultimate relaxation. Multiple hot towels, pre-shave oil, warm lather, and a straight razor shave, finished with a cooling balm and cold towel.', 55.00, 45, 'Face & Beard'),
    ('Beard Trim & Shape', 'Sculpting and debulking to suit your face shape. Includes straight razor lining on the cheeks and neck for a crisp finish.', 30.00, 30, 'Face & Beard'),
    ('Beard Sculpting', 'Detailed beard trim, shaping, and conditioning treatment.', 25.00, 30, 'Face & Beard')
ON CONFLICT DO NOTHING;

-- =====================================================
-- 10. INSERT BARBERS (Reference Data)
-- =====================================================

INSERT INTO barbers (name, title, bio, is_active)
VALUES 
    ('Arthur S.', 'Master Barber', 'Founder with 20+ years of experience in traditional barbering', true),
    ('Thomas S.', 'Head Barber', 'Expert in modern fades and classic cuts', true),
    ('Julian Cross', 'Specialist', 'Specializes in beard sculpting and design', true)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 11. INSERT BARBER AVAILABILITY
-- =====================================================

INSERT INTO availability (barber_id, day_of_week, start_time, end_time, is_available)
VALUES 
    (1, 1, '09:00', '17:00', true),  -- Monday
    (1, 2, '09:00', '17:00', true),  -- Tuesday
    (1, 3, '09:00', '17:00', true),  -- Wednesday
    (1, 4, '09:00', '17:00', true),  -- Thursday
    (1, 5, '09:00', '17:00', true),  -- Friday
    (1, 6, '10:00', '16:00', true),  -- Saturday
    (2, 1, '10:00', '18:00', true),  -- Monday
    (2, 2, '10:00', '18:00', true),  -- Tuesday
    (2, 3, '10:00', '18:00', true),  -- Wednesday
    (2, 4, '10:00', '18:00', true),  -- Thursday
    (2, 5, '10:00', '18:00', true),  -- Friday
    (2, 6, '11:00', '17:00', true),  -- Saturday
    (3, 1, '12:00', '20:00', true),  -- Monday
    (3, 2, '12:00', '20:00', true),  -- Tuesday
    (3, 3, '12:00', '20:00', true),  -- Wednesday
    (3, 4, '12:00', '20:00', true),  -- Thursday
    (3, 5, '12:00', '20:00', true),  -- Friday
    (3, 6, '13:00', '19:00', true)   -- Saturday
ON CONFLICT DO NOTHING;

-- =====================================================
-- 12. USEFUL VIEWS
-- =====================================================

-- View: Upcoming Bookings
CREATE OR REPLACE VIEW upcoming_bookings AS
SELECT 
    id,
    customer_name,
    customer_email,
    service,
    barber,
    booking_date,
    booking_time,
    status,
    created_at
FROM bookings
WHERE booking_date >= CURRENT_DATE
ORDER BY booking_date ASC, booking_time ASC;

-- View: Today's Bookings
CREATE OR REPLACE VIEW todays_bookings AS
SELECT 
    id,
    customer_name,
    service,
    barber,
    booking_time,
    status
FROM bookings
WHERE booking_date = CURRENT_DATE
ORDER BY booking_time ASC;

-- View: Booking Statistics
CREATE OR REPLACE VIEW booking_stats AS
SELECT 
    status,
    COUNT(*) as total_count,
    COUNT(CASE WHEN booking_date = CURRENT_DATE THEN 1 END) as today_count,
    COUNT(CASE WHEN booking_date > CURRENT_DATE THEN 1 END) as upcoming_count
FROM bookings
GROUP BY status;

-- =====================================================
-- 13. USEFUL FUNCTIONS
-- =====================================================

-- Function: Get available time slots for a barber
CREATE OR REPLACE FUNCTION get_available_slots(
    p_barber_id INT,
    p_date DATE,
    p_duration_minutes INT DEFAULT 30
)
RETURNS TABLE (
    time_slot TIME,
    available BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.time_slot,
        NOT EXISTS (
            SELECT 1 FROM bookings b
            WHERE b.barber = (SELECT name FROM barbers WHERE id = p_barber_id)
            AND b.booking_date = p_date
            AND b.booking_time = t.time_slot::TIME
        ) as available
    FROM (
        SELECT '09:00'::TIME as time_slot
        UNION ALL SELECT '09:30'::TIME
        UNION ALL SELECT '10:00'::TIME
        UNION ALL SELECT '10:30'::TIME
        UNION ALL SELECT '11:00'::TIME
        UNION ALL SELECT '11:30'::TIME
        UNION ALL SELECT '14:00'::TIME
        UNION ALL SELECT '14:30'::TIME
        UNION ALL SELECT '15:00'::TIME
        UNION ALL SELECT '15:30'::TIME
        UNION ALL SELECT '16:00'::TIME
        UNION ALL SELECT '16:30'::TIME
    ) t;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 14. VERIFY SCHEMA
-- =====================================================

-- List all tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Count records in each table
SELECT 'bookings' as table_name, COUNT(*) as record_count FROM bookings
UNION ALL
SELECT 'admins' as table_name, COUNT(*) as record_count FROM admins
UNION ALL
SELECT 'services' as table_name, COUNT(*) as record_count FROM services
UNION ALL
SELECT 'barbers' as table_name, COUNT(*) as record_count FROM barbers
UNION ALL
SELECT 'availability' as table_name, COUNT(*) as record_count FROM availability;

-- =====================================================
-- END OF SCHEMA
-- =====================================================

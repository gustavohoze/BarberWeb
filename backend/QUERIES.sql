-- =====================================================
-- MASTER BARBER - COMMON SQL QUERIES
-- Quick reference for database operations
-- =====================================================

-- =====================================================
-- SECTION 1: READ / SELECT QUERIES
-- =====================================================

-- Get all bookings
SELECT * FROM bookings ORDER BY booking_date DESC;

-- Get bookings for a specific date
SELECT * FROM bookings WHERE booking_date = '2026-05-15';

-- Get pending bookings
SELECT * FROM bookings WHERE status = 'pending' ORDER BY booking_date;

-- Get bookings for a specific barber
SELECT * FROM bookings WHERE barber = 'Arthur S.' ORDER BY booking_date DESC;

-- Get bookings for a specific customer
SELECT * FROM bookings WHERE customer_email = 'john@example.com' ORDER BY booking_date DESC;

-- Get today's bookings
SELECT * FROM bookings WHERE booking_date = CURRENT_DATE ORDER BY booking_time;

-- Get upcoming bookings (future dates)
SELECT * FROM bookings WHERE booking_date > CURRENT_DATE ORDER BY booking_date;

-- Get bookings by status summary
SELECT status, COUNT(*) as count FROM bookings GROUP BY status;

-- Get most popular services
SELECT service, COUNT(*) as bookings_count FROM bookings GROUP BY service ORDER BY bookings_count DESC;

-- Get busiest barber
SELECT barber, COUNT(*) as bookings_count FROM bookings WHERE booking_date >= CURRENT_DATE GROUP BY barber ORDER BY bookings_count DESC;

-- Get all admins
SELECT id, email, created_at FROM admins;

-- Get all services
SELECT * FROM services ORDER BY category, name;

-- Get all barbers
SELECT * FROM barbers WHERE is_active = true ORDER BY name;

-- Get barber schedule for a specific date
SELECT b.name, a.start_time, a.end_time FROM barbers b 
JOIN availability a ON b.id = a.barber_id 
WHERE a.day_of_week = 1 
ORDER BY b.name, a.start_time;

-- =====================================================
-- SECTION 2: CREATE / INSERT QUERIES
-- =====================================================

-- Add a booking
INSERT INTO bookings (id, customer_name, customer_email, customer_phone, service, barber, booking_date, booking_time, status, created_at)
VALUES ('BOOK-123', 'John Doe', 'john@example.com', '+1234567890', 'The Executive Cut', 'Arthur S.', '2026-05-15', '10:00 AM', 'pending', NOW());

-- Add an admin user
INSERT INTO admins (email, password_hash)
VALUES ('newadmin@masterbarber.com', 'securepassword123');

-- Add a service
INSERT INTO services (name, description, price, duration_minutes, category)
VALUES ('Haircut Combo', 'Haircut with beard trim', 65.00, 60, 'Combo');

-- Add a barber
INSERT INTO barbers (name, title, bio, is_active)
VALUES ('Michael Brown', 'Master Barber', 'Expert in traditional barbering', true);

-- =====================================================
-- SECTION 3: UPDATE / MODIFY QUERIES
-- =====================================================

-- Update booking status
UPDATE bookings SET status = 'confirmed', updated_at = NOW() WHERE id = 'BOOK-1';

-- Update booking status by date
UPDATE bookings SET status = 'confirmed', updated_at = NOW() 
WHERE booking_date = '2026-05-15' AND status = 'pending';

-- Update barber availability
UPDATE barbers SET is_active = false WHERE id = 1;

-- Reschedule a booking
UPDATE bookings SET booking_date = '2026-05-20', booking_time = '02:00 PM', updated_at = NOW() WHERE id = 'BOOK-1';

-- Change admin password
UPDATE admins SET password_hash = 'newpassword123' WHERE email = 'admin@masterbarber.com';

-- Update service price
UPDATE services SET price = 50.00 WHERE name = 'Executive Haircut';

-- =====================================================
-- SECTION 4: DELETE / REMOVE QUERIES
-- =====================================================

-- Delete a specific booking
DELETE FROM bookings WHERE id = 'BOOK-1';

-- Delete all cancelled bookings
DELETE FROM bookings WHERE status = 'cancelled';

-- Delete bookings older than a date
DELETE FROM bookings WHERE booking_date < '2026-01-01';

-- Delete a specific admin
DELETE FROM admins WHERE email = 'old@masterbarber.com';

-- Delete all pending bookings (CAUTION!)
DELETE FROM bookings WHERE status = 'pending';

-- =====================================================
-- SECTION 5: STATISTICS & REPORTING
-- =====================================================

-- Monthly revenue report
SELECT 
    DATE_TRUNC('month', booking_date) as month,
    COUNT(*) as bookings,
    COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed,
    COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled
FROM bookings
GROUP BY DATE_TRUNC('month', booking_date)
ORDER BY month DESC;

-- Barber performance report
SELECT 
    barber,
    COUNT(*) as total_bookings,
    COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_bookings,
    COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_bookings
FROM bookings
WHERE booking_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY barber
ORDER BY total_bookings DESC;

-- Customer booking history
SELECT 
    customer_name,
    customer_email,
    COUNT(*) as total_bookings,
    MAX(booking_date) as last_booking
FROM bookings
GROUP BY customer_name, customer_email
ORDER BY total_bookings DESC;

-- Booking status distribution
SELECT 
    status,
    COUNT(*) as count,
    ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER(), 2) as percentage
FROM bookings
GROUP BY status;

-- Average bookings per day
SELECT 
    AVG(daily_count) as average_daily_bookings
FROM (
    SELECT DATE(booking_date) as booking_day, COUNT(*) as daily_count
    FROM bookings
    GROUP BY DATE(booking_date)
) daily_stats;

-- =====================================================
-- SECTION 6: DATA MAINTENANCE
-- =====================================================

-- Truncate all bookings (DANGER - Cannot undo!)
-- TRUNCATE TABLE bookings RESTART IDENTITY CASCADE;

-- Reset admin password to default
UPDATE admins SET password_hash = 'password123' WHERE email = 'admin@masterbarber.com';

-- Mark all old bookings as archived
UPDATE bookings SET status = 'archived', updated_at = NOW() WHERE booking_date < NOW() - INTERVAL '90 days';

-- =====================================================
-- SECTION 7: USEFUL JOINS
-- =====================================================

-- Get booking details with service info
SELECT 
    b.id,
    b.customer_name,
    b.customer_email,
    b.booking_date,
    b.booking_time,
    s.price,
    s.duration_minutes,
    b.status
FROM bookings b
JOIN services s ON b.service = s.name
ORDER BY b.booking_date DESC;

-- Get booking details with barber info
SELECT 
    b.id,
    b.customer_name,
    b.service,
    barb.name as barber_name,
    barb.title,
    b.booking_date,
    b.booking_time,
    b.status
FROM bookings b
JOIN barbers barb ON b.barber = barb.name
ORDER BY b.booking_date DESC;

-- Get complete booking information
SELECT 
    b.id,
    b.customer_name,
    b.customer_email,
    b.customer_phone,
    s.name as service,
    s.price,
    s.duration_minutes,
    barb.name as barber_name,
    barb.title as barber_title,
    b.booking_date,
    b.booking_time,
    b.status,
    b.created_at
FROM bookings b
JOIN services s ON b.service = s.name
JOIN barbers barb ON b.barber = barb.name
ORDER BY b.booking_date DESC;

-- =====================================================
-- SECTION 8: QUICK MANAGEMENT COMMANDS
-- =====================================================

-- Get database size
SELECT 
    pg_size_pretty(pg_database_size(current_database())) as database_size;

-- Get total records
SELECT 
    'bookings' as table_name, COUNT(*) as count FROM bookings
UNION ALL
SELECT 'admins', COUNT(*) FROM admins
UNION ALL
SELECT 'services', COUNT(*) FROM services
UNION ALL
SELECT 'barbers', COUNT(*) FROM barbers;

-- Check database health
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- =====================================================
-- SECTION 9: SAMPLE DATA QUERIES
-- =====================================================

-- Get sample bookings for testing
SELECT * FROM bookings LIMIT 10;

-- Get bookings in the next 7 days
SELECT * FROM bookings 
WHERE booking_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
ORDER BY booking_date, booking_time;

-- Check for double bookings (same barber, same time)
SELECT 
    barber,
    booking_date,
    booking_time,
    COUNT(*) as count
FROM bookings
GROUP BY barber, booking_date, booking_time
HAVING COUNT(*) > 1;

-- =====================================================
-- TIPS
-- =====================================================
-- 1. Always backup before running DELETE queries
-- 2. Test UPDATE queries with SELECT first
-- 3. Use WHERE clause carefully
-- 4. Check record count before and after operations
-- 5. Use transactions for critical operations: BEGIN; ... COMMIT;

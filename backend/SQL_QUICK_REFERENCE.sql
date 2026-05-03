-- =====================================================
-- MASTER BARBER - SQL QUICK REFERENCE CARD
-- =====================================================
-- Print this or bookmark for quick lookups
-- =====================================================

-- =================
-- TABLE REFERENCE
-- =================

-- ADMINS: Login credentials
-- Columns: id (uuid), email (string), password_hash (string), created_at (timestamp)
-- Use: Store admin login info
-- Default: admin@masterbarber.com / password123

-- BOOKINGS: Customer bookings
-- Columns: id (uuid), customer_name, customer_email, customer_phone, service, 
--          barber, booking_date, booking_time, status, created_at, updated_at
-- Use: Store all booking data
-- Statuses: pending, confirmed, completed, cancelled

-- BARBERS: Staff members
-- Columns: id (int), name, speciality, image_url, is_active, created_at
-- Use: Store barber/stylist info
-- Example: Arthur S., Thomas S.

-- SERVICES: Available services
-- Columns: id (int), name, price (decimal), duration_minutes (int), description, created_at
-- Use: Store service info and pricing
-- Examples: The Executive Cut, Beard Sculpting, etc.

-- =================
-- QUICK QUERIES
-- =================

-- 1. GET TODAY'S BOOKINGS
SELECT customer_name, booking_time, service, barber, status
FROM bookings
WHERE booking_date = CURRENT_DATE
ORDER BY booking_time;

-- 2. GET BOOKINGS FOR SPECIFIC BARBER
SELECT * FROM bookings
WHERE barber = 'Arthur S.'
ORDER BY booking_date DESC;

-- 3. COUNT PENDING BOOKINGS
SELECT COUNT(*) as pending_count FROM bookings WHERE status = 'pending';

-- 4. GET ALL SERVICES WITH PRICES
SELECT name, price, duration_minutes FROM services ORDER BY price DESC;

-- 5. CREATE NEW BOOKING
INSERT INTO bookings (id, customer_name, customer_email, customer_phone, service, barber, booking_date, booking_time, status, created_at)
VALUES (gen_random_uuid(), 'John Doe', 'john@example.com', '+1234567890', 'The Executive Cut', 'Arthur S.', '2026-05-20', '10:00 AM', 'pending', NOW());

-- 6. UPDATE BOOKING STATUS
UPDATE bookings SET status = 'confirmed' WHERE id = 'BOOKING_ID';

-- 7. CANCEL BOOKING
UPDATE bookings SET status = 'cancelled', updated_at = NOW() WHERE id = 'BOOKING_ID';

-- 8. DELETE BOOKING
DELETE FROM bookings WHERE id = 'BOOKING_ID';

-- 9. GET ADMIN BY EMAIL
SELECT * FROM admins WHERE email = 'admin@masterbarber.com';

-- 10. GET BARBER INFO
SELECT * FROM barbers WHERE is_active = true;

-- =================
-- COMMON OPERATIONS
-- =================

-- Check if email exists in bookings
SELECT COUNT(*) FROM bookings WHERE customer_email = 'email@example.com';

-- Get booking details
SELECT * FROM bookings WHERE id = 'UUID_HERE';

-- Get revenue by service
SELECT service, COUNT(*) as bookings, SUM(
    CASE 
        WHEN service = 'The Executive Cut' THEN 35
        WHEN service = 'Beard Sculpting' THEN 25
        ELSE 0
    END
) as total_revenue
FROM bookings WHERE status IN ('confirmed', 'completed')
GROUP BY service;

-- Get revenue by barber
SELECT barber, COUNT(*) as bookings
FROM bookings WHERE status IN ('confirmed', 'completed')
GROUP BY barber;

-- Get available time slots (not booked)
SELECT DISTINCT booking_time FROM bookings 
WHERE booking_date = '2026-05-20' AND barber = 'Arthur S.'
ORDER BY booking_time;

-- Find duplicate bookings
SELECT customer_email, booking_date, booking_time, COUNT(*) 
FROM bookings 
GROUP BY customer_email, booking_date, booking_time 
HAVING COUNT(*) > 1;

-- Get future bookings
SELECT * FROM bookings WHERE booking_date > CURRENT_DATE ORDER BY booking_date;

-- Get past bookings
SELECT * FROM bookings WHERE booking_date < CURRENT_DATE ORDER BY booking_date DESC;

-- =================
-- ADMIN OPERATIONS
-- =================

-- Add new admin
INSERT INTO admins (id, email, password_hash, created_at)
VALUES (gen_random_uuid(), 'newadmin@masterbarber.com', 'hashed_password_here', NOW());

-- Change admin password (in real app, hash the password first)
UPDATE admins SET password_hash = 'new_hashed_password' WHERE email = 'admin@masterbarber.com';

-- Add new barber
INSERT INTO barbers (id, name, speciality, image_url, is_active, created_at)
VALUES (1, 'New Barber', 'General Barbering', 'https://example.com/image.jpg', true, NOW());

-- Deactivate barber
UPDATE barbers SET is_active = false WHERE name = 'Arthur S.';

-- Add new service
INSERT INTO services (id, name, price, duration_minutes, description, created_at)
VALUES (1, 'Haircut & Beard', 50.00, 45, 'Professional haircut and beard trim', NOW());

-- =================
-- DATA STATISTICS
-- =================

-- Total bookings by status
SELECT status, COUNT(*) FROM bookings GROUP BY status;

-- Bookings by date
SELECT booking_date, COUNT(*) FROM bookings GROUP BY booking_date ORDER BY booking_date;

-- Customer frequency (who books most)
SELECT customer_email, COUNT(*) as booking_count 
FROM bookings 
GROUP BY customer_email 
ORDER BY booking_count DESC 
LIMIT 10;

-- Database size
SELECT pg_size_pretty(pg_database_size(current_database()));

-- Total records in each table
SELECT 'bookings' as table_name, COUNT(*) FROM bookings
UNION ALL
SELECT 'admins', COUNT(*) FROM admins
UNION ALL
SELECT 'services', COUNT(*) FROM services
UNION ALL
SELECT 'barbers', COUNT(*) FROM barbers;

-- =================
-- COLUMN REFERENCE
-- =================

-- TEXT COLUMNS (string data)
-- • customer_name: Name of the customer
-- • customer_email: Email for contact
-- • customer_phone: Phone number
-- • service: Service booked (e.g., 'The Executive Cut')
-- • barber: Name of barber (e.g., 'Arthur S.')
-- • booking_time: Time as string (e.g., '10:00 AM')
-- • email: Admin email address

-- DATE/TIME COLUMNS
-- • booking_date: Date of booking (YYYY-MM-DD format)
-- • created_at: When record created (timestamp)
-- • updated_at: When record last updated (timestamp)
-- • paid_at: When payment received (if payment table exists)

-- NUMERIC COLUMNS
-- • price: Service price in dollars
-- • duration_minutes: How long service takes
-- • id: Unique identifier

-- ENUM COLUMNS (specific allowed values)
-- • status: Can only be 'pending', 'confirmed', 'completed', 'cancelled'
-- • booking_statuses: Same as above, defined as type

-- =================
-- DATA TYPES
-- =====================================================
-- UUID: Unique identifier (example: 550e8400-e29b-41d4-a716-446655440000)
-- TEXT: String data (example: 'John Doe')
-- DECIMAL: Money amounts (example: 35.50)
-- INT: Whole numbers (example: 45)
-- TIMESTAMP: Date and time (example: 2026-05-20 14:30:00)
-- DATE: Date only (example: 2026-05-20)
-- TIME: Time only (example: 14:30)
-- BOOLEAN: True/False (example: true)

-- =================
-- COMMON MISTAKES
-- =================

-- ❌ WRONG: Missing quotes around string
-- SELECT * FROM bookings WHERE customer_name = John Doe;

-- ✅ RIGHT: Quotes around strings
-- SELECT * FROM bookings WHERE customer_name = 'John Doe';

-- ❌ WRONG: Date without quotes
-- SELECT * FROM bookings WHERE booking_date = 2026-05-20;

-- ✅ RIGHT: Date with quotes
-- SELECT * FROM bookings WHERE booking_date = '2026-05-20';

-- ❌ WRONG: Forgetting WHERE clause (deletes everything!)
-- DELETE FROM bookings;

-- ✅ RIGHT: Always specify condition
-- DELETE FROM bookings WHERE id = 'SPECIFIC_ID';

-- ❌ WRONG: Wrong column name
-- SELECT * FROM bookings WHERE customer_phone_number = '+1234567890';

-- ✅ RIGHT: Correct column name
-- SELECT * FROM bookings WHERE customer_phone = '+1234567890';

-- =================
-- TIME FORMAT EXAMPLES
-- =================

-- Valid booking_time values:
-- '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM'
-- '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM'

-- Valid booking_date format:
-- '2026-05-20' (YYYY-MM-DD)

-- Valid status values:
-- 'pending', 'confirmed', 'completed', 'cancelled'

-- =================
-- TROUBLESHOOTING QUICK TIPS
-- =================

-- Syntax error? Check for:
--   □ Missing quotes around text
--   □ Spelling of table/column names
--   □ Semicolon at end of query
--   □ Matching parentheses

-- No results? Check for:
--   □ Wrong date format
--   □ Extra spaces in strings
--   □ Wrong table name
--   □ Case sensitivity (sometimes)

-- Too many results? Add:
--   LIMIT 10  (to limit results)
--   WHERE status = 'pending'  (to filter)
--   ORDER BY booking_date DESC  (to sort)

-- Query too slow? Check:
--   □ Run PERFORMANCE_TROUBLESHOOTING.sql for analysis
--   □ Add more indexes
--   □ Archive old data
--   □ Check query execution plan

-- =================
-- FILES TO KEEP ORGANIZED
-- =================

-- Must Have:
-- /backend/SCHEMA.sql ← Create tables first!
-- /backend/.env ← Contains database credentials

-- Reference:
-- /backend/QUERIES.sql ← Common queries
-- /backend/SQL_QUICK_REFERENCE.sql ← This file
-- /backend/SQL_IMPLEMENTATION_GUIDE.sql ← Setup instructions

-- Advanced (Optional):
-- /backend/BACKUP_RESTORE.sql ← Backup procedures
-- /backend/MIGRATIONS.sql ← Future feature schemas
-- /backend/PERFORMANCE_TROUBLESHOOTING.sql ← Optimization

-- =================
-- FILE LOCATIONS
-- =================

-- SQL Files in: /backend/
-- ├── SCHEMA.sql ← Create tables
-- ├── QUERIES.sql ← Query examples
-- ├── BACKUP_RESTORE.sql ← Data backup
-- ├── MIGRATIONS.sql ← Advanced features
-- ├── PERFORMANCE_TROUBLESHOOTING.sql ← Optimization
-- ├── SQL_IMPLEMENTATION_GUIDE.sql ← Setup guide
-- └── SQL_QUICK_REFERENCE.sql ← This file

-- Backend code in: /backend/
-- ├── main.go ← HTTP server
-- ├── database.go ← Database connection
-- ├── .env ← Credentials (don't share!)
-- └── go.mod ← Dependencies

-- Frontend code in: /frontend/
-- ├── src/
-- │  ├── pages/ ← React pages
-- │  ├── components/ ← React components
-- │  └── App.tsx ← Main app
-- └── public/ ← Static files

-- =================
-- KEYBOARD SHORTCUTS (in Supabase)
-- =================

-- Run query: Ctrl+Enter (Windows) or Cmd+Enter (Mac)
-- Format SQL: Ctrl+Shift+F
-- New query: Ctrl+K
-- Go to line: Ctrl+G

-- =================
-- IMPORTANT URLS
-- =================

-- Frontend: http://localhost:5175
-- Backend: http://localhost:8080
-- Supabase: https://app.supabase.com
-- Project URL: https://gurkqhvxxzlxveemqzfe.supabase.co

-- =================
-- END OF QUICK REFERENCE
-- =================

-- Print this file or save as bookmark!
-- Questions? See SQL_IMPLEMENTATION_GUIDE.sql

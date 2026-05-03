-- =====================================================
-- MASTER BARBER - DATABASE BACKUP & RESTORE
-- =====================================================

-- =====================================================
-- SECTION 1: EXPORT DATA (For Backup)
-- =====================================================

-- Export all bookings as CSV format
-- Run in Supabase: Copy the results and paste into CSV file
SELECT 
    id,
    customer_name,
    customer_email,
    customer_phone,
    service,
    barber,
    booking_date,
    booking_time,
    status,
    created_at
FROM bookings
ORDER BY booking_date DESC;

-- Export all admins
SELECT id, email, created_at FROM admins;

-- Export all services
SELECT * FROM services ORDER BY category;

-- =====================================================
-- SECTION 2: DATA IMPORT (From Backup)
-- =====================================================

-- Import bookings from backup
-- Format: id | customer_name | customer_email | customer_phone | service | barber | booking_date | booking_time | status | created_at
INSERT INTO bookings (id, customer_name, customer_email, customer_phone, service, barber, booking_date, booking_time, status, created_at)
VALUES 
    ('BOOK-BACKUP-001', 'John Doe', 'john@example.com', '+1234567890', 'The Executive Cut', 'Arthur S.', '2026-05-15', '10:00 AM', 'confirmed', NOW()),
    ('BOOK-BACKUP-002', 'Jane Smith', 'jane@example.com', '+1234567891', 'Beard Sculpting', 'Thomas S.', '2026-05-16', '02:00 PM', 'pending', NOW());

-- =====================================================
-- SECTION 3: ARCHIVE OLD DATA
-- =====================================================

-- Create archive table
CREATE TABLE IF NOT EXISTS bookings_archive AS
SELECT * FROM bookings WHERE booking_date < '2026-01-01';

-- Move old bookings to archive
INSERT INTO bookings_archive 
SELECT * FROM bookings WHERE booking_date < '2026-01-01';

-- Delete archived bookings from main table
DELETE FROM bookings WHERE booking_date < '2026-01-01';

-- View archived bookings
SELECT * FROM bookings_archive ORDER BY booking_date DESC;

-- =====================================================
-- SECTION 4: DATABASE RESET (CAUTION!)
-- =====================================================

-- WARNING: These commands will delete all data!
-- Only use in development environment!

-- Option 1: Delete all bookings (keep schema)
-- DELETE FROM bookings;

-- Option 2: Delete all data and reset sequences
-- DELETE FROM bookings;
-- DELETE FROM admins;
-- DELETE FROM services;
-- DELETE FROM barbers;
-- ALTER SEQUENCE admins_id_seq RESTART WITH 1;
-- ALTER SEQUENCE services_id_seq RESTART WITH 1;
-- ALTER SEQUENCE barbers_id_seq RESTART WITH 1;

-- Option 3: Drop all tables (requires recreating schema)
-- DROP TABLE IF EXISTS audit_logs CASCADE;
-- DROP TABLE IF EXISTS availability CASCADE;
-- DROP TABLE IF EXISTS bookings CASCADE;
-- DROP TABLE IF EXISTS admins CASCADE;
-- DROP TABLE IF EXISTS services CASCADE;
-- DROP TABLE IF EXISTS barbers CASCADE;

-- =====================================================
-- SECTION 5: DATA VALIDATION
-- =====================================================

-- Check for invalid dates (bookings in the past)
SELECT * FROM bookings WHERE booking_date < CURRENT_DATE AND status = 'pending';

-- Check for orphaned records (bookings with non-existent barbers)
SELECT DISTINCT barber FROM bookings 
WHERE barber NOT IN (SELECT name FROM barbers);

-- Check for duplicate bookings
SELECT 
    customer_email,
    booking_date,
    booking_time,
    COUNT(*) as duplicate_count
FROM bookings
GROUP BY customer_email, booking_date, booking_time
HAVING COUNT(*) > 1;

-- Check for bookings without customer email
SELECT * FROM bookings WHERE customer_email IS NULL OR customer_email = '';

-- =====================================================
-- SECTION 6: DATA CLEANUP
-- =====================================================

-- Remove duplicate bookings (keep only first)
DELETE FROM bookings 
WHERE id NOT IN (
    SELECT MIN(id) FROM bookings 
    GROUP BY customer_email, booking_date, booking_time
);

-- Remove pending bookings older than 30 days
DELETE FROM bookings 
WHERE status = 'pending' 
AND booking_date < CURRENT_DATE - INTERVAL '30 days';

-- Remove cancelled bookings older than 90 days
DELETE FROM bookings 
WHERE status = 'cancelled' 
AND booking_date < CURRENT_DATE - INTERVAL '90 days';

-- Fix invalid statuses (set to 'pending' if unknown)
UPDATE bookings 
SET status = 'pending' 
WHERE status NOT IN ('pending', 'confirmed', 'cancelled', 'completed');

-- =====================================================
-- SECTION 7: DATA MIGRATION
-- =====================================================

-- Migrate bookings from old table (if exists)
INSERT INTO bookings (id, customer_name, customer_email, customer_phone, service, barber, booking_date, booking_time, status, created_at)
SELECT id, customer_name, customer_email, customer_phone, service, barber, booking_date, booking_time, status, created_at
FROM bookings_old
WHERE id NOT IN (SELECT id FROM bookings);

-- Update barber names to match new naming convention
UPDATE bookings SET barber = 'Arthur S.' WHERE barber IN ('arthur', 'ARTHUR', 'Arthur');
UPDATE bookings SET barber = 'Thomas S.' WHERE barber IN ('thomas', 'THOMAS', 'Thomas');

-- Normalize service names
UPDATE bookings SET service = 'The Executive Cut' WHERE service IN ('Executive Haircut', 'Executive', 'Haircut');

-- =====================================================
-- SECTION 8: VERIFICATION QUERIES
-- =====================================================

-- Before backup checklist
SELECT 
    'Total Bookings' as check_item, COUNT(*) as count FROM bookings
UNION ALL
SELECT 'Pending Bookings', COUNT(*) FROM bookings WHERE status = 'pending'
UNION ALL
SELECT 'Confirmed Bookings', COUNT(*) FROM bookings WHERE status = 'confirmed'
UNION ALL
SELECT 'Total Admins', COUNT(*) FROM admins
UNION ALL
SELECT 'Total Services', COUNT(*) FROM services
UNION ALL
SELECT 'Total Barbers', COUNT(*) FROM barbers;

-- Check backup completeness
SELECT 
    'Bookings' as table_name, COUNT(*) as record_count FROM bookings
UNION ALL
SELECT 'Admins_Archive', COUNT(*) FROM bookings_archive;

-- =====================================================
-- SECTION 9: RESTORE FROM BACKUP
-- =====================================================

-- Restore all data from archive
INSERT INTO bookings
SELECT * FROM bookings_archive
WHERE id NOT IN (SELECT id FROM bookings);

-- Verify restore
SELECT 
    (SELECT COUNT(*) FROM bookings) as current_bookings,
    (SELECT COUNT(*) FROM bookings_archive) as archived_bookings;

-- =====================================================
-- NOTES FOR BACKUP/RESTORE
-- =====================================================
-- 1. Always test restore procedure in development first
-- 2. Keep multiple backup copies in different locations
-- 3. Document backup date and contents
-- 4. Test restore after backup to verify integrity
-- 5. Keep backup encryption if sensitive data
-- 6. Schedule regular automated backups
-- 7. Maintain changelog of backups
-- 8. Consider point-in-time recovery needs

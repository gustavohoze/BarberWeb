-- Master Barber - Database Setup SQL Scripts
-- Run these in Supabase SQL Editor

-- ============================================
-- 1. CREATE ADMIN USER
-- ============================================
INSERT INTO admins (email, password_hash, created_at)
VALUES ('admin@masterbarber.com', 'password123', NOW())
ON CONFLICT (email) DO NOTHING;

-- Verify admin was created:
SELECT * FROM admins;

-- ============================================
-- 2. VIEW ALL BOOKINGS
-- ============================================
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

-- ============================================
-- 3. VIEW PENDING BOOKINGS ONLY
-- ============================================
SELECT * FROM bookings
WHERE status = 'pending'
ORDER BY booking_date DESC;

-- ============================================
-- 4. UPDATE BOOKING STATUS
-- ============================================
-- Change 'BOOK-1' to your booking ID
UPDATE bookings
SET status = 'confirmed', updated_at = NOW()
WHERE id = 'BOOK-1';

-- ============================================
-- 5. DELETE A BOOKING
-- ============================================
-- Change 'BOOK-1' to the booking ID to delete
DELETE FROM bookings WHERE id = 'BOOK-1';

-- ============================================
-- 6. GET STATISTICS
-- ============================================
SELECT 
  status,
  COUNT(*) as total,
  COUNT(CASE WHEN DATE(booking_date) = CURRENT_DATE THEN 1 END) as today
FROM bookings
GROUP BY status;

-- ============================================
-- 7. RESET DATABASE (CAUTION!)
-- ============================================
-- Delete all bookings (WARNING: Cannot undo!)
DELETE FROM bookings;

-- Delete all admins (WARNING: Cannot undo!)
DELETE FROM admins;

-- ============================================
-- 8. CREATE SAMPLE DATA
-- ============================================
INSERT INTO bookings (id, customer_name, customer_email, customer_phone, service, barber, booking_date, booking_time, status, created_at)
VALUES 
  ('BOOK-100', 'John Smith', 'john@example.com', '+1234567890', 'The Executive Cut', 'Arthur S.', '2026-05-10', '09:00 AM', 'confirmed', NOW()),
  ('BOOK-101', 'Jane Doe', 'jane@example.com', '+1234567891', 'Beard Sculpting', 'Thomas S.', '2026-05-10', '10:00 AM', 'pending', NOW()),
  ('BOOK-102', 'Bob Johnson', 'bob@example.com', '+1234567892', 'The Master\'s Shave', 'Arthur S.', '2026-05-11', '02:00 PM', 'pending', NOW());

-- Verify sample data:
SELECT * FROM bookings;

-- ============================================
-- TIPS:
-- ============================================
-- 1. Replace BOOK-1, BOOK-100 with actual IDs
-- 2. Run one query at a time
-- 3. Check results before running DELETE
-- 4. Use ORDER BY to sort results
-- 5. See Query info for row counts

-- =====================================================
-- MASTER BARBER - DATABASE PERFORMANCE & TROUBLESHOOTING
-- =====================================================

-- =====================================================
-- SECTION 1: PERFORMANCE MONITORING
-- =====================================================

-- Check table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS table_size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check index usage
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan as scans,
    idx_tup_read as tuples_read,
    idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- Find unused indexes (candidates for removal)
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_size,
    pg_size_pretty(pg_relation_size(indexrelid)) as index_size
FROM pg_stat_user_indexes
WHERE idx_scan = 0
AND indexname NOT LIKE 'pg_toast%'
ORDER BY pg_relation_size(indexrelid) DESC;

-- Check slow queries (requires pg_stat_statements extension)
-- SELECT 
--     query,
--     calls,
--     mean_time,
--     max_time
-- FROM pg_stat_statements
-- ORDER BY mean_time DESC
-- LIMIT 10;

-- =====================================================
-- SECTION 2: DATA INTEGRITY CHECKS
-- =====================================================

-- Check for NULL values where they shouldn't be
SELECT 
    'bookings' as table_name,
    COUNT(*) as null_count
FROM bookings
WHERE customer_email IS NULL OR customer_name IS NULL OR booking_date IS NULL
UNION ALL
SELECT 'admins', COUNT(*) FROM admins WHERE email IS NULL OR password_hash IS NULL
UNION ALL
SELECT 'services', COUNT(*) FROM services WHERE name IS NULL OR price IS NULL
UNION ALL
SELECT 'barbers', COUNT(*) FROM barbers WHERE name IS NULL;

-- Check for duplicate entries
SELECT customer_email, booking_date, booking_time, COUNT(*) 
FROM bookings 
GROUP BY customer_email, booking_date, booking_time 
HAVING COUNT(*) > 1;

-- Check referential integrity (bookings with non-existent barbers)
SELECT DISTINCT b.barber FROM bookings b
WHERE b.barber NOT IN (SELECT name FROM barbers);

-- Check date validity (future bookings that shouldn't be)
SELECT * FROM bookings 
WHERE booking_date < CURRENT_DATE AND status IN ('pending', 'confirmed');

-- Check for orphaned records
SELECT COUNT(*) as orphaned_booking_count 
FROM bookings b 
WHERE NOT EXISTS (SELECT 1 FROM barbers WHERE name = b.barber);

-- =====================================================
-- SECTION 3: QUERY OPTIMIZATION
-- =====================================================

-- Index recommendations for common queries
-- These should already exist from SCHEMA.sql, but verify:

-- Verify indexes exist
\d bookings
\d admins
\d services
\d barbers

-- Create missing indexes if needed
CREATE INDEX IF NOT EXISTS idx_bookings_barber ON bookings(barber);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_email ON bookings(customer_email);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date_time ON bookings(booking_date, booking_time);

-- Analyze query performance
EXPLAIN ANALYZE
SELECT * FROM bookings WHERE booking_date = CURRENT_DATE ORDER BY booking_time;

-- Find booking by date range efficiently
EXPLAIN ANALYZE
SELECT b.*, s.price 
FROM bookings b 
LEFT JOIN services s ON b.service = s.name
WHERE b.booking_date BETWEEN '2026-05-01' AND '2026-05-31'
AND b.status != 'cancelled'
ORDER BY b.booking_date, b.booking_time;

-- =====================================================
-- SECTION 4: CONNECTION DIAGNOSTICS
-- =====================================================

-- Check active connections
SELECT 
    pid,
    usename,
    application_name,
    state,
    query,
    query_start
FROM pg_stat_activity
WHERE datname = current_database()
AND pid <> pg_backend_pid();

-- Check connection limits
SHOW max_connections;
SELECT count(*) as current_connections FROM pg_stat_activity;

-- Kill long-running queries (if needed)
-- SELECT pg_terminate_backend(pid)
-- FROM pg_stat_activity
-- WHERE duration > INTERVAL '5 minutes'
-- AND usename != 'postgres';

-- =====================================================
-- SECTION 5: BACKUP VERIFICATION
-- =====================================================

-- Record backup metadata
CREATE TABLE IF NOT EXISTS backup_metadata (
    id BIGSERIAL PRIMARY KEY,
    backup_name VARCHAR(255) NOT NULL,
    backup_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    table_count INT,
    total_records INT,
    backup_size_bytes BIGINT,
    backup_location VARCHAR(500),
    notes TEXT,
    verified_at TIMESTAMP
);

-- Log backup information
INSERT INTO backup_metadata (backup_name, table_count, total_records, notes)
VALUES (
    'backup_' || TO_CHAR(CURRENT_TIMESTAMP, 'YYYY-MM-DD-HH24-MI'),
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public'),
    (SELECT COUNT(*) FROM bookings) + 
    (SELECT COUNT(*) FROM admins) + 
    (SELECT COUNT(*) FROM services) + 
    (SELECT COUNT(*) FROM barbers),
    'Automated backup created from application'
);

-- =====================================================
-- SECTION 6: COMMON ISSUES & SOLUTIONS
-- =====================================================

-- ISSUE 1: Slow booking queries
-- SOLUTION: Add indexes on frequently searched columns
CREATE INDEX IF NOT EXISTS idx_bookings_date_barber 
ON bookings(booking_date, barber) 
WHERE status != 'cancelled';

-- ISSUE 2: Duplicate bookings (race condition)
-- SOLUTION: Add unique constraint
ALTER TABLE bookings 
ADD CONSTRAINT bookings_unique_slot 
UNIQUE (booking_date, booking_time, barber) DEFERRABLE INITIALLY DEFERRED;

-- ISSUE 3: Null values in bookings
-- SOLUTION: Add NOT NULL constraints if not already present
-- ALTER TABLE bookings ALTER COLUMN customer_email SET NOT NULL;
-- ALTER TABLE bookings ALTER COLUMN booking_date SET NOT NULL;

-- ISSUE 4: Storage bloat (need VACUUM)
VACUUM ANALYZE bookings;
VACUUM ANALYZE admins;
VACUUM ANALYZE services;
VACUUM ANALYZE barbers;

-- ISSUE 5: Large booking table (archiving old records)
-- Archive bookings from 2 years ago
BEGIN TRANSACTION;
    CREATE TABLE bookings_archive_2024 AS
    SELECT * FROM bookings WHERE booking_date < '2024-06-01';
    DELETE FROM bookings WHERE booking_date < '2024-06-01';
    SELECT COUNT(*) as archived_records FROM bookings_archive_2024;
COMMIT;

-- =====================================================
-- SECTION 7: OPTIMIZATION RECOMMENDATIONS
-- =====================================================

-- Partitioning by date (for very large tables)
-- Useful when bookings table grows to millions of records
-- CREATE TABLE bookings_2026_q2 PARTITION OF bookings
--     FOR VALUES FROM ('2026-04-01') TO ('2026-07-01');

-- Materialized views for reporting
CREATE MATERIALIZED VIEW IF NOT EXISTS booking_statistics AS
SELECT 
    DATE(booking_date) as booking_date,
    barber,
    COUNT(*) as total_bookings,
    COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
    COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed
FROM bookings
GROUP BY DATE(booking_date), barber;

-- Refresh materialized view
REFRESH MATERIALIZED VIEW booking_statistics;

-- Create index on materialized view for better query performance
CREATE INDEX idx_booking_stats_date ON booking_statistics(booking_date DESC);

-- =====================================================
-- SECTION 8: DATA ARCHIVAL STRATEGY
-- =====================================================

-- Archive completed bookings older than 1 year
CREATE TABLE IF NOT EXISTS bookings_archive_completed AS
SELECT * FROM bookings 
WHERE status = 'completed' 
AND booking_date < CURRENT_DATE - INTERVAL '1 year';

-- Delete archived records from main table
DELETE FROM bookings 
WHERE status = 'completed' 
AND booking_date < CURRENT_DATE - INTERVAL '1 year'
AND id IN (SELECT id FROM bookings_archive_completed);

-- Archive cancelled bookings older than 6 months
CREATE TABLE IF NOT EXISTS bookings_archive_cancelled AS
SELECT * FROM bookings 
WHERE status = 'cancelled' 
AND booking_date < CURRENT_DATE - INTERVAL '6 months';

DELETE FROM bookings 
WHERE status = 'cancelled' 
AND booking_date < CURRENT_DATE - INTERVAL '6 months'
AND id IN (SELECT id FROM bookings_archive_cancelled);

-- Query archived bookings when needed
SELECT * FROM bookings_archive_completed 
WHERE barber = 'Arthur S.' 
ORDER BY booking_date DESC;

-- =====================================================
-- SECTION 9: REPLICATION & FAILOVER
-- =====================================================

-- Setup read replica (Supabase handles this)
-- View replication status
-- SELECT 
--     slot_name,
--     slot_type,
--     active,
--     restart_lsn
-- FROM pg_replication_slots;

-- Check replication lag (for replica)
-- SELECT 
--     now() - pg_last_xact_replay_timestamp() as replication_lag;

-- =====================================================
-- SECTION 10: STATISTICS & HEALTH SUMMARY
-- =====================================================

-- Get comprehensive database health report
SELECT 
    'Total Bookings' as metric, COUNT(*)::TEXT as value FROM bookings
UNION ALL
SELECT 'Total Admins', COUNT(*)::TEXT FROM admins
UNION ALL
SELECT 'Total Services', COUNT(*)::TEXT FROM services
UNION ALL
SELECT 'Total Barbers', COUNT(*)::TEXT FROM barbers
UNION ALL
SELECT 'Database Size', pg_size_pretty(pg_database_size(current_database()))
UNION ALL
SELECT 'Active Connections', count(*)::TEXT FROM pg_stat_activity
UNION ALL
SELECT 'Table Count', count(*)::TEXT FROM information_schema.tables 
    WHERE table_schema = 'public'
UNION ALL
SELECT 'Index Count', count(*)::TEXT FROM pg_stat_user_indexes
UNION ALL
SELECT 'Pending Bookings', COUNT(*)::TEXT FROM bookings 
    WHERE status = 'pending'
UNION ALL
SELECT 'Confirmed Bookings', COUNT(*)::TEXT FROM bookings 
    WHERE status = 'confirmed'
UNION ALL
SELECT 'Future Bookings', COUNT(*)::TEXT FROM bookings 
    WHERE booking_date >= CURRENT_DATE;

-- =====================================================
-- NOTES FOR TROUBLESHOOTING
-- =====================================================
-- 1. Always check Supabase dashboard for errors first
-- 2. Monitor query performance regularly
-- 3. Keep vacuum and analyze scheduled
-- 4. Maintain regular backups
-- 5. Test backup restoration procedures
-- 6. Set up monitoring alerts for anomalies
-- 7. Review logs for connection errors
-- 8. Document all schema changes
-- 9. Plan for data archival as tables grow
-- 10. Consider Read Replicas for heavy read workloads

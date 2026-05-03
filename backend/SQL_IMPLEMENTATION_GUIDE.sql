-- =====================================================
-- MASTER BARBER - SQL IMPLEMENTATION GUIDE
-- =====================================================
-- Complete step-by-step instructions for setting up
-- the Master Barber database in Supabase
-- =====================================================

/*
QUICK START:
1. Go to https://app.supabase.com
2. Open your project "Master Barber"
3. Click "SQL Editor" in the left sidebar
4. Copy and paste SCHEMA.sql → Click Run
5. Verify tables in "Data" → "Tables" tab
6. Done! Your database is ready.

TROUBLESHOOTING:
- If you get errors, see TROUBLESHOOTING section below
- Check Supabase documentation: https://supabase.com/docs
- View database logs in Supabase dashboard
*/

-- =====================================================
-- IMPLEMENTATION PHASES
-- =====================================================

-- PHASE 1: Core Database Schema (REQUIRED)
-- File: SCHEMA.sql
-- Time: 2-3 minutes
-- What it does:
--   • Creates admins table (login credentials)
--   • Creates bookings table (all booking data)
--   • Creates barbers table (staff info)
--   • Creates services table (services & pricing)
--   • Creates booking_statuses enum (status types)
--   • Creates all indexes for performance
--   • Creates Row Level Security policies
-- 
-- How to apply:
--   1. Open SCHEMA.sql file
--   2. Copy entire content
--   3. In Supabase SQL Editor, paste content
--   4. Click "Run"
--   5. Verify: Go to Data tab → check tables exist

-- PHASE 2: Common Queries Reference (OPTIONAL)
-- File: QUERIES.sql
-- Time: 1 minute (just for reference)
-- What it does:
--   • Provides SQL query templates for common operations
--   • Examples: SELECT bookings, INSERT booking, UPDATE status
--   • Not executable SQL - just reference code
-- 
-- How to use:
--   • Keep this file open while developing backend
--   • Copy query patterns as needed
--   • Modify parameters for your use case

-- PHASE 3: Backup & Restore (OPTIONAL)
-- File: BACKUP_RESTORE.sql
-- Time: Optional, set up as needed
-- What it does:
--   • Provides export/import procedures
--   • Data archival strategies
--   • Data validation queries
--   • Database reset commands (CAUTION)
-- 
-- When to use:
--   • After you have production data to back up
--   • When migrating data between environments
--   • Testing recovery procedures

-- PHASE 4: Advanced Migrations (OPTIONAL)
-- File: MIGRATIONS.sql
-- Time: Optional, apply incrementally
-- What it does:
--   • Version 1.1: Add audit logging
--   • Version 1.2: Add availability calendar
--   • Version 1.3: Add customer profiles
--   • Version 2.0: Add payment integration
--   • Version 2.1: Add email templates
--   • Version 2.2: Add review system
--   • Version 2.3: Add notifications
-- 
-- When to use:
--   • Apply one at a time as features are needed
--   • Test each migration in development first
--   • Track versions in schema_versions table
--   • Read instructions before applying each

-- PHASE 5: Performance & Troubleshooting (REFERENCE)
-- File: PERFORMANCE_TROUBLESHOOTING.sql
-- Time: Ongoing reference
-- What it does:
--   • Performance monitoring queries
--   • Data integrity checks
--   • Query optimization tips
--   • Common issue solutions
--   • Archival strategies
-- 
-- When to use:
--   • Monitor database health
--   • Investigate slow queries
--   • Fix data integrity issues
--   • Optimize as data grows

-- =====================================================
-- STEP-BY-STEP SETUP CHECKLIST
-- =====================================================

/*
STEP 1: Access Supabase SQL Editor
[ ] Open https://app.supabase.com
[ ] Select "Master Barber" project
[ ] Click "SQL Editor" in left sidebar
[ ] Click "New Query" button (top right)

STEP 2: Create Core Schema
[ ] Open file: /backend/SCHEMA.sql
[ ] Select all content (Ctrl+A or Cmd+A)
[ ] Copy (Ctrl+C or Cmd+C)
[ ] In Supabase SQL Editor, paste
[ ] Click "Run" button
[ ] Wait for success message
[ ] Check in "Data" tab that tables created

STEP 3: Verify Tables Created
[ ] In Supabase dashboard, click "Data" tab
[ ] Check "Tables" list on left sidebar
[ ] Should see: admins, bookings, barbers, services
[ ] Click each table to verify columns exist
[ ] Verify indexes exist (click table → "Indexes" tab)

STEP 4: Test Connection from Backend
[ ] Open terminal in project folder
[ ] Run: ./start.sh (macOS/Linux) or start.bat (Windows)
[ ] Check backend logs for "✓ Connected to database"
[ ] If error, see Troubleshooting section below

STEP 5: Verify End-to-End
[ ] Frontend should load at http://localhost:5175
[ ] Click "Admin Login"
[ ] Enter: admin@masterbarber.com / password123
[ ] Should redirect to Admin Dashboard
[ ] Go to "New Booking"
[ ] Fill out booking form completely
[ ] Click Submit
[ ] Should see "Booking confirmed!" message
[ ] Go back to Admin Dashboard
[ ] Your booking should appear in the table
[ ] Check Supabase Data → bookings table
[ ] Your booking data should be visible there too

STEP 6: (Optional) Set Up Audit Logging
[ ] After confirming database works
[ ] Open file: /backend/MIGRATIONS.sql
[ ] Find "MIGRATION VERSION 2" section
[ ] Copy just that migration block
[ ] Paste into Supabase SQL Editor
[ ] Click Run
[ ] This enables automatic logging of all changes

STEP 7: (Optional) Schedule Backups
[ ] In Supabase dashboard, click "Settings"
[ ] Find "Backups" section
[ ] Enable automated backups (daily recommended)
[ ] Configure retention period
[ ] This ensures data recovery in case of issues
*/

-- =====================================================
-- TROUBLESHOOTING
-- =====================================================

/*
PROBLEM 1: "syntax error at or near CREATE TABLE"
SOLUTION:
  • Ensure you're using correct Supabase project
  • Check that SQL pasted completely (not truncated)
  • Try running just one CREATE TABLE statement first
  • Check for special characters that got corrupted in copy/paste

PROBLEM 2: "permission denied" or "insufficient privileges"
SOLUTION:
  • Supabase account must have owner/admin role
  • Check project permissions in Supabase settings
  • Create new connection with proper credentials
  • Contact Supabase support if issue persists

PROBLEM 3: Backend reports "connection refused"
SOLUTION:
  • Verify .env file has correct SUPABASE_URL and SUPABASE_KEY
  • Check that database schema was created (tables exist)
  • Restart backend: Ctrl+C to stop, then ./start.sh again
  • Check internet connection
  • Verify Supabase project status (not suspended)

PROBLEM 4: Backend shows "unknown column" error
SOLUTION:
  • Verify SCHEMA.sql ran completely without errors
  • Check table structure in Supabase Data tab
  • Look for typos in column names
  • Confirm all tables and indexes created

PROBLEM 5: "duplicate key value violates unique constraint"
SOLUTION:
  • Your data already has duplicate bookings/emails
  • Run BACKUP_RESTORE.sql → "Data Cleanup" section
  • This removes duplicates and invalid data
  • Then retry the operation

PROBLEM 6: Database is slow / queries timeout
SOLUTION:
  • Run PERFORMANCE_TROUBLESHOOTING.sql
  • Look for missing indexes (section 4)
  • Archive old data (section 6)
  • Check table sizes
  • Optimize queries as needed

PROBLEM 7: "relation 'bookings' does not exist"
SOLUTION:
  • SCHEMA.sql didn't run successfully
  • Go to Data tab and verify tables exist
  • If missing, run SCHEMA.sql again
  • Check for error messages in SQL Editor

PROBLEM 8: Can't log in with admin account
SOLUTION:
  • Default account: admin@masterbarber.com / password123
  • Verify account exists: Run "SELECT * FROM admins;"
  • If empty, insert test admin:
    INSERT INTO admins (id, email, password_hash, created_at)
    VALUES (gen_random_uuid(), 'admin@masterbarber.com', 'hashed_password', NOW());
  • Check backend logs for auth errors

PROBLEM 9: Booking form submits but data doesn't appear
SOLUTION:
  • Check backend is running: http://localhost:8080/api/health
  • Check backend logs for errors
  • Verify bookings table has data: SELECT COUNT(*) FROM bookings;
  • Check browser console for JavaScript errors
  • Review network tab to see API response

PROBLEM 10: "SUPABASE_URL or SUPABASE_KEY not set"
SOLUTION:
  • Open /backend/.env file
  • Verify SUPABASE_URL is set (starts with https://)
  • Verify SUPABASE_KEY is set (long string)
  • If not set, copy from Supabase:
    • Go to Project Settings → API
    • Copy "Project URL" → paste as SUPABASE_URL
    • Copy "Service Role secret" → paste as SUPABASE_KEY
  • Restart backend
*/

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

/*
Run these queries to verify everything is set up correctly:

1. Check all tables exist:
   SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

2. Verify bookings table structure:
   \d bookings

3. Count existing data:
   SELECT COUNT(*) FROM bookings;
   SELECT COUNT(*) FROM admins;
   SELECT COUNT(*) FROM services;

4. Check indexes:
   SELECT indexname FROM pg_indexes WHERE tablename = 'bookings';

5. Verify Row Level Security:
   SELECT * FROM pg_policies WHERE table_name = 'bookings';

6. Test backend connection:
   SELECT NOW(); -- If this runs, connection works
*/

-- =====================================================
-- SQL FILES EXECUTION ORDER
-- =====================================================

/*
RECOMMENDED EXECUTION ORDER:

FIRST (Required):
  1. SCHEMA.sql - Creates core database structure

THEN (As needed):
  2. BACKUP_RESTORE.sql - For backups and cleanup
  3. PERFORMANCE_TROUBLESHOOTING.sql - For monitoring
  4. MIGRATIONS.sql - For adding new features

DO NOT RUN:
  • Any migration if you don't need that feature yet
  • Rollback commands unless specifically fixing an issue
  • Reset/delete commands unless certain of data loss
*/

-- =====================================================
-- FILE DESCRIPTIONS
-- =====================================================

/*
SCHEMA.sql (170+ lines)
├─ Main tables:
│  ├─ admins: Login credentials for admin panel
│  ├─ bookings: All customer bookings
│  ├─ barbers: Staff member information
│  └─ services: Services offered and pricing
├─ Enums:
│  └─ booking_statuses: pending, confirmed, completed, cancelled
├─ Indexes: For query performance
├─ Constraints: For data integrity
└─ Row Level Security: For data privacy

QUERIES.sql (60+ lines)
├─ SELECT queries for retrieving data
├─ INSERT queries for creating bookings
├─ UPDATE queries for changing status
├─ JOIN queries for reports
└─ Aggregation queries for statistics

BACKUP_RESTORE.sql (120+ lines)
├─ Export/import procedures
├─ Data archival strategies
├─ Data validation checks
├─ Cleanup procedures
└─ Archive querying examples

MIGRATIONS.sql (250+ lines)
├─ Version 1.1: Audit logging
├─ Version 1.2: Availability calendar
├─ Version 1.3: Customer profiles
├─ Version 2.0: Payment integration
├─ Version 2.1: Email templates
├─ Version 2.2: Review system
├─ Version 2.3: Notifications
├─ Schema version tracking
└─ Rollback procedures

PERFORMANCE_TROUBLESHOOTING.sql (200+ lines)
├─ Performance monitoring queries
├─ Data integrity checks
├─ Query optimization examples
├─ Connection diagnostics
├─ Backup verification
├─ Common issues & solutions
├─ Optimization recommendations
└─ Health summary dashboard
*/

-- =====================================================
-- MAINTENANCE SCHEDULE
-- =====================================================

/*
DAILY:
  • Monitor bookings table for issues
  • Check for failed bookings
  • Review admin notifications

WEEKLY:
  • Run data integrity checks
  • Archive cancelled/completed old bookings
  • Review performance metrics
  • Check for slow queries

MONTHLY:
  • Full database backup
  • Review and optimize indexes
  • Archive data over 3 months old
  • Update statistics (VACUUM ANALYZE)

QUARTERLY:
  • Review schema for improvements
  • Plan for future migrations
  • Performance optimization
  • Capacity planning

ANNUALLY:
  • Archive data over 1 year old
  • Review security policies
  • Update documentation
  • Plan major version upgrades
*/

-- =====================================================
-- NEXT STEPS AFTER SETUP
-- =====================================================

/*
1. Add Test Data
   • Create test bookings
   • Create multiple admin accounts
   • Add barber profiles
   • Add service pricing

2. Configure Backend Features
   • Email notifications on booking
   • SMS reminders 24 hours before
   • Payment processing integration
   • Admin features (edit/delete/confirm)

3. Deploy to Production
   • Set up monitoring and alerts
   • Enable automated backups
   • Configure production environment variables
   • Set up CI/CD pipeline
   • Test full flow in production

4. Optimize Performance
   • Monitor slow queries
   • Adjust indexes as needed
   • Cache frequently accessed data
   • Archive old data periodically

5. Add Advanced Features
   • Customer account system
   • Loyalty/rewards program
   • Service packages and bundles
   • Availability management
   • Staff scheduling
*/

-- =====================================================
-- SUPPORT & DOCUMENTATION
-- =====================================================

/*
RESOURCES:
  • Supabase Documentation: https://supabase.com/docs
  • PostgreSQL Documentation: https://www.postgresql.org/docs
  • Project README: /README.md
  • Setup Guide: /SETUP_GUIDE.md
  • Backend Info: /backend/README.md

CONTACT:
  • Check backend logs: stdout from ./start.sh
  • Check browser console: F12 → Console tab
  • Check Supabase logs: Project → Logs tab
  • Review recent changes in git history

DATABASE CREDENTIALS:
  • Location: /backend/.env
  • File contains: SUPABASE_URL, SUPABASE_KEY, JWT_SECRET
  • Never commit .env to git
  • Update if you change credentials in Supabase
*/

-- End of SQL Implementation Guide

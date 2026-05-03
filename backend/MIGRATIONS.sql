-- =====================================================
-- MASTER BARBER - DATABASE MIGRATIONS & DDL
-- =====================================================
-- Version Control: Track schema changes over time
-- Run migrations in order to evolve the database schema
-- =====================================================

-- =====================================================
-- MIGRATION VERSION 1: Initial Schema (v1.0.0)
-- =====================================================
-- Created: 2026-05-01
-- Status: APPLIED
-- Description: Create initial database schema with core tables

-- Already applied via SCHEMA.sql
-- This is for reference and versioning

-- =====================================================
-- MIGRATION VERSION 2: Add Audit Logging (v1.1.0)
-- =====================================================
-- Created: 2026-05-05
-- Status: READY TO APPLY
-- Description: Add audit_logs table to track booking changes

CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL, -- 'created', 'updated', 'cancelled', 'completed'
    changed_by VARCHAR(255) DEFAULT 'system',
    changes JSONB, -- Store what changed: {"status": {"old": "pending", "new": "confirmed"}}
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT audit_logs_action_check CHECK (action IN ('created', 'updated', 'cancelled', 'completed'))
);

CREATE INDEX idx_audit_logs_booking_id ON audit_logs(booking_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- Trigger to automatically log booking changes
CREATE OR REPLACE FUNCTION log_booking_change()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_logs (booking_id, action, changes)
        VALUES (NEW.id, 'created', jsonb_build_object(
            'customer_name', NEW.customer_name,
            'service', NEW.service,
            'booking_date', NEW.booking_date
        ));
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_logs (booking_id, action, changes)
        VALUES (NEW.id, 'updated', jsonb_build_object(
            'status', jsonb_build_object('old', OLD.status, 'new', NEW.status),
            'barber', jsonb_build_object('old', OLD.barber, 'new', NEW.barber)
        ));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger
DROP TRIGGER IF EXISTS booking_audit_trigger ON bookings;
CREATE TRIGGER booking_audit_trigger
AFTER INSERT OR UPDATE ON bookings
FOR EACH ROW
EXECUTE FUNCTION log_booking_change();

-- =====================================================
-- MIGRATION VERSION 3: Add Availability Calendar (v1.2.0)
-- =====================================================
-- Created: 2026-05-10
-- Status: READY TO APPLY
-- Description: Add barber availability tracking

CREATE TABLE IF NOT EXISTS availability (
    id BIGSERIAL PRIMARY KEY,
    barber_id BIGINT REFERENCES barbers(id) ON DELETE CASCADE,
    date_available DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT true,
    notes VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT availability_time_check CHECK (start_time < end_time)
);

CREATE UNIQUE INDEX idx_availability_barber_date ON availability(barber_id, date_available);
CREATE INDEX idx_availability_date ON availability(date_available);

-- =====================================================
-- MIGRATION VERSION 4: Add Customer Profiles (v1.3.0)
-- =====================================================
-- Created: 2026-05-15
-- Status: READY TO APPLY
-- Description: Add customer profile table for better tracking

CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    total_bookings INT DEFAULT 0,
    total_spent DECIMAL(10, 2) DEFAULT 0,
    is_vip BOOLEAN DEFAULT false,
    preferred_barber VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_is_vip ON customers(is_vip) WHERE is_vip = true;

-- Migrate existing customers from bookings
INSERT INTO customers (name, email, phone)
SELECT DISTINCT customer_name, customer_email, customer_phone
FROM bookings
WHERE customer_email NOT IN (SELECT email FROM customers);

-- =====================================================
-- MIGRATION VERSION 5: Add Payment Integration (v2.0.0)
-- =====================================================
-- Created: 2026-05-20
-- Status: READY TO APPLY
-- Description: Add payment tracking and invoice table

CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_method VARCHAR(50), -- 'credit_card', 'cash', 'check'
    payment_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'refunded'
    transaction_id VARCHAR(255),
    stripe_payment_intent_id VARCHAR(255),
    paid_at TIMESTAMP,
    refunded_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT payments_method_check CHECK (payment_method IN ('credit_card', 'cash', 'check', 'paypal')),
    CONSTRAINT payments_status_check CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded'))
);

CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_payments_status ON payments(payment_status);

-- =====================================================
-- MIGRATION VERSION 6: Add Email Templates (v2.1.0)
-- =====================================================
-- Created: 2026-05-25
-- Status: READY TO APPLY
-- Description: Add email template system

CREATE TABLE IF NOT EXISTS email_templates (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL, -- 'booking_confirmation', 'cancellation', 'reminder'
    subject VARCHAR(500) NOT NULL,
    body TEXT NOT NULL,
    variables JSON, -- {"customer_name": "", "booking_date": "", "barber": ""}
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS email_logs (
    id BIGSERIAL PRIMARY KEY,
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    recipient VARCHAR(255) NOT NULL,
    template_name VARCHAR(255) NOT NULL,
    status VARCHAR(50), -- 'sent', 'failed', 'bounced'
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- MIGRATION VERSION 7: Add Review System (v2.2.0)
-- =====================================================
-- Created: 2026-06-01
-- Status: READY TO APPLY
-- Description: Add customer reviews and ratings

CREATE TABLE IF NOT EXISTS reviews (
    id BIGSERIAL PRIMARY KEY,
    booking_id UUID UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    barber_id BIGINT REFERENCES barbers(id),
    service_name VARCHAR(255),
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reviews_booking_id ON reviews(booking_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_barber_id ON reviews(barber_id);

-- =====================================================
-- MIGRATION VERSION 8: Add Notifications (v2.3.0)
-- =====================================================
-- Created: 2026-06-05
-- Status: READY TO APPLY
-- Description: Add notification system

CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    admin_id UUID REFERENCES admins(id) ON DELETE CASCADE,
    type VARCHAR(50), -- 'new_booking', 'cancellation', 'reminder', 'payment_received'
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_admin_id ON notifications(admin_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- =====================================================
-- SCHEMA DOWNGRADE FUNCTIONS (For Rollback)
-- =====================================================

-- Rollback Migration v1.1.0 (Remove Audit Logging)
-- DROP TRIGGER IF EXISTS booking_audit_trigger ON bookings;
-- DROP FUNCTION IF EXISTS log_booking_change();
-- DROP TABLE IF EXISTS audit_logs;

-- Rollback Migration v1.2.0 (Remove Availability)
-- DROP TABLE IF EXISTS availability;

-- Rollback Migration v1.3.0 (Remove Customers)
-- DROP TABLE IF EXISTS customers;

-- Rollback Migration v2.0.0 (Remove Payments)
-- DROP TABLE IF EXISTS payments;

-- Rollback Migration v2.1.0 (Remove Email)
-- DROP TABLE IF EXISTS email_logs;
-- DROP TABLE IF EXISTS email_templates;

-- Rollback Migration v2.2.0 (Remove Reviews)
-- DROP TABLE IF EXISTS reviews;

-- Rollback Migration v2.3.0 (Remove Notifications)
-- DROP TABLE IF EXISTS notifications;

-- =====================================================
-- VERSION TRACKING TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS schema_versions (
    id BIGSERIAL PRIMARY KEY,
    version VARCHAR(20) NOT NULL UNIQUE, -- '1.0.0', '1.1.0', '2.0.0'
    description VARCHAR(500),
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'applied' -- 'applied', 'pending', 'rolled_back'
);

-- Insert version records
INSERT INTO schema_versions (version, description, status) VALUES
    ('1.0.0', 'Initial schema with core tables', 'applied'),
    ('1.1.0', 'Add audit logging', 'pending'),
    ('1.2.0', 'Add availability calendar', 'pending'),
    ('1.3.0', 'Add customer profiles', 'pending'),
    ('2.0.0', 'Add payment integration', 'pending'),
    ('2.1.0', 'Add email templates', 'pending'),
    ('2.2.0', 'Add review system', 'pending'),
    ('2.3.0', 'Add notifications', 'pending')
ON CONFLICT DO NOTHING;

-- Check current schema version
SELECT * FROM schema_versions ORDER BY applied_at DESC LIMIT 1;

-- View all migrations
SELECT version, description, status, applied_at FROM schema_versions ORDER BY applied_at;

-- =====================================================
-- NOTES FOR MIGRATIONS
-- =====================================================
-- 1. Always backup database before running migrations
-- 2. Test migrations in development environment first
-- 3. Run migrations in order - do not skip versions
-- 4. Keep schema_versions table for tracking
-- 5. Update version number in application after migration
-- 6. Document any manual steps required
-- 7. Have rollback plan for each migration
-- 8. Monitor application logs after applying migrations
-- 9. For large migrations, plan for downtime if needed
-- 10. Version numbers follow semantic versioning (MAJOR.MINOR.PATCH)

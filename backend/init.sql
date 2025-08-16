-- PostgreSQL initialization script for FashionHub
-- This script runs when the PostgreSQL container starts for the first time

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Set timezone
SET timezone = 'UTC';

-- Create a view for database information
CREATE OR REPLACE VIEW db_info AS
SELECT 
    'FashionHub Database' as name,
    'PostgreSQL 15' as version,
    current_setting('server_version') as full_version,
    current_setting('timezone') as timezone,
    current_setting('lc_collate') as collation,
    NOW() as created_at;

-- Grant additional privileges if needed
GRANT ALL PRIVILEGES ON DATABASE fashionhub_db TO fashionhub_user;
GRANT ALL PRIVILEGES ON SCHEMA public TO fashionhub_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO fashionhub_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO fashionhub_user;

-- Create indexes for better performance (these will be created by Prisma, but good to have)
-- The actual indexes will be created when Prisma runs migrations

-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO fashionhub_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO fashionhub_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO fashionhub_user;

-- Create a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Flush privileges
FLUSH PRIVILEGES;

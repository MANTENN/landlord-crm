CREATE EXTENSION IF NOT EXISTS postgis;-- create table after enabling gis exten
CREATE TYPE property_status AS ENUM ('draft', 'published', 'archived');-- create enum
CREATE TABLE properties (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    coordinates GEOGRAPHY(POINT),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status property_status NOT NULL DEFAULT 'draft',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL
);
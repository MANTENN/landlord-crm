CREATE TABLE property_images (
    property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
    key UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alt TEXT,
    placeholder TEXT NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL REFERENCES auth.users(id)
);
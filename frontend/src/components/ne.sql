CREATE TABLE user(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE private_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    useremail VARCHAR(255) NOT NULL
    name VARCHAR(50) NOT NULL
    x VARCHAR(50) NOT NULL
    y VARCHAR(50) NOT NULL
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    CONSTRAINT fk_user FOREIGN KEY (useremail) REFERENCES "user".(email) ON DELETE CASCADE
);

CREATE TABLE public_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid()
    name VARCHAR(50) NOT NULL
    useremail VARCHAR(255) NOT NULL
    description TEXT 
    contact1 VARCHAR(13)
    contact2 VARCHAR(13)
    x VARCHAR(50) NOT NULL
    y VARCHAR(50) NOT NULL
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    CONSTRAINT fk_user FOREIGN KEY (useremail) REFERENCES "user".(email) ON DELETE RESTRICT
);

CREATE TABLE images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid()
    image VARCHAR(255) NOT NULL
    postid VARCHAR(255) NOT NULL
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    CONSTRAINT fk_user FOREIGN KEY (postid) REFERENCES "public_posts".(id) ON DELETE CASCADE
);

CREATE TABLE posts(
    id  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    useremail VARCHAR(255) NOT NULL
    country VARCHAR(255) NOT NULL
    state VARCHAR(255) NOT NULL
    city VARCHAR(255) NOT NULL
    district VARCHAR(255) NOT NULL
    description TEXT
    category VARCHAR(128) NOT NULL
    ai_description TEXT
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    CONSTRAINT fk_user FOREIGN KEY (useremail) REFERENCES "user".(email) ON DELETE RESTRICT
);

CREATE TABLE trip_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    origin POINT NOT NULL,
    destination POINT NOT NULL,
    price_aud DECIMAL(10, 2) NOT NULL,
    transport_type VARCHAR(50) NOT NULL, -- e.g., 'Auto', 'Taxi', 'RideShare'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- seed executed after db is healthy (before app boot), so create schema too
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO users (email, password_hash) VALUES
  ('test@hatchpr.dev', '$2a$10$GQwBPLHz8lRLUzbjV5wFgO6sO7p.zFe3z8VcNw7P2rqQ3fZ8Z0XiC')
ON CONFLICT (email) DO NOTHING;
-- password: "demo1234"

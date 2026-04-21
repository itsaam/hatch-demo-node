-- seed executed once per PR after db is healthy
INSERT INTO users (email, password_hash) VALUES
  ('demo@hatchpr.dev', '$2a$10$GQwBPLHz8lRLUzbjV5wFgO6sO7p.zFe3z8VcNw7P2rqQ3fZ8Z0XiC')
ON CONFLICT (email) DO NOTHING;
-- password: "demo1234"

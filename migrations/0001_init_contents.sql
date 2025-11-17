-- Create contents table for pages and posts
CREATE TABLE IF NOT EXISTS contents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  type TEXT NOT NULL CHECK(type IN ('page', 'post')),
  status TEXT DEFAULT 'published' CHECK(status IN ('draft', 'published')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_contents_slug ON contents(slug);
CREATE INDEX IF NOT EXISTS idx_contents_type_status ON contents(type, status);

-- Insert sample data
INSERT OR IGNORE INTO contents (slug, title, content, excerpt, type, status) VALUES
('about', 'About Us', '<h1>About Our Company</h1><p>We are a company dedicated to excellence.</p>', 'Learn about our company', 'page', 'published'),
('about/history', 'Company History', '<h1>Our History</h1><p>Founded in 2020, we have grown exponentially.</p>', 'Our journey and milestones', 'page', 'published'),
('contact', 'Contact Us', '<h1>Get In Touch</h1><p>Email us at hello@example.com</p>', 'Contact information', 'page', 'published'),
('blog/first-post', 'My First Blog Post', '<h1>Welcome to the Blog</h1><p>This is our first blog post!</p>', 'Welcome to our blog', 'post', 'published'),
('blog/draft-post', 'Draft Post', '<h1>This is a draft</h1><p>Not published yet</p>', 'Draft content', 'post', 'draft');

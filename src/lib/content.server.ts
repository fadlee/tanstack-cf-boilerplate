import { createServerFn } from '@tanstack/react-start'

export interface Content {
  id: number
  slug: string
  title: string
  content: string
  excerpt?: string
  type: 'page' | 'post'
  status: 'draft' | 'published'
  created_at: string
  updated_at: string
}

const MOCK_CONTENTS: Record<string, Content> = {
  about: {
    id: 1,
    slug: 'about',
    title: 'About Us',
    excerpt: 'Learn about our company',
    content: '<h1>About Our Company</h1><p>We are a company dedicated to excellence.</p>',
    type: 'page',
    status: 'published',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  'about/history': {
    id: 2,
    slug: 'about/history',
    title: 'Company History',
    excerpt: 'Our journey and milestones',
    content: '<h1>Our History</h1><p>Founded in 2020, we have grown exponentially.</p>',
    type: 'page',
    status: 'published',
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
  },
  contact: {
    id: 3,
    slug: 'contact',
    title: 'Contact Us',
    excerpt: 'Contact information',
    content: '<h1>Get In Touch</h1><p>Email us at hello@example.com</p>',
    type: 'page',
    status: 'published',
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-03T00:00:00Z',
  },
  'blog/first-post': {
    id: 4,
    slug: 'blog/first-post',
    title: 'My First Blog Post',
    excerpt: 'Welcome to our blog',
    content: '<h1>Welcome to the Blog</h1><p>This is our first blog post!</p>',
    type: 'post',
    status: 'published',
    created_at: '2024-01-04T00:00:00Z',
    updated_at: '2024-01-04T00:00:00Z',
  },
}

export const getContentBySlug = createServerFn(
  { method: 'GET' },
  async (slug: string): Promise<Content | null> => {
    try {
      return MOCK_CONTENTS[slug] || null
    } catch (error) {
      console.error('Error fetching content:', error)
      return null
    }
  }
)

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

export const getContentBySlug = createServerFn(
  { method: 'GET' },
  async (slug: string): Promise<Content | null> => {
    try {
      const db = (globalThis as any).arrahmah_db
      if (!db) {
        throw new Error('Database binding not found')
      }

      const result = await db
        .prepare(
          'SELECT * FROM contents WHERE slug = ? AND status = "published"'
        )
        .bind(slug)
        .first<Content>()

      return result || null
    } catch (error) {
      console.error('Error fetching content:', error)
      throw error
    }
  }
)

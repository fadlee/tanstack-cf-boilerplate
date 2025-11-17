# WordPress-like Permalink System - POC

This is a proof-of-concept for a catch-all route system similar to WordPress permalinks, allowing dynamic content to be served based on URL slugs with nested paths support.

## How It Works

### 1. Catch-all Route (`src/routes/$.tsx`)

TanStack Router uses `$` for splat/catch-all routes. This captures all URL segments after the domain:

- `/about` → slug: "about"
- `/about/history` → slug: "about/history"  
- `/blog/first-post` → slug: "blog/first-post"

### 2. Route Loader

The route loader:
1. Extracts the slug from the URL (`params._splat`)
2. Calls `getContentBySlug(slug)` server function
3. Returns matching content or `null` for 404

### 3. Server Function (`src/lib/content.server.ts`)

Currently uses **mock data** for testing:

```typescript
const MOCK_CONTENTS: Record<string, Content> = {
  'about': { id: 1, slug: 'about', title: 'About Us', ... },
  'about/history': { id: 2, slug: 'about/history', title: 'Company History', ... },
  'contact': { id: 3, slug: 'contact', title: 'Contact Us', ... },
  'blog/first-post': { id: 4, slug: 'blog/first-post', title: 'My First Blog Post', ... },
}

export const getContentBySlug = createServerFn(
  { method: 'GET' },
  async (slug: string): Promise<Content | null> => {
    return MOCK_CONTENTS[slug] || null
  }
)
```

### 4. Content Component

Renders content with:
- Page/post type badge
- Publication date
- Excerpt (if available)
- Main HTML content
- Navigation back to home
- 404 page for missing content

## Content Interface

```typescript
interface Content {
  id: number
  slug: string              // e.g., "about/history"
  title: string
  content: string          // HTML content
  excerpt?: string
  type: 'page' | 'post'
  status: 'draft' | 'published'
  created_at: string       // ISO timestamp
  updated_at: string       // ISO timestamp
}
```

## Testing Routes

The home page includes quick links to test:

- `/about` - Single-level page
- `/about/history` - Nested page
- `/contact` - Another page
- `/blog/first-post` - Nested blog post

Try a non-existent slug (e.g., `/not-found`) to see the 404 page.

## URL Structure Examples

| URL                        | Type | Slug                      |
|----------------------------|------|---------------------------|
| /about                     | page | about                     |
| /about/history             | page | about/history             |
| /about/history/milestones  | page | about/history/milestones  |
| /blog/2024/my-first-post   | post | blog/2024/my-first-post   |
| /products/software/cloud   | page | products/software/cloud   |

## Key Features

✅ **Nested slugs** - No depth limit  
✅ **Mock data** - Easy testing without database setup  
✅ **Type safety** - Full TypeScript support  
✅ **Server-side rendering** - Fast initial page load  
✅ **Clean 404 handling** - Graceful not-found pages  

## Next Steps: Database Integration

To replace mock data with a real database (Cloudflare D1, PostgreSQL, etc.):

1. Update `getContentBySlug` in `src/lib/content.server.ts` to query your database
2. Update the `Content` interface if needed
3. Add database binding to `wrangler.jsonc`
4. Remove `MOCK_CONTENTS` constant

Example for D1:

```typescript
export const getContentBySlug = createServerFn(
  { method: 'GET' },
  async (slug: string): Promise<Content | null> => {
    const db = (globalThis as any).MY_DB
    const result = await db
      .prepare('SELECT * FROM contents WHERE slug = ? AND status = "published"')
      .bind(slug)
      .first<Content>()
    return result || null
  }
)
```

## Deployment

```bash
# Build
npm run build

# Deploy to Cloudflare Workers
npm run deploy
```

The catch-all route will handle all requests not matching specific routes.

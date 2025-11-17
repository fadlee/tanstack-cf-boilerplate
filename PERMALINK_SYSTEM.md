# WordPress-like Permalink System

This application implements a catch-all route system similar to WordPress permalinks, allowing dynamic content to be served from a single database based on URL slugs.

## Architecture

### Database Schema

**Table: `contents`**

| Column      | Type    | Description                                      |
|-------------|---------|--------------------------------------------------|
| id          | INTEGER | Primary key, auto-increment                       |
| slug        | TEXT    | Unique identifier (e.g., "about", "about/history") |
| title       | TEXT    | Page/post title                                   |
| content     | TEXT    | HTML content                                      |
| excerpt     | TEXT    | Short description (optional)                      |
| type        | TEXT    | Either 'page' or 'post'                          |
| status      | TEXT    | 'draft' or 'published'                           |
| created_at  | DATETIME| Creation timestamp                               |
| updated_at  | DATETIME| Last update timestamp                             |

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
3. Queries D1 database for matching published content
4. Returns content or throws 404 error

### 3. Server Function (`src/lib/content.server.ts`)

```typescript
export const getContentBySlug = createServerFn(
  { method: 'GET' },
  async (slug: string): Promise<Content | null> => {
    // Query D1 database
    const result = await db
      .prepare(
        'SELECT * FROM contents WHERE slug = ? AND status = "published"'
      )
      .bind(slug)
      .first<Content>()
    
    return result || null
  }
)
```

The `status = "published"` check ensures only published content is visible.

### 4. Content Component

The component renders the content with:
- Page/post type badge
- Publication date
- Excerpt (if available)
- Main content (rendered as HTML)
- Navigation back to home

## Adding Content

### Via SQL

```sql
INSERT INTO contents (slug, title, content, excerpt, type, status)
VALUES (
  'services/web-development',
  'Web Development Services',
  '<h1>Professional Web Development</h1><p>We build amazing websites...</p>',
  'High-quality web development services',
  'page',
  'published'
);
```

### Via Wrangler CLI

```bash
npx wrangler d1 execute arrahmah_db --remote --command "INSERT INTO contents ..."
```

## Testing Routes

The home page includes links to test the system:

- `/about` - Single-level page
- `/about/history` - Nested page
- `/contact` - Another single-level page
- `/blog/first-post` - Nested blog post

Try accessing a non-existent slug to see the 404 error page.

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
✅ **Single database** - All content in one table  
✅ **Status filtering** - Draft posts hidden from public  
✅ **Type distinction** - Separate pages and posts  
✅ **Type safety** - Full TypeScript support  
✅ **Server-side rendering** - Fast initial page load  
✅ **Cloudflare Workers** - Globally distributed  

## Configuration

### Database Binding

Set in `wrangler.jsonc`:

```jsonc
{
  "d1_databases": [
    {
      "binding": "arrahmah_db",
      "database_name": "arrahmah_db",
      "database_id": "a8c77721-ddf3-4200-bcc7-3a3d2179a298",
      "remote": true
    }
  ]
}
```

The binding name (`arrahmah_db`) is used in server functions as `(globalThis as any).arrahmah_db`.

## Deployment

```bash
# Deploy to Cloudflare Workers
npm run deploy
```

The catch-all route will handle all requests not matching specific routes, allowing WordPress-style permalinks across your entire site.

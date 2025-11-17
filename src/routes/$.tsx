import { createFileRoute, useRouter } from '@tanstack/react-router'

import { getContentBySlug } from '../lib/content.server'
import type { Content } from '../lib/content.server'

export const Route = createFileRoute('/$')({
  loader: async ({ params }): Promise<Content | null> => {
    const slug = params._splat || ''

    if (!slug) {
      return null
    }

    try {
      const content = await getContentBySlug(slug)
      return content
    } catch (error) {
      console.error('Error fetching content:', error)
      return null
    }
  },

  component: ContentPage,
})

function ContentPage() {
  const content = Route.useLoaderData()
  const router = useRouter()

  if (!content) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-gray-300 mb-8">Page not found</p>
          <button
            onClick={() => router.history.back()}
            className="text-cyan-400 hover:text-cyan-300"
          >
            ← Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <article className="max-w-4xl mx-auto px-6 py-12">
        <header className="mb-8">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4 [letter-spacing:-0.02em]">
            {content.title}
          </h1>
          <div className="flex items-center gap-4 text-gray-400 text-sm">
            <span className="px-3 py-1 bg-slate-700 rounded-full text-cyan-400">
              {content.type}
            </span>
            <time dateTime={content.created_at}>
              {new Date(content.created_at).toLocaleDateString()}
            </time>
          </div>
        </header>

        {content.excerpt && (
          <p className="text-xl text-gray-300 mb-8 italic border-l-4 border-cyan-400 pl-4">
            {content.excerpt}
          </p>
        )}

        <div
          className="prose prose-invert max-w-none text-gray-100 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: content.content }}
        />

        <footer className="mt-12 pt-8 border-t border-slate-700">
          <a
            href="/"
            className="text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            ← Back to Home
          </a>
        </footer>
      </article>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { api } from '../lib/api'
import { formatMonthYear } from '../lib/format'
import type { BlogPostSummary } from '../lib/types'

export function BlogIndexPage() {
  const [posts, setPosts] = useState<BlogPostSummary[] | null>(null)

  useEffect(() => {
    api.get<BlogPostSummary[]>('/api/blog').then(setPosts)
  }, [])

  return (
    <div className="min-h-dvh bg-bg px-6 py-16 text-text md:px-16">
      <div className="mx-auto max-w-[720px]">
        <Link to="/" className="text-sm text-text-muted transition-colors hover:text-accent">
          ← Back
        </Link>

        <h1 className="mt-6 mb-10 text-[clamp(2rem,4vw,3rem)] font-extrabold tracking-[-0.03em]">
          <span className="text-accent">Blog</span>
        </h1>

        {posts === null && <p className="text-text-muted">Loading…</p>}
        {posts?.length === 0 && <p className="text-text-muted">No posts yet.</p>}

        <div className="flex flex-col gap-6">
          {posts?.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="block rounded-2xl border border-border bg-card p-6 transition-all hover:border-accent hover:shadow-[0_8px_30px_var(--accent-glow)]"
            >
              {post.published_at && (
                <span className="font-mono text-[0.72rem] tracking-[0.05em] text-accent-2">
                  {formatMonthYear(post.published_at.slice(0, 10))}
                </span>
              )}
              <h2 className="mt-2 mb-2 text-xl font-semibold text-text">{post.title}</h2>
              {post.excerpt && <p className="text-sm leading-relaxed text-text-muted">{post.excerpt}</p>}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

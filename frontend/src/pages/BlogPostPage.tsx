import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import ReactMarkdown from 'react-markdown'
import { api, ApiError } from '../lib/api'
import { formatMonthYear } from '../lib/format'
import type { BlogPostDetail } from '../lib/types'

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<BlogPostDetail | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) return
    api
      .get<BlogPostDetail>(`/api/blog/${slug}`)
      .then(setPost)
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) setNotFound(true)
      })
  }, [slug])

  return (
    <div className="min-h-dvh bg-bg px-6 py-16 text-text md:px-16">
      <div className="mx-auto max-w-[720px]">
        <Link to="/blog" className="text-sm text-text-muted transition-colors hover:text-accent">
          ← Back to blog
        </Link>

        {notFound && <p className="mt-10 text-text-muted">Post not found.</p>}

        {post && (
          <article className="mt-6">
            {post.published_at && (
              <span className="font-mono text-[0.72rem] tracking-[0.05em] text-accent-2">
                {formatMonthYear(post.published_at.slice(0, 10))}
              </span>
            )}
            <h1 className="mt-2 mb-8 text-[clamp(2rem,4vw,3rem)] font-extrabold tracking-[-0.03em]">
              {post.title}
            </h1>
            {post.cover_image_url && (
              <img
                src={post.cover_image_url}
                alt={post.title}
                className="mb-8 aspect-video w-full rounded-2xl border border-border object-cover"
              />
            )}
            <div className="prose prose-invert max-w-none leading-relaxed text-text-muted [&_a]:text-accent-2 [&_h2]:text-text [&_h3]:text-text [&_strong]:text-text">
              <ReactMarkdown>{post.content_markdown}</ReactMarkdown>
            </div>
          </article>
        )}
      </div>
    </div>
  )
}

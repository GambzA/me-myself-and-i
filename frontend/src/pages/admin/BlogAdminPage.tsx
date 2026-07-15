import { useEffect, useState, type FormEvent } from 'react'
import { api } from '../../lib/api'
import { EntityRow } from '../../components/admin/EntityGrid'
import { ImageUploader } from '../../components/admin/ImageUploader'
import type { BlogPostDetail, BlogPostSummary } from '../../lib/types'

type FormState = {
  title: string
  slug: string
  excerpt: string
  content_markdown: string
  cover_image_url: string
  published: boolean
}

const EMPTY_FORM: FormState = {
  title: '',
  slug: '',
  excerpt: '',
  content_markdown: '',
  cover_image_url: '',
  published: false,
}

export function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPostSummary[]>([])
  const [editingId, setEditingId] = useState<number | 'new' | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)

  function load() {
    api.get<BlogPostSummary[]>('/api/admin/blog').then(setPosts)
  }

  useEffect(load, [])

  function startCreate() {
    setForm(EMPTY_FORM)
    setEditingId('new')
  }

  async function startEdit(summary: BlogPostSummary) {
    const detail = await api.get<BlogPostDetail>(`/api/admin/blog/${summary.id}`)
    setForm({
      title: detail.title,
      slug: detail.slug,
      excerpt: detail.excerpt ?? '',
      content_markdown: detail.content_markdown,
      cover_image_url: detail.cover_image_url ?? '',
      published: detail.published,
    })
    setEditingId(detail.id)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const payload = {
      title: form.title,
      slug: form.slug || null,
      excerpt: form.excerpt || null,
      content_markdown: form.content_markdown,
      cover_image_url: form.cover_image_url || null,
      published: form.published,
    }

    if (editingId === 'new') {
      await api.post('/api/admin/blog', payload)
    } else if (editingId !== null) {
      await api.put(`/api/admin/blog/${editingId}`, payload)
    }

    setEditingId(null)
    load()
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this post?')) return
    await api.delete(`/api/admin/blog/${id}`)
    load()
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-text">Blog Posts</h1>
        <button onClick={startCreate} className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90">
          New post
        </button>
      </div>

      {editingId !== null && (
        <form onSubmit={handleSubmit} className="mb-8 flex flex-col gap-4 rounded-2xl border border-border bg-card p-6">
          <label>
            <span className="mb-1 block text-xs text-text-muted uppercase">Title</span>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent"
            />
          </label>
          <label>
            <span className="mb-1 block text-xs text-text-muted uppercase">Slug (leave blank to auto-generate)</span>
            <input
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent"
            />
          </label>
          <label>
            <span className="mb-1 block text-xs text-text-muted uppercase">Excerpt</span>
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              rows={2}
              className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent"
            />
          </label>
          <label>
            <span className="mb-1 block text-xs text-text-muted uppercase">Content (Markdown)</span>
            <textarea
              required
              value={form.content_markdown}
              onChange={(e) => setForm({ ...form, content_markdown: e.target.value })}
              rows={12}
              className="w-full rounded-lg border border-border bg-bg px-3 py-2 font-mono text-sm text-text outline-none focus:border-accent"
            />
          </label>
          <ImageUploader
            label="Cover image"
            value={form.cover_image_url}
            onChange={(url) => setForm({ ...form, cover_image_url: url })}
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
            />
            <span className="text-xs text-text-muted uppercase">Published</span>
          </label>

          <div className="flex gap-3">
            <button type="submit" className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90">
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditingId(null)}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-muted hover:text-text"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-col gap-3">
        {posts.map((post) => (
          <EntityRow
            key={post.id}
            title={post.title}
            subtitle={
              <span className="block text-sm text-text-muted">
                /{post.slug} · {post.published ? 'Published' : 'Draft'}
              </span>
            }
            onEdit={() => startEdit(post)}
            onDelete={() => handleDelete(post.id)}
          />
        ))}
      </div>
    </div>
  )
}

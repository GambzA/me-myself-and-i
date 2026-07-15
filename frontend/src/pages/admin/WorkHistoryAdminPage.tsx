import { useEffect, useState, type FormEvent } from 'react'
import { api } from '../../lib/api'
import { EntityRow } from '../../components/admin/EntityGrid'
import { SortableList } from '../../components/admin/SortableList'
import { formatPeriod } from '../../lib/format'
import type { WorkHistoryEntry } from '../../lib/types'

type FormState = {
  role: string
  company: string
  company_note: string
  start_date: string
  end_date: string
}

const EMPTY_FORM: FormState = {
  role: '',
  company: '',
  company_note: '',
  start_date: '',
  end_date: '',
}

export function WorkHistoryAdminPage() {
  const [entries, setEntries] = useState<WorkHistoryEntry[]>([])
  const [editingId, setEditingId] = useState<number | 'new' | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)

  function load() {
    api.get<WorkHistoryEntry[]>('/api/work-history').then(setEntries)
  }

  useEffect(load, [])

  function startCreate() {
    setForm(EMPTY_FORM)
    setEditingId('new')
  }

  function startEdit(entry: WorkHistoryEntry) {
    setForm({
      role: entry.role,
      company: entry.company,
      company_note: entry.company_note ?? '',
      start_date: entry.start_date,
      end_date: entry.end_date ?? '',
    })
    setEditingId(entry.id)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const payload = {
      role: form.role,
      company: form.company,
      company_note: form.company_note || null,
      start_date: form.start_date,
      end_date: form.end_date || null,
      display_order: editingId === 'new' ? entries.length : undefined,
    }

    if (editingId === 'new') {
      await api.post('/api/work-history', payload)
    } else if (editingId !== null) {
      await api.put(`/api/work-history/${editingId}`, payload)
    }

    setEditingId(null)
    load()
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this entry?')) return
    await api.delete(`/api/work-history/${id}`)
    load()
  }

  async function handleReorder(reordered: WorkHistoryEntry[]) {
    setEntries(reordered)
    await api.put('/api/work-history/reorder', { ids: reordered.map((e) => e.id) })
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-text">Work History</h1>
        <button
          onClick={startCreate}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          Add entry
        </button>
      </div>

      {editingId !== null && (
        <form onSubmit={handleSubmit} className="mb-8 grid grid-cols-2 gap-4 rounded-2xl border border-border bg-card p-6">
          <label className="col-span-2">
            <span className="mb-1 block text-xs text-text-muted uppercase">Role</span>
            <input
              required
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent"
            />
          </label>
          <label>
            <span className="mb-1 block text-xs text-text-muted uppercase">Company</span>
            <input
              required
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent"
            />
          </label>
          <label>
            <span className="mb-1 block text-xs text-text-muted uppercase">Company note (optional)</span>
            <input
              value={form.company_note}
              onChange={(e) => setForm({ ...form, company_note: e.target.value })}
              placeholder="→ Willis Towers Watson"
              className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent"
            />
          </label>
          <label>
            <span className="mb-1 block text-xs text-text-muted uppercase">Start date</span>
            <input
              type="date"
              required
              value={form.start_date}
              onChange={(e) => setForm({ ...form, start_date: e.target.value })}
              className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent"
            />
          </label>
          <label>
            <span className="mb-1 block text-xs text-text-muted uppercase">End date (blank = present)</span>
            <input
              type="date"
              value={form.end_date}
              onChange={(e) => setForm({ ...form, end_date: e.target.value })}
              className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent"
            />
          </label>

          <div className="col-span-2 flex gap-3">
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

      <SortableList
        items={entries}
        onReorder={handleReorder}
        className="flex flex-col gap-3"
      >
        {(entry, _index, drag) => (
          <EntityRow
            key={entry.id}
            title={entry.role}
            subtitle={
              <>
                <span className="block font-mono text-xs text-accent-2">
                  {formatPeriod(entry.start_date, entry.end_date)}
                </span>
                <span className="block text-sm text-text-muted">
                  {entry.company}
                  {entry.company_note && <span className="ml-1 text-accent">{entry.company_note}</span>}
                </span>
              </>
            }
            onEdit={() => startEdit(entry)}
            onDelete={() => handleDelete(entry.id)}
            dragRef={drag.ref}
            dragHandleRef={drag.handleRef}
            isDragging={drag.isDragging}
          />
        )}
      </SortableList>
    </div>
  )
}

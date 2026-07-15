import type { ReactNode } from 'react'
import { GripIcon, PencilIcon, PlusIcon, TrashIcon } from './icons'

interface DragProps {
  dragRef?: (element: Element | null) => void
  dragHandleRef?: (element: Element | null) => void
  isDragging?: boolean
}

interface SelectableCardProps extends DragProps {
  label: string
  meta?: string
  selected: boolean
  onSelect: () => void
  onEdit: () => void
  onDelete: () => void
}

export function SelectableCard({
  label,
  meta,
  selected,
  onSelect,
  onEdit,
  onDelete,
  dragRef,
  dragHandleRef,
  isDragging,
}: SelectableCardProps) {
  return (
    <div
      ref={dragRef}
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect()
        }
      }}
      className={`group relative cursor-pointer rounded-xl border p-4 pr-12 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
        dragHandleRef ? 'pl-9' : ''
      } ${isDragging ? 'opacity-50' : ''} ${
        selected ? 'border-accent bg-accent/10' : 'border-border bg-card hover:border-accent/40'
      }`}
    >
      {dragHandleRef && (
        <button
          ref={dragHandleRef}
          type="button"
          onClick={(e) => e.stopPropagation()}
          aria-label={`Drag to reorder ${label}`}
          className="absolute top-1/2 left-2 -translate-y-1/2 cursor-grab touch-none text-text-dim opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
        >
          <GripIcon />
        </button>
      )}

      <h3 className="font-medium leading-snug text-text">{label}</h3>
      {meta && <p className="mt-1 text-xs text-text-muted">{meta}</p>}

      <div className="absolute top-3 right-3 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onEdit()
          }}
          aria-label={`Edit ${label}`}
          className="rounded-md p-1.5 text-text-muted hover:bg-border hover:text-text"
        >
          <PencilIcon />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          aria-label={`Delete ${label}`}
          className="rounded-md p-1.5 text-text-muted hover:bg-red-500/10 hover:text-red-400"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  )
}

export function AddCard({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex min-h-[76px] flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-border p-4 text-text-muted transition-colors hover:border-accent hover:text-accent"
    >
      <PlusIcon />
      <span className="text-sm">{label}</span>
    </button>
  )
}

interface EntityRowProps extends DragProps {
  title: string
  subtitle?: ReactNode
  onEdit: () => void
  onDelete: () => void
}

export function EntityRow({ title, subtitle, onEdit, onDelete, dragRef, dragHandleRef, isDragging }: EntityRowProps) {
  return (
    <div
      ref={dragRef}
      className={`flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-opacity ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      {dragHandleRef && (
        <button
          ref={dragHandleRef}
          type="button"
          aria-label={`Drag to reorder ${title}`}
          className="shrink-0 cursor-grab touch-none text-text-dim hover:text-text-muted active:cursor-grabbing"
        >
          <GripIcon />
        </button>
      )}

      <div className="flex-1">
        <span className="block font-medium text-text">{title}</span>
        {subtitle}
      </div>

      <div className="flex shrink-0 gap-1">
        <button
          onClick={onEdit}
          aria-label={`Edit ${title}`}
          className="rounded-md p-2 text-text-muted hover:bg-border hover:text-text"
        >
          <PencilIcon />
        </button>
        <button
          onClick={onDelete}
          aria-label={`Delete ${title}`}
          className="rounded-md p-2 text-text-muted hover:bg-red-500/10 hover:text-red-400"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  )
}

interface TagRowProps extends DragProps {
  label: string
  accent?: boolean
  onEdit: () => void
  onDelete: () => void
}

export function TagRow({ label, accent, onEdit, onDelete, dragRef, dragHandleRef, isDragging }: TagRowProps) {
  return (
    <div
      ref={dragRef}
      className={`flex items-center gap-1.5 rounded-lg border py-1.5 pr-1.5 pl-2 text-sm transition-opacity ${
        isDragging ? 'opacity-50' : ''
      } ${accent ? 'border-accent/40 bg-accent/15 text-text' : 'border-border bg-card text-text-muted'}`}
    >
      {dragHandleRef && (
        <button
          ref={dragHandleRef}
          type="button"
          aria-label={`Drag to reorder ${label}`}
          className="cursor-grab touch-none text-text-dim hover:text-text-muted active:cursor-grabbing"
        >
          <GripIcon className="h-3.5 w-3.5" />
        </button>
      )}
      <span>{label}</span>
      <button onClick={onEdit} aria-label={`Edit ${label}`} className="rounded p-1 hover:bg-border hover:text-text">
        <PencilIcon className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={onDelete}
        aria-label={`Delete ${label}`}
        className="rounded p-1 hover:bg-red-500/10 hover:text-red-400"
      >
        <TrashIcon className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

import { useEffect, useState, type FormEvent } from 'react'
import { api } from '../../lib/api'
import { AddCard, EntityRow, SelectableCard } from '../../components/admin/EntityGrid'
import { SortableList } from '../../components/admin/SortableList'
import { ImageUploader } from '../../components/admin/ImageUploader'
import type { Project, ProjectCategory } from '../../lib/types'

type CategoryForm = {
  key: string
  label: string
  description: string
}

type ProjectForm = {
  title: string
  description: string
  image_url: string
  link_url: string
  is_investor: boolean
}

const EMPTY_CATEGORY_FORM: CategoryForm = { key: '', label: '', description: '' }
const EMPTY_PROJECT_FORM: ProjectForm = {
  title: '',
  description: '',
  image_url: '',
  link_url: '',
  is_investor: false,
}

export function ProjectsAdminPage() {
  const [categories, setCategories] = useState<ProjectCategory[]>([])
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null)

  const [editingCategoryId, setEditingCategoryId] = useState<number | 'new' | null>(null)
  const [categoryForm, setCategoryForm] = useState<CategoryForm>(EMPTY_CATEGORY_FORM)

  const [editingProjectId, setEditingProjectId] = useState<number | 'new' | null>(null)
  const [projectForm, setProjectForm] = useState<ProjectForm>(EMPTY_PROJECT_FORM)

  function load() {
    api.get<ProjectCategory[]>('/api/project-categories').then((data) => {
      setCategories(data)
      setActiveCategoryId((current) => current ?? data[0]?.id ?? null)
    })
  }

  useEffect(load, [])

  const activeCategory = categories.find((c) => c.id === activeCategoryId) ?? null

  // ── Category handlers ──────────────────────────────────

  function startCreateCategory() {
    setCategoryForm(EMPTY_CATEGORY_FORM)
    setEditingCategoryId('new')
  }

  function startEditCategory(category: ProjectCategory) {
    setCategoryForm({
      key: category.key,
      label: category.label,
      description: category.description ?? '',
    })
    setEditingCategoryId(category.id)
  }

  async function handleCategorySubmit(e: FormEvent) {
    e.preventDefault()
    const payload = {
      key: categoryForm.key,
      label: categoryForm.label,
      description: categoryForm.description || null,
      display_order: editingCategoryId === 'new' ? categories.length : undefined,
    }

    if (editingCategoryId === 'new') {
      await api.post('/api/project-categories', payload)
    } else if (editingCategoryId !== null) {
      await api.put(`/api/project-categories/${editingCategoryId}`, payload)
    }

    setEditingCategoryId(null)
    load()
  }

  async function handleDeleteCategory(id: number) {
    if (!confirm('Delete this category and all its projects?')) return
    await api.delete(`/api/project-categories/${id}`)
    if (activeCategoryId === id) setActiveCategoryId(null)
    load()
  }

  async function handleReorderCategories(reordered: ProjectCategory[]) {
    setCategories(reordered)
    await api.put('/api/project-categories/reorder', { ids: reordered.map((c) => c.id) })
  }

  // ── Project handlers ───────────────────────────────────

  function startCreateProject() {
    setProjectForm(EMPTY_PROJECT_FORM)
    setEditingProjectId('new')
  }

  function startEditProject(project: Project) {
    setProjectForm({
      title: project.title,
      description: project.description ?? '',
      image_url: project.image_url ?? '',
      link_url: project.link_url ?? '',
      is_investor: project.is_investor,
    })
    setEditingProjectId(project.id)
  }

  async function handleProjectSubmit(e: FormEvent) {
    e.preventDefault()
    if (!activeCategory) return

    const payload = {
      title: projectForm.title,
      description: projectForm.description || null,
      image_url: projectForm.image_url || null,
      link_url: projectForm.link_url || null,
      is_investor: projectForm.is_investor,
      category_id: activeCategory.id,
      display_order: editingProjectId === 'new' ? activeCategory.projects.length : undefined,
    }

    if (editingProjectId === 'new') {
      await api.post('/api/projects', payload)
    } else if (editingProjectId !== null) {
      await api.put(`/api/projects/${editingProjectId}`, payload)
    }

    setEditingProjectId(null)
    load()
  }

  async function handleDeleteProject(id: number) {
    if (!confirm('Delete this project?')) return
    await api.delete(`/api/projects/${id}`)
    load()
  }

  async function handleReorderProjects(reordered: Project[]) {
    if (!activeCategory) return
    setCategories((prev) =>
      prev.map((c) => (c.id === activeCategory.id ? { ...c, projects: reordered } : c)),
    )
    await api.put('/api/projects/reorder', { ids: reordered.map((p) => p.id) })
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-text">Projects</h1>

      {/* Categories */}
      <div className="mb-8">
        <h2 className="mb-3 text-sm font-medium tracking-wide text-text-muted uppercase">Categories</h2>

        <SortableList
          items={categories}
          onReorder={handleReorderCategories}
          className="grid grid-cols-2 gap-3 sm:grid-cols-3"
          trailing={<AddCard label="New category" onClick={startCreateCategory} />}
        >
          {(category, _index, drag) => (
            <SelectableCard
              key={category.id}
              label={category.label}
              meta={`${category.projects.length} project${category.projects.length !== 1 ? 's' : ''}`}
              selected={category.id === activeCategoryId}
              onSelect={() => setActiveCategoryId(category.id)}
              onEdit={() => startEditCategory(category)}
              onDelete={() => handleDeleteCategory(category.id)}
              dragRef={drag.ref}
              dragHandleRef={drag.handleRef}
              isDragging={drag.isDragging}
            />
          )}
        </SortableList>

        {editingCategoryId !== null && (
          <form
            onSubmit={handleCategorySubmit}
            className="mt-4 grid grid-cols-2 gap-4 rounded-2xl border border-border bg-card p-6"
          >
            <label>
              <span className="mb-1 block text-xs text-text-muted uppercase">Key</span>
              <input
                required
                value={categoryForm.key}
                onChange={(e) => setCategoryForm({ ...categoryForm, key: e.target.value })}
                placeholder="work"
                className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent"
              />
            </label>
            <label>
              <span className="mb-1 block text-xs text-text-muted uppercase">Label</span>
              <input
                required
                value={categoryForm.label}
                onChange={(e) => setCategoryForm({ ...categoryForm, label: e.target.value })}
                placeholder="From Work"
                className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent"
              />
            </label>
            <label className="col-span-2">
              <span className="mb-1 block text-xs text-text-muted uppercase">Description</span>
              <textarea
                value={categoryForm.description}
                onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent"
              />
            </label>
            <div className="col-span-2 flex gap-3">
              <button type="submit" className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90">
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditingCategoryId(null)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-muted hover:text-text"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Projects within active category */}
      {activeCategory && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-medium tracking-wide text-text-muted uppercase">
              Projects in "{activeCategory.label}"
            </h2>
            <button onClick={startCreateProject} className="text-sm text-accent-2 hover:text-accent">
              + Add project
            </button>
          </div>

          {editingProjectId !== null && (
            <form
              onSubmit={handleProjectSubmit}
              className="mb-6 grid grid-cols-2 gap-4 rounded-2xl border border-border bg-card p-6"
            >
              <label className="col-span-2">
                <span className="mb-1 block text-xs text-text-muted uppercase">Title</span>
                <input
                  required
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent"
                />
              </label>
              <label className="col-span-2">
                <span className="mb-1 block text-xs text-text-muted uppercase">Description</span>
                <textarea
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent"
                />
              </label>
              <div className="col-span-2">
                <ImageUploader
                  label="Project image"
                  value={projectForm.image_url}
                  onChange={(url) => setProjectForm({ ...projectForm, image_url: url })}
                />
              </div>
              <label>
                <span className="mb-1 block text-xs text-text-muted uppercase">Link URL</span>
                <input
                  value={projectForm.link_url}
                  onChange={(e) => setProjectForm({ ...projectForm, link_url: e.target.value })}
                  className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent"
                />
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={projectForm.is_investor}
                  onChange={(e) => setProjectForm({ ...projectForm, is_investor: e.target.checked })}
                />
                <span className="text-xs text-text-muted uppercase">Investor project</span>
              </label>
              <div className="col-span-2 flex gap-3">
                <button type="submit" className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90">
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingProjectId(null)}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-muted hover:text-text"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <SortableList items={activeCategory.projects} onReorder={handleReorderProjects} className="flex flex-col gap-3">
            {(project, _index, drag) => (
              <EntityRow
                key={project.id}
                title={project.title}
                subtitle={
                  project.description && <span className="block text-sm text-text-muted">{project.description}</span>
                }
                onEdit={() => startEditProject(project)}
                onDelete={() => handleDeleteProject(project.id)}
                dragRef={drag.ref}
                dragHandleRef={drag.handleRef}
                isDragging={drag.isDragging}
              />
            )}
          </SortableList>
        </div>
      )}
    </div>
  )
}

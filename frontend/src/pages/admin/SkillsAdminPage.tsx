import { useEffect, useState, type FormEvent } from 'react'
import { api } from '../../lib/api'
import { AddCard, SelectableCard, TagRow } from '../../components/admin/EntityGrid'
import { SortableList } from '../../components/admin/SortableList'
import type { Skill, SkillGroup } from '../../lib/types'

type GroupForm = {
  label: string
}

type SkillForm = {
  name: string
  is_accent: boolean
}

const EMPTY_GROUP_FORM: GroupForm = { label: '' }
const EMPTY_SKILL_FORM: SkillForm = { name: '', is_accent: false }

export function SkillsAdminPage() {
  const [groups, setGroups] = useState<SkillGroup[]>([])
  const [activeGroupId, setActiveGroupId] = useState<number | null>(null)

  const [editingGroupId, setEditingGroupId] = useState<number | 'new' | null>(null)
  const [groupForm, setGroupForm] = useState<GroupForm>(EMPTY_GROUP_FORM)

  const [editingSkillId, setEditingSkillId] = useState<number | 'new' | null>(null)
  const [skillForm, setSkillForm] = useState<SkillForm>(EMPTY_SKILL_FORM)

  function load() {
    api.get<SkillGroup[]>('/api/skill-groups').then((data) => {
      setGroups(data)
      setActiveGroupId((current) => current ?? data[0]?.id ?? null)
    })
  }

  useEffect(load, [])

  const activeGroup = groups.find((g) => g.id === activeGroupId) ?? null

  // ── Group handlers ──────────────────────────────────────

  function startCreateGroup() {
    setGroupForm(EMPTY_GROUP_FORM)
    setEditingGroupId('new')
  }

  function startEditGroup(group: SkillGroup) {
    setGroupForm({ label: group.label })
    setEditingGroupId(group.id)
  }

  async function handleGroupSubmit(e: FormEvent) {
    e.preventDefault()
    const payload = {
      label: groupForm.label,
      display_order: editingGroupId === 'new' ? groups.length : undefined,
    }

    if (editingGroupId === 'new') {
      await api.post('/api/skill-groups', payload)
    } else if (editingGroupId !== null) {
      await api.put(`/api/skill-groups/${editingGroupId}`, payload)
    }

    setEditingGroupId(null)
    load()
  }

  async function handleDeleteGroup(id: number) {
    if (!confirm('Delete this skill group and all its skills?')) return
    await api.delete(`/api/skill-groups/${id}`)
    if (activeGroupId === id) setActiveGroupId(null)
    load()
  }

  async function handleReorderGroups(reordered: SkillGroup[]) {
    setGroups(reordered)
    await api.put('/api/skill-groups/reorder', { ids: reordered.map((g) => g.id) })
  }

  // ── Skill handlers ──────────────────────────────────────

  function startCreateSkill() {
    setSkillForm(EMPTY_SKILL_FORM)
    setEditingSkillId('new')
  }

  function startEditSkill(skill: Skill) {
    setSkillForm({ name: skill.name, is_accent: skill.is_accent })
    setEditingSkillId(skill.id)
  }

  async function handleSkillSubmit(e: FormEvent) {
    e.preventDefault()
    if (!activeGroup) return

    const payload = {
      name: skillForm.name,
      is_accent: skillForm.is_accent,
      skill_group_id: activeGroup.id,
      display_order: editingSkillId === 'new' ? activeGroup.skills.length : undefined,
    }

    if (editingSkillId === 'new') {
      await api.post('/api/skills', payload)
    } else if (editingSkillId !== null) {
      await api.put(`/api/skills/${editingSkillId}`, payload)
    }

    setEditingSkillId(null)
    load()
  }

  async function handleDeleteSkill(id: number) {
    if (!confirm('Delete this skill?')) return
    await api.delete(`/api/skills/${id}`)
    load()
  }

  async function handleReorderSkills(reordered: Skill[]) {
    if (!activeGroup) return
    setGroups((prev) => prev.map((g) => (g.id === activeGroup.id ? { ...g, skills: reordered } : g)))
    await api.put('/api/skills/reorder', { ids: reordered.map((s) => s.id) })
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-text">Skills &amp; Tools</h1>

      {/* Groups */}
      <div className="mb-8">
        <h2 className="mb-3 text-sm font-medium tracking-wide text-text-muted uppercase">Groups</h2>

        <SortableList
          items={groups}
          onReorder={handleReorderGroups}
          className="grid grid-cols-2 gap-3 sm:grid-cols-3"
          trailing={<AddCard label="New group" onClick={startCreateGroup} />}
        >
          {(group, _index, drag) => (
            <SelectableCard
              key={group.id}
              label={group.label}
              meta={`${group.skills.length} skill${group.skills.length !== 1 ? 's' : ''}`}
              selected={group.id === activeGroupId}
              onSelect={() => setActiveGroupId(group.id)}
              onEdit={() => startEditGroup(group)}
              onDelete={() => handleDeleteGroup(group.id)}
              dragRef={drag.ref}
              dragHandleRef={drag.handleRef}
              isDragging={drag.isDragging}
            />
          )}
        </SortableList>

        {editingGroupId !== null && (
          <form
            onSubmit={handleGroupSubmit}
            className="mt-4 grid grid-cols-2 gap-4 rounded-2xl border border-border bg-card p-6"
          >
            <label>
              <span className="mb-1 block text-xs text-text-muted uppercase">Label</span>
              <input
                required
                value={groupForm.label}
                onChange={(e) => setGroupForm({ ...groupForm, label: e.target.value })}
                placeholder="Programming & Scripting"
                className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent"
              />
            </label>
            <div className="col-span-2 flex gap-3">
              <button type="submit" className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90">
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditingGroupId(null)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-muted hover:text-text"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Skills within active group */}
      {activeGroup && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-medium tracking-wide text-text-muted uppercase">
              Skills in "{activeGroup.label}"
            </h2>
            <button onClick={startCreateSkill} className="text-sm text-accent-2 hover:text-accent">
              + Add skill
            </button>
          </div>

          {editingSkillId !== null && (
            <form
              onSubmit={handleSkillSubmit}
              className="mb-6 grid grid-cols-2 gap-4 rounded-2xl border border-border bg-card p-6"
            >
              <label className="col-span-2">
                <span className="mb-1 block text-xs text-text-muted uppercase">Name</span>
                <input
                  required
                  value={skillForm.name}
                  onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                  className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent"
                />
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={skillForm.is_accent}
                  onChange={(e) => setSkillForm({ ...skillForm, is_accent: e.target.checked })}
                />
                <span className="text-xs text-text-muted uppercase">Accent (highlighted tag)</span>
              </label>
              <div className="col-span-2 flex gap-3">
                <button type="submit" className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90">
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingSkillId(null)}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-muted hover:text-text"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <SortableList
            items={activeGroup.skills}
            onReorder={handleReorderSkills}
            className="flex flex-wrap gap-2"
          >
            {(skill, _index, drag) => (
              <TagRow
                key={skill.id}
                label={skill.name}
                accent={skill.is_accent}
                onEdit={() => startEditSkill(skill)}
                onDelete={() => handleDeleteSkill(skill.id)}
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

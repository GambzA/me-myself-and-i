export interface User {
  id: number
  email: string
}

export interface WorkHistoryEntry {
  id: number
  role: string
  company: string
  company_note: string | null
  start_date: string
  end_date: string | null
  display_order: number
}

export interface Skill {
  id: number
  name: string
  is_accent: boolean
  display_order: number
}

export interface SkillGroup {
  id: number
  label: string
  display_order: number
  skills: Skill[]
}

export interface Project {
  id: number
  title: string
  description: string | null
  image_url: string | null
  link_url: string | null
  is_investor: boolean
  display_order: number
}

export interface ProjectCategory {
  id: number
  key: string
  label: string
  description: string | null
  display_order: number
  projects: Project[]
}

export interface Homepage {
  work_history: WorkHistoryEntry[]
  skill_groups: SkillGroup[]
  project_categories: ProjectCategory[]
}

export interface BlogPostSummary {
  id: number
  slug: string
  title: string
  excerpt: string | null
  cover_image_url: string | null
  published: boolean
  published_at: string | null
}

export interface BlogPostDetail extends BlogPostSummary {
  content_markdown: string
  created_at: string
  updated_at: string
}

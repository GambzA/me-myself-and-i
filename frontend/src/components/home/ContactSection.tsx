import { useState } from 'react'

const EMAIL = 'gambaroimark@gmail.com'

export function ContactSection() {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(EMAIL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex w-full flex-col items-start gap-6">
      <p className="font-mono text-[0.85rem] tracking-[0.1em] text-accent-2 uppercase">Get in touch</p>
      <div className="flex flex-wrap items-center gap-5">
        <a
          href={`mailto:${EMAIL}`}
          className="border-b-[3px] border-accent pb-[0.1em] text-[clamp(1.6rem,4.5vw,3.8rem)] leading-[1.1] font-extrabold tracking-[-0.03em] break-all text-text transition-colors hover:border-accent-2 hover:text-accent"
        >
          {EMAIL}
        </a>
        <button
          aria-label="Copy email address"
          onClick={handleCopy}
          className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] border-[1.5px] transition-all ${
            copied
              ? 'border-accent-2 text-accent-2 shadow-[0_0_14px_var(--accent-2-glow)]'
              : 'border-border bg-card text-text-muted hover:border-accent hover:text-text hover:shadow-[0_0_14px_var(--accent-glow)]'
          }`}
        >
          <svg
            className={`absolute h-[18px] w-[18px] transition-all duration-150 ${copied ? 'scale-[0.6] opacity-0' : 'scale-100 opacity-100'}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          </svg>
          <svg
            className={`absolute h-[18px] w-[18px] transition-all duration-150 ${copied ? 'scale-100 opacity-100' : 'scale-[0.6] opacity-0'}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

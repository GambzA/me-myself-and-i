export function AboutSection() {
  return (
    <div className="flex w-full flex-col items-center gap-6 max-[900px]:items-start md:flex-row md:items-center md:gap-8">
      <div className="max-w-[540px] flex-1">
        <p className="mb-3 font-mono text-[0.85rem] tracking-[0.1em] text-accent-2">Hi! I'm</p>
        <h1 className="mb-4 bg-[linear-gradient(135deg,var(--color-text)_40%,var(--color-accent))] bg-clip-text text-[clamp(2.6rem,6vw,5rem)] leading-none font-black tracking-[-0.04em] text-transparent">
          Roi Gamba
        </h1>
        <p className="mb-6 text-[1.05rem] leading-relaxed text-text-muted">
          Software Development Engineer in Test
          <br />
          <span className="font-medium text-accent-2">&amp; Full-Stack Developer</span>
        </p>
        <p className="mb-10 max-w-[420px] text-[0.95rem] leading-[1.8] text-text-muted">
          I build robust systems, automate the hard stuff, and ship software that doesn't break in
          production. Passionate about quality, clean code, and agentic AI workflows.
        </p>

        <div className="flex flex-wrap gap-3">
          <a
            href="https://www.linkedin.com/in/roi-mark-gamba/"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-border bg-card px-4.5 py-2.5 text-sm font-medium text-text-muted transition-all hover:-translate-y-px hover:border-accent hover:text-text hover:shadow-[0_0_16px_var(--accent-glow)]"
          >
            <svg className="h-[15px] w-[15px] shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            LinkedIn
          </a>
          <a
            href="https://github.com/GambzA"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-border bg-card px-4.5 py-2.5 text-sm font-medium text-text-muted transition-all hover:-translate-y-px hover:border-accent hover:text-text hover:shadow-[0_0_16px_var(--accent-glow)]"
          >
            <svg className="h-[15px] w-[15px] shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
            GitHub
          </a>
          <a
            href="mailto:gambaroimark@gmail.com"
            className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-border bg-card px-4.5 py-2.5 text-sm font-medium text-text-muted transition-all hover:-translate-y-px hover:border-accent hover:text-text hover:shadow-[0_0_16px_var(--accent-glow)]"
          >
            <svg
              className="h-[15px] w-[15px] shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            gambaroimark@gmail.com
          </a>
        </div>
      </div>

      <div className="relative shrink-0 self-center">
        <div className="relative z-[1] h-[240px] w-[200px] overflow-hidden rounded-3xl border-[1.5px] border-border bg-card sm:h-[400px] sm:w-[320px]">
          <img src="/assets/photo.png" alt="Roi Gamba" className="h-full w-full object-cover" />
        </div>
        <div className="absolute -inset-5 z-0 rounded-[30px] bg-[radial-gradient(ellipse_at_center,var(--accent-glow),transparent_70%)] blur-xl" />
      </div>
    </div>
  )
}

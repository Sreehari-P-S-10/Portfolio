import { useState, useEffect, useRef, type ReactNode } from 'react'

/* ─── DATA ──────────────────────────────────────────────────────────────── */

const ROLES = [
  'Full Stack Developer',
  'Mobile App Developer',
  'AI Integration Engineer',
  'IoT Systems Builder',
]

const NAV_LINKS = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
]

const PROJECTS = [
  {
    num: '01',
    title: 'LexCheck',
    sub: 'AI Legal Companion',
    desc: 'Cross-platform Flutter app with a RAG pipeline that translates complex Indian laws into plain-language scenario analysis. Scalable Node.js/FastAPI backend with Vector Database integration for hallucination-free querying.',
    tags: ['Flutter', 'RAG', 'Node.js', 'FastAPI', 'Vector DB', 'Dart'],
    period: 'July 2026',
    badge: null as string | null,
  },
  {
    num: '02',
    title: 'Aaroha',
    sub: 'Recovery Support App',
    desc: 'Flutter addiction recovery companion powered by Groq AI (LLaMA 3.3 70B). Context-aware mental health conversations, mood tracking, crisis intervention, and OpenStreetMap integration.',
    tags: ['Flutter', 'Groq AI', 'LLaMA 3.3', 'Riverpod', 'Hive', 'OpenStreetMap'],
    period: 'March 2026',
    badge: '2nd Prize — Hack@arch 4.0',
  },
  {
    num: '03',
    title: 'CyberRaksha',
    sub: 'Cybersecurity Awareness Platform',
    desc: 'Full-stack interactive cybersecurity simulation with JWT auth, role-based access control, and a gamified XP-based progress engine. Built on React, Express.js, and PostgreSQL.',
    tags: ['React', 'Express.js', 'PostgreSQL', 'JWT', 'Docker', 'Vercel'],
    period: 'Dec 2025 – Mar 2026',
    badge: null,
  },
  {
    num: '04',
    title: 'Prawn Sentinel',
    sub: 'IoT Water Quality Monitor',
    desc: 'ESP32-based IoT system with multi-parameter sensors and a React/Firebase dashboard for real-time water quality tracking. Deployed under a government initiative with deep sleep power optimization.',
    tags: ['ESP32', 'React', 'Firebase', 'IoT', 'Node.js', 'C++'],
    period: 'Oct 2025 – Jan 2026',
    badge: 'Government Initiative',
  },
]

const SKILLS = [
  { group: 'Languages & Frontend', items: ['JavaScript', 'TypeScript', 'Java', 'Dart', 'C', 'SQL', 'React.js', 'Flutter', 'HTML/CSS'] },
  { group: 'Backend & Databases', items: ['Node.js', 'Express.js', 'Prisma', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase'] },
  { group: 'Cloud, Tools & IoT', items: ['Docker', 'Git', 'Vercel', 'Render', 'ESP32', 'Socket.IO', 'Postman'] },
  { group: 'AI Integration', items: ['Groq API', 'Gemini API', 'LLaMA 3.3', 'RAG Architectures', 'Vector DB'] },
]

/* ─── HOOKS ─────────────────────────────────────────────────────────────── */

function useTypewriter(words: string[], typeSpeed = 75, deleteSpeed = 38, pause = 2200) {
  const [text, setText] = useState('')
  const [wi, setWi] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const word = words[wi]
    let t: ReturnType<typeof setTimeout>
    if (!deleting) {
      if (text.length < word.length) {
        t = setTimeout(() => setText(word.slice(0, text.length + 1)), typeSpeed)
      } else {
        t = setTimeout(() => setDeleting(true), pause)
      }
    } else {
      if (text.length > 0) {
        t = setTimeout(() => setText(text.slice(0, -1)), deleteSpeed)
      } else {
        setDeleting(false)
        setWi((p) => (p + 1) % words.length)
      }
    }
    return () => clearTimeout(t)
  }, [text, deleting, wi, words, typeSpeed, deleteSpeed, pause])

  return text
}

function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) { setOn(true); obs.disconnect() }
      },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, on }
}

/* ─── PRIMITIVES ────────────────────────────────────────────────────────── */

function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const { ref, on } = useReveal()
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${on ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-9'} ${className}`}
    >
      {children}
    </div>
  )
}

function SectionLabel({ n, text }: { n: string; text: string }) {
  return (
    <div className="flex items-center gap-3 mb-16">
      <span className="font-mono text-[11px] text-accent tracking-[0.3em]">{n}</span>
      <span className="h-px w-6 block bg-accent/30" />
      <span className="font-mono text-[11px] text-fg/30 tracking-[0.2em] uppercase">{text}</span>
    </div>
  )
}

/* ─── CURSOR ────────────────────────────────────────────────────────────── */

function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const mouse = useRef({ x: -200, y: -200 })
  const pos = useRef({ x: -200, y: -200 })
  const raf = useRef(0)
  const isHover = useRef(false)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
      isHover.current = getComputedStyle(e.target as Element).cursor === 'pointer'
    }
    window.addEventListener('mousemove', onMove)

    const tick = () => {
      pos.current.x += (mouse.current.x - pos.current.x) * 0.1
      pos.current.y += (mouse.current.y - pos.current.y) * 0.1
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouse.current.x - 3}px,${mouse.current.y - 3}px)`
      }
      if (ringRef.current) {
        const scale = isHover.current ? 1.7 : 1
        ringRef.current.style.transform = `translate(${pos.current.x - 18}px,${pos.current.y - 18}px) scale(${scale})`
        ringRef.current.style.borderColor = isHover.current ? 'var(--color-accent)' : 'rgba(212,255,58,0.35)'
        ringRef.current.style.opacity = isHover.current ? '1' : '0.6'
      }
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-accent pointer-events-none z-[9999]"
        style={{ willChange: 'transform' }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-9 h-9 rounded-full border pointer-events-none z-[9998]"
        style={{ willChange: 'transform', transition: 'border-color 0.25s, opacity 0.25s, transform 0.05s' }}
      />
    </>
  )
}

/* ─── SCROLL PROGRESS ───────────────────────────────────────────────────── */

function ScrollBar() {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const fn = () => {
      const total = document.body.scrollHeight - window.innerHeight
      setPct(total > 0 ? (window.scrollY / total) * 100 : 0)
    }
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-px bg-border">
      <div className="h-full bg-accent" style={{ width: `${pct}%`, transition: 'none' }} />
    </div>
  )
}

/* ─── NAV ───────────────────────────────────────────────────────────────── */

function Nav({ active }: { active: string }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-bg/88 backdrop-blur-2xl border-b border-border' : ''
      }`}
    >
      <div className="max-w-screen-xl mx-auto px-6 md:px-12 py-5 flex items-center justify-between">
        <a
          href="#hero"
          className="font-display font-bold text-lg text-fg tracking-tight"
        >
          SPS<span className="text-accent">.</span>
        </a>

        {/* desktop */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className={`font-mono text-[11px] tracking-[0.2em] uppercase transition-colors duration-200 ${
                active === id ? 'text-accent' : 'text-fg/45 hover:text-fg'
              }`}
            >
              {label}
            </a>
          ))}
          <a
            href="mailto:pssreehari10@gmail.com"
            className="px-4 py-2 border border-fg/15 text-fg/65 text-xs font-medium rounded-full hover:border-accent hover:text-accent transition-all duration-200"
          >
            Hire Me ↗
          </a>
        </div>

        {/* mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-1"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span
            className={`block h-px w-5 bg-fg/70 transition-all duration-300 origin-center ${open ? 'rotate-45 translate-y-[7px]' : ''}`}
          />
          <span
            className={`block h-px w-5 bg-fg/70 transition-all duration-300 ${open ? 'opacity-0' : ''}`}
          />
          <span
            className={`block h-px w-5 bg-fg/70 transition-all duration-300 origin-center ${open ? '-rotate-45 -translate-y-[7px]' : ''}`}
          />
        </button>
      </div>

      {/* mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          open ? 'max-h-64 border-t border-border' : 'max-h-0'
        } bg-bg/96 backdrop-blur-xl`}
      >
        <div className="px-6 py-6 flex flex-col gap-5">
          {NAV_LINKS.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className="text-fg/65 text-sm"
              onClick={() => setOpen(false)}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}

/* ─── HERO ──────────────────────────────────────────────────────────────── */

function Hero() {
  const role = useTypewriter(ROLES)

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24 pt-24 pb-20 max-w-screen-xl mx-auto overflow-hidden"
    >
      {/* ambient glow */}
      <div
        className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(212,255,58,0.04) 0%, transparent 70%)' }}
      />

      {/* availability badge */}
      <Reveal>
        <div className="mb-12">
          <span className="inline-flex items-center gap-2.5 px-3.5 py-1.5 border border-fg/10 rounded-full">
            <span
              className="w-1.5 h-1.5 rounded-full bg-accent"
              style={{ animation: 'pulse-dot 2s ease-in-out infinite' }}
            />
            <span className="font-mono text-[11px] text-fg/45">Available for internships · 2026</span>
          </span>
        </div>
      </Reveal>

      {/* headline */}
      <Reveal delay={80}>
        <h1
          className="font-display font-black text-fg tracking-tight mb-8 max-w-5xl"
          style={{ fontSize: 'clamp(3.2rem, 11vw, 9.5rem)', lineHeight: 0.92 }}
        >
          Building{' '}
          <em
            className="not-italic"
            style={{ fontWeight: 200, color: 'rgba(242,239,234,0.15)' }}
          >
            digital
          </em>
          <br />
          <span className="italic">futures</span>
          <span className="text-accent">.</span>
        </h1>
      </Reveal>

      {/* typewriter role */}
      <Reveal delay={160}>
        <div className="flex items-center gap-4 mb-10">
          <div className="w-7 h-px bg-accent/50" />
          <span className="font-mono text-sm text-fg/45 min-h-[1.4em]">
            {role}
            <span className="text-accent ml-0.5 animate-pulse">|</span>
          </span>
        </div>
      </Reveal>

      {/* tagline */}
      <Reveal delay={220}>
        <p className="text-fg/50 text-base md:text-lg max-w-[42ch] mb-14 leading-relaxed">
          Sreehari P S — B.Tech CSE at GEC Thrissur. I engineer intelligent
          full-stack systems, AI-integrated apps, and IoT solutions that solve
          real problems.
        </p>
      </Reveal>

      {/* CTAs */}
      <Reveal delay={280}>
        <div className="flex flex-wrap gap-4 mb-20">
          <a
            href="#projects"
            className="group inline-flex items-center gap-2.5 px-7 py-3.5 bg-accent text-bg text-sm font-semibold rounded-full hover:bg-accent/90 transition-all duration-200"
          >
            View Work
            <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
          </a>
          <a
            href="#contact"
            className="inline-flex items-center px-7 py-3.5 border border-fg/15 text-fg/65 text-sm font-medium rounded-full hover:border-fg/40 hover:text-fg transition-all duration-200"
          >
            Get in Touch
          </a>
        </div>
      </Reveal>

      {/* scroll indicator */}
      <Reveal delay={340}>
        <div className="flex items-center gap-3 text-fg/20">
          <div
            className="w-px h-10"
            style={{ background: 'linear-gradient(to bottom, rgba(242,239,234,0.15), transparent)' }}
          />
          <span className="font-mono text-[10px] tracking-[0.4em]">SCROLL</span>
        </div>
      </Reveal>
    </section>
  )
}

/* ─── ABOUT ─────────────────────────────────────────────────────────────── */

function About() {
  const stats = [
    { val: '8.26', label: 'CGPA', accent: false },
    { val: '4+', label: 'Projects Shipped', accent: false },
    { val: '2nd', label: 'Hack@arch Prize', accent: true },
    { val: 'Top 2%', label: 'NPTEL Score', accent: false },
  ]

  return (
    <section id="about" className="py-28 px-6 md:px-12 lg:px-24 max-w-screen-xl mx-auto">
      <Reveal>
        <SectionLabel n="01" text="About" />
      </Reveal>

      <div className="grid md:grid-cols-5 gap-12 md:gap-20 items-start">
        <div className="md:col-span-3 space-y-6">
          <Reveal>
            <h2
              className="font-display font-bold text-fg leading-tight"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 3.2rem)' }}
            >
              Engineering{' '}
              <em className="italic text-accent">intelligent</em>{' '}
              systems from Kerala, India.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <div className="space-y-4 text-fg/55 text-[15px] leading-[1.75]">
              <p>
                I'm a Computer Science undergrad at Government Engineering College,
                Thrissur (CGPA 8.26), working at the intersection of full-stack
                engineering, mobile development, and AI integration.
              </p>
              <p>
                Most recently, I interned at{' '}
                <span className="text-fg font-medium">Exalture Software Labs</span>{' '}
                where I architected production-grade queue management systems,
                AI-powered recruitment workflows, and real-time WebSocket dashboards.
              </p>
              <p>
                I care about systems that are reliable, thoughtfully designed, and
                actually useful — whether that's an IoT water monitor deployed under
                a government initiative or a mental health companion that won a
                national hackathon.
              </p>
            </div>
          </Reveal>
        </div>

        <div className="md:col-span-2">
          <Reveal delay={180}>
            <div className="grid grid-cols-2 gap-px bg-border">
              {stats.map(({ val, label, accent }) => (
                <div key={label} className="bg-bg p-6">
                  <div
                    className={`font-display text-[2rem] font-bold mb-1.5 ${accent ? 'text-accent' : 'text-fg'}`}
                  >
                    {val}
                  </div>
                  <div className="font-mono text-[10px] text-fg/30 tracking-widest uppercase leading-relaxed">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ─── EXPERIENCE ────────────────────────────────────────────────────────── */

function Experience() {
  return (
    <section
      id="experience"
      className="py-28 px-6 md:px-12 lg:px-24 max-w-screen-xl mx-auto border-t border-border"
    >
      <Reveal>
        <SectionLabel n="02" text="Experience" />
      </Reveal>

      <div className="grid md:grid-cols-5 gap-12 md:gap-20">
        {/* left: job */}
        <div className="md:col-span-3">
          <Reveal>
            <div>
              <span className="font-mono text-[11px] text-accent tracking-widest">May 2026 – June 2026</span>
              <h3 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] font-bold text-fg mt-2">
                Product Intern
              </h3>
              <p className="text-fg/45 text-sm mt-1">Full Stack Development & Mobile App Development</p>
              <p className="text-accent/65 text-sm font-medium mt-0.5">
                Exalture Software Labs Pvt. Ltd. · Ernakulam, Kerala
              </p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <ul className="mt-9 space-y-5">
              {[
                'Architected a thread-safe token generation and queue management engine using Node.js and PostgreSQL locks, supporting walk-in and scheduled bookings with automated state transitions and real-time wait-time estimation.',
                'Designed AI-powered recruitment workflows integrating Google GenAI for candidate scoring, ranking, and automated interview scheduling.',
                'Built responsive React web apps and Flutter mobile features including receptionist dashboards and real-time queue tracking synchronized via Socket.IO.',
                'Led deployment and infrastructure configuration of backend services using Docker, Redis, and Vercel, resolving production issues and ensuring system reliability.',
              ].map((pt, i) => (
                <li key={i} className="flex gap-4 text-fg/55 text-sm leading-relaxed">
                  <span className="text-accent mt-0.5 shrink-0 text-base">—</span>
                  {pt}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={180}>
            <div className="flex flex-wrap gap-2 mt-8">
              {['Node.js', 'PostgreSQL', 'React.js', 'Flutter', 'Socket.IO', 'Docker', 'Redis', 'Google GenAI', 'Vercel'].map(
                (t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 border border-border text-fg/40 font-mono text-[11px] rounded"
                  >
                    {t}
                  </span>
                ),
              )}
            </div>
          </Reveal>
        </div>

        {/* right: cards */}
        <div className="md:col-span-2 space-y-4">
          <Reveal delay={100}>
            <div className="p-6 border border-border rounded-xl bg-card">
              <span className="font-mono text-[11px] text-accent">Education</span>
              <h4 className="font-display text-xl font-bold text-fg mt-3 leading-snug">
                B.Tech Computer Science & Engineering
              </h4>
              <p className="text-fg/45 text-sm mt-2">Government Engineering College, Thrissur</p>
              <div className="flex items-baseline justify-between mt-5 pt-5 border-t border-border">
                <span className="font-display text-2xl font-bold text-fg">
                  8.26{' '}
                  <span className="font-sans text-sm text-fg/30 font-normal">CGPA</span>
                </span>
                <span className="font-mono text-[11px] text-fg/30">2023 – 2027</span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={160}>
            <div className="p-6 border border-border rounded-xl bg-card">
              <span className="font-mono text-[11px] text-accent">Certification</span>
              <h4 className="font-display text-xl font-bold text-fg mt-3 leading-snug">
                NPTEL: Introduction to IoT
              </h4>
              <p className="text-fg/45 text-sm mt-2">Elite Certification · Score: 91%</p>
              <div className="flex items-center justify-between mt-5 pt-5 border-t border-border">
                <span className="text-sm text-fg/50">
                  Top <span className="text-accent font-semibold">2%</span> nationwide
                </span>
                <span className="font-mono text-[11px] text-fg/30">Jul – Oct 2024</span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={220}>
            <div
              className="p-6 rounded-xl"
              style={{ border: '1px solid rgba(212,255,58,0.2)', background: 'rgba(212,255,58,0.04)' }}
            >
              <span className="font-mono text-[11px] text-accent">Achievement</span>
              <h4 className="font-display text-xl font-bold text-fg mt-3 leading-snug">
                2nd Prize — Hack@arch 4.0
              </h4>
              <p className="text-fg/45 text-sm mt-2">HackQuest Hackathon · Aaroha Recovery App</p>
              <div className="mt-5 pt-5 border-t" style={{ borderColor: 'rgba(212,255,58,0.15)' }}>
                <span className="font-mono text-[11px] text-fg/30">March 2026</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ─── PROJECTS ──────────────────────────────────────────────────────────── */

function Projects() {
  return (
    <section
      id="projects"
      className="py-28 px-6 md:px-12 lg:px-24 max-w-screen-xl mx-auto border-t border-border"
    >
      <Reveal>
        <SectionLabel n="03" text="Projects" />
      </Reveal>

      <div className="grid md:grid-cols-2 gap-px bg-border">
        {PROJECTS.map((p, i) => (
          <Reveal key={p.num} delay={i * 60}>
            <article className="bg-bg p-8 md:p-10 group hover:bg-card transition-colors duration-300 h-full flex flex-col">
              <div className="flex items-start justify-between mb-8">
                <span className="font-mono text-[11px] text-fg/15">{p.num}</span>
                {p.badge && (
                  <span
                    className="font-mono text-[10px] text-accent border px-2.5 py-0.5 rounded-full text-right"
                    style={{ borderColor: 'rgba(212,255,58,0.25)' }}
                  >
                    {p.badge}
                  </span>
                )}
              </div>

              <h3 className="font-display text-[clamp(1.5rem,3vw,2rem)] font-bold text-fg mb-1.5 group-hover:text-accent transition-colors duration-300">
                {p.title}
              </h3>
              <p className="font-mono text-[11px] text-fg/30 mb-5">{p.sub}</p>
              <p className="text-fg/55 text-sm leading-relaxed mb-7 flex-1">{p.desc}</p>

              <div className="flex flex-wrap gap-1.5 mb-7">
                {p.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 border border-border text-fg/35 font-mono text-[11px] rounded group-hover:border-fg/15 transition-colors duration-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-fg/20">{p.period}</span>
                <span className="font-mono text-[11px] text-fg/25 group-hover:text-accent transition-colors duration-300">
                  View Project →
                </span>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ─── SKILLS ────────────────────────────────────────────────────────────── */

function Skills() {
  return (
    <section
      id="skills"
      className="py-28 px-6 md:px-12 lg:px-24 max-w-screen-xl mx-auto border-t border-border"
    >
      <Reveal>
        <SectionLabel n="04" text="Skills" />
      </Reveal>

      <div className="grid sm:grid-cols-2 gap-12 md:gap-16">
        {SKILLS.map((group, gi) => (
          <Reveal key={group.group} delay={gi * 80}>
            <div>
              <h3 className="font-mono text-[11px] text-accent tracking-widest uppercase mb-5">
                {group.group}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 border border-border text-fg/60 text-sm rounded hover:border-accent/35 hover:text-fg transition-all duration-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ─── CONTACT ───────────────────────────────────────────────────────────── */

function Contact() {
  const links = [
    { label: 'Email', value: 'pssreehari10@gmail.com', href: 'mailto:pssreehari10@gmail.com' },
    { label: 'LinkedIn', value: 'linkedin.com/in/sreehari-p-s-', href: 'https://linkedin.com/in/sreehari-p-s-' },
    { label: 'GitHub', value: 'github.com/Sreehari-P-S-10', href: 'https://github.com/Sreehari-P-S-10' },
    { label: 'Phone', value: '+91 7034 003 015', href: 'tel:+917034003015' },
  ]

  return (
    <section
      id="contact"
      className="py-28 px-6 md:px-12 lg:px-24 max-w-screen-xl mx-auto border-t border-border relative"
    >
      {/* ambient glow */}
      <div
        className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(212,255,58,0.04) 0%, transparent 70%)' }}
      />

      <Reveal>
        <SectionLabel n="05" text="Contact" />
      </Reveal>

      <div className="grid md:grid-cols-2 gap-16 md:gap-28 items-end">
        <Reveal>
          <div>
            <h2
              className="font-display font-bold text-fg leading-tight mb-6"
              style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3.5rem)' }}
            >
              Let's build something{' '}
              <em className="italic text-accent">remarkable</em>{' '}
              together.
            </h2>
            <p className="text-fg/50 text-[15px] leading-relaxed max-w-[38ch]">
              Open to internship opportunities and interesting collaborations.
              Drop me a message — I reply within 24 hours.
            </p>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div>
            {links.map(({ label, value, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between py-5 border-b border-border group hover:border-accent/20 transition-all duration-300"
              >
                <span className="font-mono text-[11px] text-fg/30 uppercase tracking-widest">
                  {label}
                </span>
                <span className="text-fg/65 group-hover:text-accent text-sm font-medium transition-colors duration-300 flex items-center gap-2">
                  {value}
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-base">
                    ↗
                  </span>
                </span>
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ─── FOOTER ────────────────────────────────────────────────────────────── */

function Footer() {
  return (
    <footer className="py-8 px-6 md:px-12 lg:px-24 max-w-screen-xl mx-auto border-t border-border">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <span className="font-display font-semibold text-fg/25 text-sm">Sreehari P S</span>
        <span className="font-mono text-[11px] text-fg/20">
          © 2026 — Crafted with intent.
        </span>
      </div>
    </footer>
  )
}

/* ─── ROOT ──────────────────────────────────────────────────────────────── */

export default function App() {
  const [active, setActive] = useState('hero')
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    setIsTouch(window.matchMedia('(pointer: coarse)').matches)
  }, [])

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]')
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        }),
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )
    sections.forEach((s) => obs.observe(s))
    return () => obs.disconnect()
  }, [])

  return (
    <div className="bg-bg text-fg min-h-screen grain-overlay">
      {!isTouch && <Cursor />}
      <ScrollBar />
      <Nav active={active} />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

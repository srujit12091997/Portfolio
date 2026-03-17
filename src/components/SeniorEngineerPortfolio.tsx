"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Cloud,
  Code2,
  Cpu,
  Database,
  Download,
  Gauge,
  Layers3,
  Menu,
  Moon,
  Server,
  ShieldCheck,
  Sparkles,
  Sun,
  X,
} from "lucide-react";

type ThemeMode = "dark" | "light";

export type SeniorEngineerPortfolioProps = {
  className?: string;
  onThemeChange?: (theme: ThemeMode) => void;
  profileImageSrc?: string;
  resumeHref?: string;
  theme?: ThemeMode;
};

type Metric = {
  icon: typeof BriefcaseBusiness;
  label: string;
  value: string;
};

type StackGroup = {
  icon: typeof Code2;
  title: string;
  items: string[];
};

const navItems = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#focus", label: "Focus" },
  { href: "#work", label: "Work" },
];

const metrics: Metric[] = [
  {
    icon: BriefcaseBusiness,
    value: "5+",
    label: "Years shipping product-facing software",
  },
  {
    icon: Layers3,
    value: "UI + API",
    label: "Frontend systems paired with dependable service layers",
  },
  {
    icon: Gauge,
    value: "Fast",
    label: "Performance-aware interfaces built for real users",
  },
  {
    icon: ShieldCheck,
    value: "Reliable",
    label: "Engineering discipline across auth, state, and delivery",
  },
];

const stackGroups: StackGroup[] = [
  {
    icon: Code2,
    title: "Frontend",
    items: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Framer Motion"],
  },
  {
    icon: Server,
    title: "Backend",
    items: ["Node.js", "Python", "Java", "REST APIs", "Auth Flows"],
  },
  {
    icon: Database,
    title: "Data",
    items: ["PostgreSQL", "MongoDB", "Prisma", "Caching", "Analytics"],
  },
  {
    icon: Cloud,
    title: "Platform",
    items: ["AWS", "Docker", "CI/CD", "Observability", "Scaling"],
  },
];

const focusAreas = [
  "Designing React experiences that feel sharp, clear, and production-ready.",
  "Turning ambiguous requirements into maintainable services and interface flows.",
  "Balancing usability, delivery speed, and long-term engineering quality.",
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

function panelTone(theme: ThemeMode) {
  return theme === "dark"
    ? "border-white/10 bg-white/5 shadow-[0_24px_80px_rgba(0,0,0,0.32)]"
    : "border-slate-200/70 bg-white/[0.65] shadow-[0_24px_80px_rgba(15,23,42,0.12)]";
}

function pillTone(theme: ThemeMode) {
  return theme === "dark"
    ? "border-white/10 bg-white/[0.06] text-slate-200"
    : "border-slate-200/80 bg-white/80 text-slate-700";
}

function mutedText(theme: ThemeMode) {
  return theme === "dark" ? "text-slate-300/80" : "text-slate-600";
}

function sectionLabel(theme: ThemeMode) {
  return theme === "dark" ? "text-slate-400" : "text-slate-500";
}

function themeShell(theme: ThemeMode) {
  return theme === "dark" ? "bg-[#0B0E14] text-white" : "bg-[#eef7ff] text-slate-950";
}

function navTone(theme: ThemeMode) {
  return theme === "dark"
    ? "border-white/10 bg-white/5 text-slate-200"
    : "border-slate-200/70 bg-white/70 text-slate-700";
}

function headerTone(theme: ThemeMode) {
  return theme === "dark"
    ? "border-white/10 bg-[#0B0E14]/72"
    : "border-slate-200/80 bg-[#eef7ff]/78";
}

function buttonTone(theme: ThemeMode) {
  return theme === "dark"
    ? "border-transparent bg-slate-100 text-slate-950 shadow-[0_0_32px_rgba(45,212,191,0.18)] hover:bg-white"
    : "border-transparent bg-slate-950 text-white shadow-[0_0_32px_rgba(59,130,246,0.18)] hover:bg-slate-800";
}

function secondaryButtonTone(theme: ThemeMode) {
  return theme === "dark"
    ? "border-white/10 bg-white/5 text-slate-100 hover:bg-white/10"
    : "border-slate-200/80 bg-white/70 text-slate-800 hover:bg-white";
}

function dividerTone(theme: ThemeMode) {
  return theme === "dark" ? "bg-white/12" : "bg-slate-300/80";
}

function navLinkTone(theme: ThemeMode) {
  return theme === "dark"
    ? "text-slate-200 hover:text-teal-300"
    : "text-slate-700 hover:text-teal-600";
}

function meshGradients(theme: ThemeMode): ReactNode {
  if (theme === "dark") {
    return (
      <>
        <div className="absolute left-[-10rem] top-[-8rem] h-[28rem] w-[28rem] rounded-full bg-teal-400/20 blur-3xl" />
        <div className="absolute right-[-8rem] top-[4rem] h-[30rem] w-[30rem] rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute bottom-[-10rem] left-[24%] h-[24rem] w-[24rem] rounded-full bg-violet-500/10 blur-3xl" />
      </>
    );
  }

  return (
    <>
      <div className="absolute left-[-10rem] top-[-8rem] h-[28rem] w-[28rem] rounded-full bg-sky-300/40 blur-3xl" />
      <div className="absolute right-[-8rem] top-[3rem] h-[30rem] w-[30rem] rounded-full bg-cyan-300/30 blur-3xl" />
      <div className="absolute bottom-[-10rem] left-[24%] h-[24rem] w-[24rem] rounded-full bg-emerald-300/30 blur-3xl" />
    </>
  );
}

export default function SeniorEngineerPortfolio({
  className = "",
  onThemeChange,
  profileImageSrc,
  resumeHref = "/resume.pdf",
  theme = "dark",
}: SeniorEngineerPortfolioProps) {
  const [activeTheme, setActiveTheme] = useState<ThemeMode>(theme);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setActiveTheme(theme);
  }, [theme]);

  function handleThemeToggle() {
    const nextTheme = activeTheme === "dark" ? "light" : "dark";
    setActiveTheme(nextTheme);
    onThemeChange?.(nextTheme);
  }

  return (
    <section
      className={`relative isolate overflow-hidden ${themeShell(activeTheme)} ${className}`}
      style={{ fontFamily: "Inter, Geist, ui-sans-serif, system-ui, sans-serif" }}
    >
      <div className="pointer-events-none absolute inset-0">
        {meshGradients(activeTheme)}
        <div
          className={`absolute inset-0 ${
            activeTheme === "dark"
              ? "bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_40%)]"
              : "bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.8),transparent_38%)]"
          }`}
        />
      </div>

      <header
        className={`sticky top-0 z-50 border-b backdrop-blur-[12px] ${headerTone(activeTheme)}`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex min-w-0 flex-1 justify-start">
            <a href="#top" className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 via-cyan-400 to-blue-500 text-sm font-black text-white">
                SV
              </span>
              <div className="hidden min-w-0 sm:block">
                <p className="truncate text-sm font-semibold tracking-tight">
                  Senior Software Engineer
                </p>
                <p className={`text-xs ${mutedText(activeTheme)}`}>
                  Modern product engineering
                </p>
              </div>
            </a>
          </div>

          <div className="hidden flex-1 items-center justify-center gap-8 md:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition ${navLinkTone(activeTheme)}`}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">
            <div className={`flex items-center rounded-full border p-1.5 ${navTone(activeTheme)}`}>
              <a
                href={resumeHref}
                className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-xs font-semibold transition sm:px-4 sm:py-2.5 sm:text-sm ${buttonTone(activeTheme)}`}
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Download Resume</span>
                <span className="sm:hidden">Resume</span>
              </a>

              <span
                aria-hidden="true"
                className={`mx-2 h-7 w-px shrink-0 ${dividerTone(activeTheme)}`}
              />

              <button
                type="button"
                onClick={handleThemeToggle}
                aria-label={`Switch to ${activeTheme === "dark" ? "light" : "dark"} theme`}
                aria-pressed={activeTheme === "dark"}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition ${secondaryButtonTone(activeTheme)}`}
              >
                {activeTheme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((current) => !current)}
              aria-controls="mobile-navigation"
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition md:hidden ${secondaryButtonTone(activeTheme)}`}
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>

        {isMobileMenuOpen ? (
          <div
            id="mobile-navigation"
            className={`border-t md:hidden ${
              activeTheme === "dark" ? "border-white/10" : "border-slate-200/80"
            }`}
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-3 sm:px-6">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${navTone(activeTheme)} ${navLinkTone(activeTheme)}`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        ) : null}
      </header>

      <div id="top" className="relative px-4 pb-16 pt-10 sm:pb-20 lg:pt-14">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,1.1fr)_26rem] lg:items-end">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="max-w-4xl"
          >
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold backdrop-blur-xl ${pillTone(activeTheme)}`}
            >
              <Sparkles className="h-4 w-4 text-teal-300" />
              Product-facing UI and full-stack delivery
            </span>

            <h1 className="mt-6 max-w-5xl text-4xl font-black tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Designing{" "}
              <span className="bg-gradient-to-r from-teal-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                React web apps
              </span>{" "}
              and{" "}
              <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-emerald-300 bg-clip-text text-transparent">
                full-stack software
              </span>{" "}
              that feel polished from pixel to production.
            </h1>

            <p
              className={`mt-6 max-w-3xl text-lg leading-8 sm:text-xl ${mutedText(activeTheme)}`}
            >
              I build product-facing software with a balance of UI clarity, engineering
              discipline, and delivery speed, turning requirements into dependable
              services.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#work"
                className={`inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold transition ${buttonTone(activeTheme)}`}
              >
                View Selected Work
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#focus"
                className={`inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold transition ${secondaryButtonTone(activeTheme)}`}
              >
                Explore Engineering Focus
              </a>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {[
                "Polished UI systems",
                "Dependable backend services",
                "Fast, disciplined delivery",
              ].map((item) => (
                <div
                  key={item}
                  className={`rounded-2xl border px-4 py-4 backdrop-blur-xl ${panelTone(activeTheme)}`}
                >
                  <p className="text-sm font-semibold tracking-tight">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ delay: 0.12 }}
            className="relative"
          >
            <div
              className={`relative overflow-hidden rounded-[2rem] border p-6 backdrop-blur-2xl ${panelTone(activeTheme)}`}
            >
              <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

              <div className="space-y-4">
                <div className={`rounded-[1.5rem] border p-5 ${panelTone(activeTheme)}`}>
                  <p
                    className={`text-xs font-semibold uppercase tracking-[0.24em] ${sectionLabel(activeTheme)}`}
                  >
                    Current Focus
                  </p>
                  <h2 className="mt-3 text-2xl font-bold tracking-tight">
                    Building software that feels intentional at every layer.
                  </h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  <div className={`rounded-[1.5rem] border p-5 ${panelTone(activeTheme)}`}>
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-gradient-to-br from-teal-400/25 to-blue-500/25 p-3 text-teal-200">
                        <Cpu className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Frontend Systems</p>
                        <p className={`text-sm ${mutedText(activeTheme)}`}>
                          Interaction, layout, motion
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`rounded-[1.5rem] border p-5 ${panelTone(activeTheme)}`}>
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-gradient-to-br from-cyan-400/25 to-emerald-400/25 p-3 text-cyan-200">
                        <Server className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Service Design</p>
                        <p className={`text-sm ${mutedText(activeTheme)}`}>APIs, auth, delivery</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mt-4 flex justify-end lg:absolute lg:-bottom-8 lg:right-4 lg:mt-0 lg:w-[18rem]">
              <div
                className={`w-full max-w-[18rem] rounded-[1.75rem] border p-4 backdrop-blur-2xl ${panelTone(activeTheme)}`}
              >
                <p
                  className={`text-xs font-semibold uppercase tracking-[0.24em] ${sectionLabel(activeTheme)}`}
                >
                  Positioning
                </p>

                <div className="mt-4 flex items-center gap-4">
                  <div className="h-16 w-16 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-teal-400 via-cyan-400 to-blue-500">
                    {profileImageSrc ? (
                      <img
                        src={profileImageSrc}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-lg font-black text-white">
                        SV
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">Senior Software Engineer</p>
                    <span
                      className={`mt-2 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${pillTone(activeTheme)}`}
                    >
                      <BadgeCheck className="h-3.5 w-3.5 text-teal-300" />
                      Software Engineer
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div id="focus" className="relative px-4 pb-20 lg:pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6">
            <p
              className={`text-sm font-semibold uppercase tracking-[0.22em] ${sectionLabel(activeTheme)}`}
            >
              Bento Grid
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tighter sm:text-4xl">
              Stats and tech stack arranged for quick signal.
            </h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-12">
            <motion.article
              id="about"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              className={`rounded-[2rem] border p-6 backdrop-blur-2xl lg:col-span-5 ${panelTone(activeTheme)}`}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p
                    className={`text-sm font-semibold uppercase tracking-[0.22em] ${sectionLabel(activeTheme)}`}
                  >
                    Stats
                  </p>
                  <h3 className="mt-2 text-2xl font-bold tracking-tight">
                    Product-minded engineering with senior-level range.
                  </h3>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-teal-400/20 to-blue-500/20 p-3 text-teal-200">
                  <Layers3 className="h-6 w-6" />
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {metrics.map((metric) => {
                  const Icon = metric.icon;
                  return (
                    <div
                      key={metric.label}
                      className={`rounded-[1.5rem] border p-4 ${panelTone(activeTheme)}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-2xl bg-gradient-to-br from-teal-400/20 to-cyan-400/20 p-3 text-teal-200">
                          <Icon className="h-5 w-5" />
                        </div>
                        <p className="text-lg font-black tracking-tight">{metric.value}</p>
                      </div>
                      <p className={`mt-4 text-sm leading-6 ${mutedText(activeTheme)}`}>
                        {metric.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </motion.article>

            <motion.article
              id="experience"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              className={`rounded-[2rem] border p-6 backdrop-blur-2xl lg:col-span-7 ${panelTone(activeTheme)}`}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p
                    className={`text-sm font-semibold uppercase tracking-[0.22em] ${sectionLabel(activeTheme)}`}
                  >
                    Tech Stack
                  </p>
                  <h3 className="mt-2 text-2xl font-bold tracking-tight">
                    Tools selected for polished UI, resilient APIs, and steady delivery.
                  </h3>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-cyan-400/20 to-emerald-400/20 p-3 text-cyan-200">
                  <Sparkles className="h-6 w-6" />
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {stackGroups.map((group) => {
                  const Icon = group.icon;
                  return (
                    <div
                      key={group.title}
                      className={`rounded-[1.5rem] border p-4 ${panelTone(activeTheme)}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-2xl bg-gradient-to-br from-blue-500/20 to-teal-400/20 p-3 text-cyan-200">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-base font-bold tracking-tight">{group.title}</p>
                          <p className={`text-sm ${mutedText(activeTheme)}`}>Core capabilities</p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {group.items.map((item) => (
                          <span
                            key={item}
                            className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${pillTone(activeTheme)}`}
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.article>

            <motion.article
              id="work"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              className={`rounded-[2rem] border p-6 backdrop-blur-2xl lg:col-span-12 ${panelTone(activeTheme)}`}
            >
              <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                <div>
                  <p
                    className={`text-sm font-semibold uppercase tracking-[0.22em] ${sectionLabel(activeTheme)}`}
                  >
                    Focus
                  </p>
                  <h3 className="mt-2 text-2xl font-bold tracking-tight">
                    Clear product thinking backed by disciplined implementation.
                  </h3>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {focusAreas.map((item) => (
                    <div
                      key={item}
                      className={`rounded-[1.5rem] border p-4 ${panelTone(activeTheme)}`}
                    >
                      <p className={`text-sm leading-6 ${mutedText(activeTheme)}`}>{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.article>
          </div>
        </div>
      </div>
    </section>
  );
}

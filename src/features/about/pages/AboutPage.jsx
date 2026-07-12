import { Link } from 'react-router-dom'
import { aboutPageContent } from '../constants/aboutPageContent'

function AboutPage() {
  const { hero, story, highlights, stats, values } = aboutPageContent

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#0f8b86_0%,#14213d_100%)] px-6 py-10 text-white shadow-[0_20px_45px_rgba(20,33,61,0.18)] sm:px-8 lg:px-12 lg:py-14">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/70">{hero.eyebrow}</p>
        <div className="mt-4 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <h1 className="max-w-3xl text-3xl font-black tracking-[-0.05em] sm:text-4xl lg:text-5xl">
              {hero.title}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/78 sm:text-base">
              {hero.description}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {stats.map((item) => (
              <div key={item.label} className="rounded-[1.4rem] border border-white/14 bg-white/10 p-5 backdrop-blur">
                <p className="text-3xl font-black">{item.value}</p>
                <p className="mt-2 text-sm text-white/72">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-[1.8rem] border border-[var(--color-border)] bg-white p-6 shadow-[0_14px_30px_rgba(24,35,30,0.06)] sm:p-8">
          <h2 className="text-2xl font-extrabold text-[var(--color-heading)]">{story.title}</h2>
          <div className="mt-4 space-y-4 text-sm leading-7 text-[var(--color-copy)] sm:text-base">
            {story.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </article>

        <div className="grid gap-4">
          {highlights.map((item) => (
            <article
              key={item.title}
              className="rounded-[1.6rem] border border-[var(--color-border)] bg-[#f8fbfa] p-6 shadow-[0_10px_24px_rgba(24,35,30,0.04)]"
            >
              <h3 className="text-lg font-extrabold text-[var(--color-heading)]">{item.title}</h3>
              <p className="mt-2 text-sm leading-7 text-[var(--color-copy)]">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[1.8rem] border border-[var(--color-border)] bg-white p-6 shadow-[0_14px_30px_rgba(24,35,30,0.06)] sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.26em] text-[var(--color-copy-soft)]">Our values</p>
            <h2 className="mt-3 text-2xl font-extrabold text-[var(--color-heading)]">{values.title}</h2>
          </div>
          <Link
            to="/contact"
            className="inline-flex w-fit items-center rounded-full bg-[#0f8b86] px-5 py-3 text-sm font-bold text-white shadow-[0_12px_26px_rgba(15,139,134,0.18)] transition hover:bg-[#0b7672]"
          >
            Contact our team
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {values.items.map((item) => (
            <article
              key={item.title}
              className="rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-page)] p-5"
            >
              <h3 className="text-base font-extrabold text-[var(--color-heading)]">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--color-copy)]">{item.description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default AboutPage

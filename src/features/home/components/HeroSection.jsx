import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function HeroSection({ slides, trustPoints }) {
  const [activeSlide, setActiveSlide] = useState(0)
  const slideCount = slides.length
  const safeActiveSlide = slideCount ? activeSlide % slideCount : 0
  const currentSlide = slides[safeActiveSlide]

  useEffect(() => {
    if (!slideCount) {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      setActiveSlide((current) => current + 1)
    }, 4500)

    return () => window.clearInterval(intervalId)
  }, [slideCount])

  if (!currentSlide) {
    return null
  }

  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-4 py-10 md:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-16">
      <div className="relative space-y-8">
        <div className="absolute -left-4 top-16 h-24 w-24 rounded-full bg-[var(--color-gold)]/25 blur-3xl" />
        <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/85 px-4 py-2 text-sm font-medium text-[var(--color-heading)] shadow-[0_10px_28px_rgba(37,22,15,0.06)] backdrop-blur">
          {currentSlide.badge}
        </div>
        <div className="space-y-5">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--color-accent)]">
            {currentSlide.eyebrow}
          </p>
          <h1 className="max-w-xl text-5xl font-semibold tracking-tight text-[var(--color-heading)] md:text-6xl">
            {currentSlide.title}
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-[var(--color-copy-soft)]">
            {currentSlide.description}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,_var(--color-accent),_var(--color-berry))] px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(61,120,197,0.22)] transition hover:-translate-y-0.5"
          >
            {currentSlide.ctaLabel}
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-full border border-white/80 bg-white/88 px-6 py-3 text-sm font-semibold text-[var(--color-heading)] shadow-[0_12px_28px_rgba(37,22,15,0.05)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            {currentSlide.secondaryCtaLabel}
          </Link>
        </div>
        <div className="flex items-center gap-3">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Show ${slide.title}`}
              onClick={() => setActiveSlide(index)}
              className={`h-3 rounded-full transition ${
                index === safeActiveSlide
                  ? 'w-10 bg-[var(--color-accent)]'
                  : 'w-3 bg-[var(--color-border-strong)]'
              }`}
            />
          ))}
        </div>
        <ul className="flex flex-wrap gap-3 text-sm text-[var(--color-copy-soft)]">
          {trustPoints.map((item) => (
            <li
              key={item}
              className="rounded-full border border-white/80 bg-white/72 px-4 py-2 shadow-[0_10px_24px_rgba(37,22,15,0.04)]"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="relative overflow-hidden rounded-[2.25rem] border border-white/65 bg-[radial-gradient(circle_at_top_left,_rgba(61,120,197,0.22),_transparent_45%),linear-gradient(135deg,_#f5f9fe,_#ffffff)] p-4 shadow-[0_28px_80px_rgba(61,120,197,0.12)]">
        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[var(--color-gold)]/30 blur-3xl" />
        <div className="relative overflow-hidden rounded-[1.6rem]">
          <img
            src={currentSlide.image || '/default-hero-banner.svg'}
            alt="Featured ecommerce collection"
            className="h-[420px] w-full scale-[1.02] object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1f140f]/82 via-[#1f140f]/42 to-transparent p-6 text-white">
            <div className="max-w-sm space-y-2">
              <span className="inline-flex rounded-full bg-white/18 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] backdrop-blur">
                {currentSlide.panelTag}
              </span>
              <h2 className="text-2xl font-semibold">{currentSlide.panelTitle}</h2>
              <p className="text-sm leading-6 text-white/80">
                {currentSlide.panelDescription}
              </p>
              <p className="text-xl font-semibold">{currentSlide.panelPrice}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection

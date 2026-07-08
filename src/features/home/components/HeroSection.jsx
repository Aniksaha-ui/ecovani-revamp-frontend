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
    <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 md:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-10">
      <div className="relative overflow-hidden rounded-[1.9rem] border border-[var(--color-border)] bg-[linear-gradient(135deg,_#1f2d27,_#274138_55%,_#325347)] px-6 py-8 text-white shadow-[0_28px_60px_rgba(24,35,30,0.14)] md:px-8 md:py-10">
        <div className="absolute -right-14 top-0 h-48 w-48 rounded-full bg-white/8 blur-3xl" />
        <div className="absolute bottom-[-5rem] left-[-3rem] h-44 w-44 rounded-full bg-[#7a998b]/18 blur-3xl" />
        <div className="relative space-y-7">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur">
            {currentSlide.badge}
            <span className="rounded-full bg-white/12 px-2 py-0.5 text-xs">Trusted store</span>
          </div>
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/72">
              {currentSlide.eyebrow}
            </p>
            <h1 className="max-w-xl text-4xl font-bold tracking-tight md:text-6xl">
              {currentSlide.title}
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-white/82">
              {currentSlide.description}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-[var(--color-heading)] transition hover:-translate-y-0.5"
            >
              Shop collection
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-transparent px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              View account
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
                    ? 'w-10 bg-white'
                    : 'w-3 bg-white/40'
                }`}
              />
            ))}
          </div>
          <ul className="flex flex-wrap gap-3 text-sm text-white/86">
            {trustPoints.map((item) => (
              <li
                key={item}
                className="rounded-full border border-white/16 bg-white/10 px-4 py-2 backdrop-blur"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[1.9rem] border border-[var(--color-border)] bg-white p-4 shadow-[0_18px_42px_rgba(24,35,30,0.06)]">
        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[var(--color-gold)]/45 blur-3xl" />
        <div className="relative overflow-hidden rounded-[1.6rem]">
          <img
            src={currentSlide.image || '/default-hero-banner.svg'}
            alt="Featured ecommerce collection"
            className="h-[420px] w-full scale-[1.02] object-cover"
          />
          <div className="absolute inset-x-4 bottom-4 rounded-[1.25rem] border border-white/80 bg-white/96 p-5 text-[var(--color-heading)] shadow-[0_14px_32px_rgba(24,35,30,0.12)] backdrop-blur">
            <div className="max-w-sm space-y-2">
              <span className="inline-flex rounded-full bg-[var(--color-panel)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent-strong)]">
                {currentSlide.panelTag}
              </span>
              <h2 className="text-2xl font-bold">{currentSlide.panelTitle}</h2>
              <p className="text-sm leading-6 text-[var(--color-copy-soft)]">
                {currentSlide.panelDescription}
              </p>
              <div className="flex items-center justify-between pt-2">
                <p className="text-xl font-bold">{currentSlide.panelPrice}</p>
                <span className="rounded-full bg-[var(--color-heading)] px-3 py-1 text-xs font-semibold text-white">
                  Editor's pick
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection

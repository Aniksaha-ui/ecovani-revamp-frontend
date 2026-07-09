import { Link } from 'react-router-dom'
import heroBannerImage from '../../../assets/hero.png'
import ProductGrid from '../../../shared/components/ProductGrid'
import RevealOnScroll from '../../../shared/components/RevealOnScroll'
import useHomePageData from '../hooks/useHomePageData'

const imageBaseUrl = (import.meta.env.VITE_IMAGE_URL || '')
  .replaceAll('"', '')
  .replace(/\s+/g, '')

function buildImageUrl(path) {
  if (!path) {
    return '/default-hero-banner.svg'
  }

  if (/^https?:\/\//i.test(path) || String(path).startsWith('/')) {
    return path
  }

  if (!imageBaseUrl) {
    return `/${String(path).replace(/^\/+/, '')}`
  }

  const normalizedBase = imageBaseUrl.endsWith('/') ? imageBaseUrl : `${imageBaseUrl}/`
  return `${normalizedBase}${String(path).replace(/^\/+/, '')}`
}

function productImage(product) {
  return buildImageUrl(product?.imagePath || product?.image)
}

function HomeSectionTitle({ title, action = 'View More Products' }) {
  return (
    <div className="mb-5 flex items-center justify-between gap-4">
      <h2 className="text-[1.45rem] font-extrabold text-[var(--color-heading)]">{title}</h2>
      {action.trim() ? (
        <button className="rounded-full border border-[#d7e6df] bg-white px-4 py-2 text-xs font-bold text-[var(--color-accent)] transition hover:-translate-y-0.5 hover:border-[var(--color-accent)] hover:shadow-[0_10px_22px_rgba(36,54,46,0.08)]">
          {action}
        </button>
      ) : null}
    </div>
  )
}

function ProductTabsSection({ title, tabs, activeTab = 0, children }) {
  return (
    <RevealOnScroll as="section" delay={70}>
      <div className="mb-10 text-center">
        <h2 className="text-[34px] font-extrabold tracking-[-0.04em] text-[#14213d]">{title}</h2>
        <div className="mx-auto mt-8 flex max-w-[690px] flex-wrap items-center justify-center gap-x-8 gap-y-3 border-b border-[#d9dfeb] pb-4">
          {tabs.map((item, index) => (
            <button
              key={item}
              className={`relative pb-3 text-[16px] font-semibold ${
                index === activeTab ? 'text-[#14213d]' : 'text-[#4d5d56]'
              }`}
            >
              {item}
              {index === activeTab ? (
                <span className="absolute inset-x-0 bottom-[-5px] h-[2px] bg-[#14213d]" />
              ) : null}
            </button>
          ))}
        </div>
      </div>
      {children}
    </RevealOnScroll>
  )
}

function HomePage() {
  const { isLoading, error, data } = useHomePageData()
  const { homepage } = data
  const hero = homepage.hero || {}
  const flashDeal = homepage.flashDeal || { title: '', tabs: [], products: [] }
  const mostLoved = homepage.mostLoved || { title: '', products: [] }
  const newLaunch = homepage.newLaunch || { title: '', products: [] }
  const allProducts = homepage.allProducts || { title: '', tabs: [], products: [] }
  const limitedDeal = homepage.limitedDeal || { title: '', featured: null, topRate: [], topItems: [] }
  const beautyCare = homepage.beautyCare || { title: '', products: [] }
  const featurePromos = homepage.featurePromos || []
  const featureItems = homepage.featureItems || []
  const brands = homepage.brands || []
  const categoryFavorites = homepage.categoryFavorites || []
  const latestBlog = homepage.latestBlog || []

  return (
    <div className="space-y-8">
      {(data.usingFallback || error) && (
        <section className="px-1 py-2">
          <div className="rounded-[1.2rem] border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-copy-soft)] shadow-[0_10px_24px_rgba(29,42,58,0.04)]">
            {error
              ? `${error} Showing fallback storefront content until the API is ready.`
              : 'API endpoints are configured, but the current storefront route set is unavailable. Showing fallback content for now.'}
          </div>
        </section>
      )}

      {isLoading && (
        <section className="px-1 py-2">
          <div className="rounded-[1.2rem] border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-copy-soft)] shadow-[0_10px_24px_rgba(29,42,58,0.04)]">
            Loading homepage data from the ecommerce API...
          </div>
        </section>
      )}

      <section className="space-y-4">
        <RevealOnScroll
          className="relative overflow-hidden rounded-[1.9rem] bg-[#ffe96a] shadow-[0_18px_40px_rgba(36,54,46,0.08)]"
          direction="zoom"
        >
          <button className="absolute left-6 top-1/2 z-20 flex h-[48px] w-[48px] -translate-y-1/2 items-center justify-center rounded-full bg-black text-white shadow-[0_12px_24px_rgba(0,0,0,0.18)]">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button className="absolute right-6 top-1/2 z-20 flex h-[48px] w-[48px] -translate-y-1/2 items-center justify-center rounded-full bg-black text-white shadow-[0_12px_24px_rgba(0,0,0,0.18)]">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
            </svg>
          </button>

          <div className="grid min-h-[598px] gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="px-16 py-16 lg:pl-[175px] lg:pr-0">
              <p className="text-[17px] font-bold text-black">
                Get up to 30% of on your first $150 purchase
              </p>
              <h1 className="mt-7 max-w-[560px] text-[62px] font-black leading-[1.06] tracking-[-0.05em] text-black">
                {hero?.title || 'Wrap Yourself'}
              </h1>
              <p className="mt-6 text-[17px] font-medium text-black/82">
                {hero?.description || 'Handcrafted designs & premium fabrics for a timeless look.'}
              </p>
              <div className="mt-8">
                <Link
                  to="/"
                  className="inline-flex items-center gap-4 rounded-full bg-[#0f8b86] px-5 py-4 text-[16px] font-extrabold text-white shadow-[0_14px_28px_rgba(15,139,134,0.22)]"
                >
                  <span>{hero?.primaryCta || 'Shop Now'}</span>
                  <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-white text-[#0f8b86]">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M9 7h8v8" />
                    </svg>
                  </span>
                </Link>
              </div>
            </div>

            <div className="relative min-h-[598px] overflow-hidden">
              <img
                src={hero?.image || heroBannerImage}
                alt="Fashion model in winter elegance hero banner"
                className="absolute inset-0 h-full w-full object-contain object-right-bottom"
              />
            </div>
          </div>

          <div className="absolute bottom-0 left-1/2 z-20 flex h-[60px] w-[332px] -translate-x-1/2 items-center justify-center rounded-t-[34px] bg-[#f7f8fb]">
            <div className="flex items-center gap-[14px]">
              <span className="h-[16px] w-[16px] rounded-full bg-[#d9dee5]" />
              <span className="h-[16px] w-[16px] rounded-full bg-[#d9dee5]" />
              <span className="h-[16px] w-[16px] rounded-full bg-[#d9dee5]" />
              <span className="h-[16px] w-[78px] rounded-full bg-[#0f8b86]" />
              <span className="h-[16px] w-[16px] rounded-full bg-[#d9dee5]" />
            </div>
          </div>
        </RevealOnScroll>

        <div className="grid gap-4 lg:grid-cols-2">
          {(hero?.spotlightCards || []).map((card, index) => (
            <RevealOnScroll
              key={`${card?.id || index}-promo`}
              className="grid min-h-[190px] grid-cols-[1fr_0.9fr] overflow-hidden rounded-[1.5rem] bg-white shadow-[0_16px_34px_rgba(36,54,46,0.08)] transition hover:-translate-y-1 hover:shadow-[0_22px_42px_rgba(36,54,46,0.1)]"
              direction="right"
              delay={index * 120}
            >
              <div className="p-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#ff7e88]">
                  {card?.eyebrow}
                </p>
                <h3 className="mt-3 text-2xl font-extrabold leading-tight text-[var(--color-heading)]">
                  {card?.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[var(--color-copy)]">
                  {card?.description || 'Curated beauty basics for everyday use.'}
                </p>
                <button className="mt-5 rounded-full bg-[var(--color-accent)] px-4 py-2 text-xs font-bold text-white">
                  {card?.ctaLabel || 'Shop Now'}
                </button>
              </div>
              <div style={{ backgroundColor: card?.background || '#fcebd7' }}>
                <img
                  src={card?.image || '/default-hero-banner.svg'}
                  alt={card?.title || 'Store promo'}
                  className="h-full w-full object-contain p-4"
                />
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <RevealOnScroll as="section" delay={40}>
        <HomeSectionTitle title="Shop By Category" action=" " />
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {(homepage.categoryRail || []).slice(0, 6).map((item, index) => (
            <RevealOnScroll
              key={`category-${item.id}-${index}`}
              className="text-center transition hover:-translate-y-1"
              delay={index * 70}
              direction="zoom"
            >
              <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-[#fdeff5] shadow-[0_8px_18px_rgba(36,54,46,0.06)] transition duration-300 hover:shadow-[0_14px_28px_rgba(36,54,46,0.1)]">
                <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
              </div>
              <p className="mt-3 text-sm font-bold text-[var(--color-heading)]">
                {item.title}
              </p>
            </RevealOnScroll>
          ))}
        </div>
      </RevealOnScroll>

      <ProductTabsSection
        title={flashDeal.title}
        tabs={flashDeal.tabs}
      >
        <ProductGrid products={flashDeal.products} sectionLabel="Top Offer" />
      </ProductTabsSection>

      <RevealOnScroll as="section" delay={70}>
        <HomeSectionTitle title={mostLoved.title} />
        <ProductGrid products={mostLoved.products} sectionLabel="Most Loved" />
      </RevealOnScroll>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { title: 'Your Daily Store.', copy: 'Reliable essentials for everyday routines.', bg: 'bg-[#9beb77]' },
          { title: 'Everyday Made Simple.', copy: 'Curated tools for effortless self care.', bg: 'bg-[#f9b0cb]' },
          { title: 'Your Cart. Your Way.', copy: 'Smart shopping with polished daily picks.', bg: 'bg-[#f4d7a5]' },
        ].map((promo, index) => (
          <RevealOnScroll
            as="article"
            key={promo.title}
            className="overflow-hidden rounded-[1.5rem] bg-white shadow-[0_14px_30px_rgba(36,54,46,0.07)] transition hover:-translate-y-1 hover:shadow-[0_22px_40px_rgba(36,54,46,0.1)]"
            delay={index * 100}
            direction="zoom"
          >
            <div className="h-52 bg-[#eef7f3]">
              <img src={productImage(featurePromos[index])} alt={promo.title} className="h-full w-full object-cover" />
            </div>
            <div className={`p-5 ${promo.bg}`}>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-heading)]">Daily care</p>
              <h3 className="mt-2 text-2xl font-extrabold text-[var(--color-heading)]">{promo.title}</h3>
              <p className="mt-2 text-sm text-[var(--color-heading)]/72">{promo.copy}</p>
            </div>
          </RevealOnScroll>
        ))}
      </section>

      <section className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {featureItems.map((item) => (
          <RevealOnScroll
            key={item}
            className="flex flex-col items-center justify-center rounded-[1.2rem] bg-white px-4 py-5 text-center shadow-[0_12px_24px_rgba(36,54,46,0.05)] transition hover:-translate-y-1 hover:shadow-[0_18px_34px_rgba(36,54,46,0.08)]"
            delay={60}
            direction="zoom"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-accent)]">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M5 12h14M12 5v14" />
              </svg>
            </div>
            <p className="mt-3 text-sm font-bold text-[var(--color-heading)]">{item}</p>
          </RevealOnScroll>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.95fr_1.25fr]">
        <RevealOnScroll as="article" className="overflow-hidden rounded-[1.6rem] bg-[#ffca93] shadow-[0_14px_34px_rgba(36,54,46,0.08)] transition hover:-translate-y-1 hover:shadow-[0_22px_42px_rgba(36,54,46,0.1)]" direction="left">
          <div className="h-72 bg-[#f7dcc7]">
            <img src={productImage(mostLoved.products[0])} alt={mostLoved.products[0]?.name} className="h-full w-full object-cover" />
          </div>
          <div className="p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-heading)]">Glow story</p>
            <h3 className="mt-2 text-3xl font-extrabold text-[var(--color-heading)]">Unveil Your Natural Glow</h3>
            <p className="mt-3 max-w-md text-sm leading-7 text-[var(--color-heading)]/72">
              Highlight premium skincare and complexion products with bold editorial storytelling.
            </p>
          </div>
        </RevealOnScroll>
        <RevealOnScroll as="article" className="overflow-hidden rounded-[1.6rem] bg-[#bdf0cc] shadow-[0_14px_34px_rgba(36,54,46,0.08)] transition hover:-translate-y-1 hover:shadow-[0_22px_42px_rgba(36,54,46,0.1)]" direction="right" delay={120}>
          <div className="grid h-full gap-6 p-6 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-heading)]">Premium glow</p>
              <h3 className="mt-2 text-3xl font-extrabold text-[var(--color-heading)]">Premium Luxury Glow</h3>
              <p className="mt-3 max-w-md text-sm leading-7 text-[var(--color-heading)]/72">
                Blend campaign banners with cleaner product storytelling for a polished,
                editorial storefront feel.
              </p>
            </div>
            <div className="overflow-hidden rounded-[1.4rem] bg-white/45">
              <img src={productImage(mostLoved.products[1])} alt={mostLoved.products[1]?.name} className="h-full w-full object-contain p-6" />
            </div>
          </div>
        </RevealOnScroll>
      </section>

      <RevealOnScroll as="section" className="elevated-section rounded-[1.8rem] bg-[#ffe25b] p-5 shadow-[0_18px_38px_rgba(36,54,46,0.07)]" delay={60}>
        <HomeSectionTitle title={newLaunch.title} action="View More Products" />
        <ProductGrid products={newLaunch.products} sectionLabel="New" />
      </RevealOnScroll>

      <ProductTabsSection
        title={allProducts.title}
        tabs={allProducts.tabs}
        activeTab={0}
      >
        <ProductGrid products={allProducts.products} sectionLabel="Products" />
      </ProductTabsSection>

      <RevealOnScroll as="section" className="elevated-section rounded-[1.8rem] bg-[#9ec5ff] p-5 shadow-[0_18px_38px_rgba(36,54,46,0.07)]" delay={80}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[1.45rem] font-extrabold text-[var(--color-heading)]">{limitedDeal.title}</h2>
          <button className="rounded-full bg-white px-4 py-2 text-xs font-bold text-[var(--color-accent)]">View Products</button>
        </div>
        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.35fr]">
          <article className="rounded-[1.4rem] bg-white p-5">
            <div className="overflow-hidden rounded-[1.2rem] bg-[#f7faf8]">
              <img src={productImage(limitedDeal.featured)} alt={limitedDeal.featured?.name} className="h-64 w-full object-contain p-8" />
            </div>
            <h3 className="mt-5 text-2xl font-extrabold text-[var(--color-heading)]">Stay Fit. Stay Healthy.</h3>
            <p className="mt-2 text-sm leading-7 text-[var(--color-copy)]">Promote best-value essentials with simplified offer messaging.</p>
            <button className="mt-4 rounded-full bg-[var(--color-accent)] px-4 py-2 text-sm font-bold text-white">Explore More</button>
          </article>
          <div className="grid gap-4">
            {[
              { title: 'Top Rate', products: limitedDeal.topRate },
              { title: 'Top Items', products: limitedDeal.topItems },
            ].map((group) => (
              <article key={group.title} className="rounded-[1.4rem] bg-white p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-extrabold uppercase tracking-[0.18em] text-[var(--color-copy-soft)]">{group.title}</h3>
                </div>
                <div className="space-y-3">
                  {group.products.map((product) => (
                    <div key={`${group.title}-${product.id}`} className="flex items-center gap-3 rounded-[1rem] bg-[#f5fbf8] p-3">
                      <div className="h-16 w-16 overflow-hidden rounded-xl bg-white">
                        <img src={productImage(product)} alt={product.name} className="h-full w-full object-contain p-2" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-1 text-sm font-bold text-[var(--color-heading)]">{product.name}</p>
                        <p className="mt-1 text-xs text-[var(--color-copy-soft)]">{product.price}</p>
                      </div>
                      <button className="rounded-full bg-[var(--color-accent)] px-3 py-2 text-xs font-bold text-white">Add</button>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </RevealOnScroll>

      <RevealOnScroll as="section" delay={50}>
        <HomeSectionTitle title="Shop By Brands" action=" " />
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {brands.map((brand, index) => (
            <RevealOnScroll
              key={`${brand}-${index}`}
              className="flex items-center justify-center rounded-[1.2rem] bg-white px-4 py-5 text-sm font-extrabold text-[var(--color-accent)] shadow-[0_10px_22px_rgba(36,54,46,0.04)] transition hover:-translate-y-1 hover:shadow-[0_16px_28px_rgba(36,54,46,0.08)]"
              delay={index * 45}
              direction="zoom"
            >
              {brand}
            </RevealOnScroll>
          ))}
        </div>
      </RevealOnScroll>

      <RevealOnScroll as="section" delay={60}>
        <HomeSectionTitle title="Category Favorites" action=" " />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { title: 'Gentle Face Essentials', subtitle: 'Skin Wellness', bg: 'bg-[#ffd85d]' },
            { title: 'Where Glow Meets Care', subtitle: 'Glow Ritual', bg: 'bg-[#9bb5ff]' },
            { title: 'Your Daily Skin Ritual', subtitle: 'Self Care', bg: 'bg-[#65d7c7]' },
            { title: 'Where Glow Meets Care', subtitle: 'Skin Wellness', bg: 'bg-[#8cb6ff]' },
          ].map((card, index) => (
            <RevealOnScroll
              as="article"
              key={card.title + index}
              className="overflow-hidden rounded-[1.5rem] bg-white shadow-[0_14px_30px_rgba(36,54,46,0.07)] transition hover:-translate-y-1 hover:shadow-[0_22px_40px_rgba(36,54,46,0.1)]"
              delay={index * 90}
              direction="zoom"
            >
              <div className="h-56 bg-[#eef7f3]">
                <img src={productImage(categoryFavorites[index % categoryFavorites.length])} alt={card.title} className="h-full w-full object-cover" />
              </div>
              <div className={`p-5 ${card.bg}`}>
                <h3 className="text-lg font-extrabold text-[var(--color-heading)]">{card.title}</h3>
                <p className="mt-1 text-sm text-[var(--color-heading)]/70">{card.subtitle}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </RevealOnScroll>

      <RevealOnScroll as="section" className="elevated-section rounded-[1.8rem] bg-[#b8efe7] p-5 shadow-[0_18px_38px_rgba(36,54,46,0.07)]" delay={60}>
        <HomeSectionTitle title={beautyCare.title} action="View More Products" />
        <ProductGrid products={beautyCare.products} sectionLabel="Beauty" />
      </RevealOnScroll>

      <RevealOnScroll as="section" delay={70}>
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-[1.45rem] font-extrabold text-[var(--color-heading)]">Latest Blog</h2>
          <button className="text-sm font-bold text-[var(--color-accent)]">View All</button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {latestBlog.map((product, index) => (
            <RevealOnScroll
              as="article"
              key={`blog-${product.id}-${index}`}
              className="overflow-hidden rounded-[1.3rem] border border-[#d9e7e0] bg-white shadow-[0_10px_22px_rgba(36,54,46,0.04)] transition hover:-translate-y-1 hover:shadow-[0_18px_32px_rgba(36,54,46,0.08)]"
              delay={index * 80}
              direction="zoom"
            >
              <div className="h-44 bg-[#eef7f3]">
                <img src={productImage(product)} alt={product.name} className="h-full w-full object-cover" />
              </div>
              <div className="p-4">
                <p className="text-[11px] font-semibold text-[var(--color-copy-soft)]">15 May, 2026 • 6 Comment</p>
                <h3 className="mt-3 line-clamp-2 text-base font-extrabold leading-7 text-[var(--color-heading)]">
                  The Future of Skincare Design
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--color-copy)]">
                  {product.name}
                </p>
                <button className="mt-4 rounded-full bg-[var(--color-accent)] px-4 py-2 text-xs font-bold text-white">
                  Read More
                </button>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </RevealOnScroll>

      <RevealOnScroll as="section" className="rounded-[2rem] bg-white px-6 py-10 text-center shadow-[0_12px_24px_rgba(36,54,46,0.04)]" delay={60} direction="zoom">
        <h2 className="text-2xl font-extrabold text-[var(--color-heading)]">Subscribe to our newsletter</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[var(--color-copy)]">
          Stay up to date with new releases, exclusive offers, and curated beauty content.
        </p>
        <div className="mx-auto mt-6 flex max-w-xl flex-col gap-3 sm:flex-row">
          <input
            type="email"
            placeholder="Enter your email address"
            className="h-12 flex-1 rounded-full border border-[var(--color-border)] bg-[var(--color-page)] px-5 text-sm outline-none focus:border-[var(--color-accent)]"
          />
          <button className="rounded-full bg-[var(--color-accent)] px-6 text-sm font-bold text-white">
            Subscribe
          </button>
        </div>
      </RevealOnScroll>
    </div>
  )
}

export default HomePage

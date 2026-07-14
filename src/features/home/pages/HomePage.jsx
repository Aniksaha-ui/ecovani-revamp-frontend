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
    <section className="space-y-9">
      <RevealOnScroll delay={40}>
        <div className="text-center">
          <h2 className="text-[28px] font-extrabold tracking-[-0.03em] text-[#14213d]">{title}</h2>
          <div className="mx-auto mt-7 flex max-w-[980px] flex-wrap items-center justify-center gap-3">
            {tabs.map((item, index) => (
              <button
                key={item}
                className={`rounded-full border px-5 py-3 text-[15px] font-semibold leading-none transition ${
                  index === activeTab
                    ? 'border-[#0f8b86] bg-[#0f8b86] text-white shadow-[0_10px_24px_rgba(15,139,134,0.18)]'
                    : 'border-[#d9e1ec] bg-white text-[#1d2433] hover:border-[#0f8b86] hover:text-[#0f8b86]'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </RevealOnScroll>
      {children}
    </section>
  )
}

function FeatureIcon({ type }) {
  const common = {
    className: 'h-7 w-7',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.8',
  }

  if (type === 'shipping') {
    return (
      <svg {...common}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h11v8H3zM14 10h3l3 3v2h-6z" />
        <circle cx="7.5" cy="17" r="1.5" />
        <circle cx="17.5" cy="17" r="1.5" />
      </svg>
    )
  }

  if (type === 'support') {
    return (
      <svg {...common}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 13v-1a8 8 0 1 1 16 0v1" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 13a2 2 0 0 0 2 2h1v-5H6a2 2 0 0 0-2 2Zm16 0a2 2 0 0 1-2 2h-1v-5h1a2 2 0 0 1 2 2Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19h1.5a2.5 2.5 0 0 0 2.5-2.5V15" />
      </svg>
    )
  }

  if (type === 'return') {
    return (
      <svg {...common}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M6 11h12M8 15h8" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 4h6l1 3H8l1-3Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 20h10a2 2 0 0 0 2-2V7H5v11a2 2 0 0 0 2 2Z" />
      </svg>
    )
  }

  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="8" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l2.4 1.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 15.5c.8.5 1.6.8 2.5.8 2.8 0 5-2.2 5-5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.5 8.5c-.7-.5-1.6-.8-2.5-.8-2.8 0-5 2.2-5 5" />
    </svg>
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
  const dailyDiscountProducts = flashDeal.products.slice(0, 6)
  const benefitCards = [
    {
      type: 'shipping',
      title: 'Free Shipping',
      description: 'Enjoy the Convenience of Free Shipping on Every Order',
    },
    {
      type: 'support',
      title: '24x7 Support',
      description: 'Round-the-Clock Assistance, Anytime You Need It',
    },
    {
      type: 'return',
      title: '30 Days Return',
      description: 'Your Satisfaction is Our Priority: Return Any Product Within 30 Days',
    },
    {
      type: 'payment',
      title: 'Secure Payment',
      description: 'Seamless Shopping Backed by Safe and Secure Payment Options',
    },
  ]

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

          <div className="grid min-h-[500px] lg:min-h-[598px] gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="px-6 py-12 sm:px-12 lg:pl-[175px] lg:pr-0">
              <p className="text-sm sm:text-[17px] font-bold text-black">
                Get up to 30% of on your first $150 purchase
              </p>
              <h1 className="mt-4 sm:mt-7 max-w-[560px] text-3xl sm:text-5xl lg:text-[62px] font-black leading-[1.06] tracking-[-0.05em] text-black">
                {hero?.title || 'Wrap Yourself'}
              </h1>
              <p className="mt-4 sm:mt-6 text-sm sm:text-[17px] font-medium text-black/82">
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

            <div className="relative h-[250px] sm:h-[400px] lg:h-full lg:min-h-[598px] overflow-hidden">
              <img
                src={hero?.image || heroBannerImage}
                alt="Fashion model in winter elegance hero banner"
                className="absolute inset-0 h-full w-full object-contain object-right-bottom"
              />
            </div>
          </div>

          <div className="absolute bottom-0 left-1/2 z-20 flex h-[60px] w-[90%] max-w-[332px] -translate-x-1/2 items-center justify-center rounded-t-[34px] bg-[#f7f8fb]">
            <div className="flex items-center gap-[14px]">
              <span className="h-[16px] w-[16px] rounded-full bg-[#d9dee5]" />
              <span className="h-[16px] w-[16px] rounded-full bg-[#d9dee5]" />
              <span className="h-[16px] w-[16px] rounded-full bg-[#d9dee5]" />
              <span className="h-[16px] w-[78px] rounded-full bg-[#0f8b86]" />
              <span className="h-[16px] w-[16px] rounded-full bg-[#d9dee5]" />
            </div>
          </div>
        </RevealOnScroll>

      </section>

      <section className="space-y-12 pt-2">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {benefitCards.map((item, index) => (
            <RevealOnScroll
              as="article"
              key={item.title}
              className="rounded-[18px] border border-[#d8e0ea] bg-white px-8 py-5 text-center shadow-none"
              delay={index * 70}
              direction="zoom"
            >
              <div className="mx-auto flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#fff1ba] text-[#1d2433]">
                <FeatureIcon type={item.type} />
              </div>
              <h3 className="mt-4 text-[18px] font-extrabold leading-none tracking-[-0.02em] text-[#1b2740]">
                {item.title}
              </h3>
              <p className="mx-auto mt-3 max-w-[280px] text-[15px] leading-[1.45] text-[#334766]">
                {item.description}
              </p>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll as="section" delay={50}>
          <div className="mb-8">
            <h2 className="text-[28px] font-extrabold tracking-[-0.03em] text-[#1b2740]">
              Daily Discount You'll Love
            </h2>
          </div>

          <ProductGrid
            products={dailyDiscountProducts}
            variant="compact"
            sectionLabel="Daily Discount"
          />
        </RevealOnScroll>
      </section>

      <section>
        <RevealOnScroll delay={40}>
          <HomeSectionTitle title="Shop By Category" action=" " />
        </RevealOnScroll>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {(homepage.categoryRail || []).slice(0, 6).map((item, index) => (
            <RevealOnScroll
              key={`category-${item.id}-${index}`}
              className="text-center transition hover:-translate-y-1"
              delay={index * 70}
              direction="zoom"
            >
              <Link
                to={`/categories/${item.id}/products`}
                state={{ categoryTitle: item.title }}
                className="block"
              >
                <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-[#fdeff5] shadow-[0_8px_18px_rgba(36,54,46,0.06)] transition duration-300 hover:shadow-[0_14px_28px_rgba(36,54,46,0.1)]">
                  <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                </div>
                <p className="mt-3 text-sm font-bold text-[var(--color-heading)]">
                  {item.title}
                </p>
              </Link>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <ProductTabsSection
        title={flashDeal.title}
        tabs={flashDeal.tabs}
      >
        <ProductGrid products={flashDeal.products} sectionLabel="Top Offer" />
      </ProductTabsSection>

      <section>
        <RevealOnScroll delay={40}>
          <HomeSectionTitle title={mostLoved.title} />
        </RevealOnScroll>
        <ProductGrid products={mostLoved.products} sectionLabel="Most Loved" />
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { title: 'Your Daily Store.', copy: 'Essentials, deals, and more.', bg: 'bg-[#9be86b]' },
          { title: 'Everyday Made Simple.', copy: 'Quick, easy, and effortless.', bg: 'bg-[#f5c7e6]' },
          { title: 'Your Cart. Your Way.', copy: 'All your favorites, in one click.', bg: 'bg-[#8fd8d7]' },
        ].map((promo, index) => (
          <RevealOnScroll
            as="article"
            key={promo.title}
            className="relative overflow-hidden rounded-[18px] bg-white shadow-none transition hover:-translate-y-0.5 hover:shadow-[0_18px_34px_rgba(36,54,46,0.09)]"
            delay={index * 100}
            direction="zoom"
          >
            <div className="h-[496px] bg-[#eef4f6]">
              <img
                src={productImage(featurePromos[index])}
                alt={promo.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className={`absolute inset-x-[30px] bottom-[28px] rounded-[18px] px-[18px] pb-[18px] pt-[12px] ${promo.bg}`}>
              <div className="inline-flex rounded-full bg-[#ffd65c] px-[18px] py-[8px] text-[14px] font-bold leading-none tracking-[-0.02em] text-[#1d2433]">
                Enjoy 20% savings
              </div>
              <h3 className="mt-[14px] text-[29px] font-extrabold leading-[1.08] tracking-[-0.04em] text-[#14213d]">
                {promo.title}
              </h3>
              <p className="mt-[10px] text-[17px] leading-[1.45] text-[#24344d]">
                {promo.copy}
              </p>
              <button className="mt-[18px] inline-flex items-center gap-[10px] rounded-full bg-[#0f8b86] px-[18px] py-[10px] text-[15px] font-bold text-white shadow-[0_8px_18px_rgba(15,139,134,0.18)]">
                <span>Shop Now</span>
                <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-white text-[#0f8b86]">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M9 7h8v8" />
                  </svg>
                </span>
              </button>
            </div>
          </RevealOnScroll>
        ))}
      </section>

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
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
            <div className="h-48 sm:h-auto overflow-hidden rounded-[1.4rem] bg-white/45">
              <img src={productImage(mostLoved.products[1])} alt={mostLoved.products[1]?.name} className="h-full w-full object-contain p-6" />
            </div>
          </div>
        </RevealOnScroll>
      </section>

      <section className="elevated-section rounded-[1.8rem] bg-[#ffe25b] p-5 shadow-[0_18px_38px_rgba(36,54,46,0.07)]">
        <RevealOnScroll delay={40}>
          <HomeSectionTitle title={newLaunch.title} action="View More Products" />
        </RevealOnScroll>
        <ProductGrid products={newLaunch.products} sectionLabel="New" />
      </section>

      <ProductTabsSection
        title={allProducts.title}
        tabs={allProducts.tabs}
        activeTab={0}
      >
        <ProductGrid products={allProducts.products.slice(0, 5)} variant="five-up" sectionLabel="Products" />
      </ProductTabsSection>

      <section className="elevated-section rounded-[1.8rem] bg-[#9ec5ff] p-5 shadow-[0_18px_38px_rgba(36,54,46,0.07)]">
        <RevealOnScroll delay={40}>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-[1.45rem] font-extrabold text-[var(--color-heading)]">{limitedDeal.title}</h2>
            <button className="rounded-full bg-white px-4 py-2 text-xs font-bold text-[var(--color-accent)]">View Products</button>
          </div>
        </RevealOnScroll>
        <div className="grid gap-4 lg:grid-cols-[0.95fr_1.35fr]">
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
      </section>

      <section>
        <RevealOnScroll delay={40}>
          <HomeSectionTitle title="Shop By Brands" action=" " />
        </RevealOnScroll>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
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
      </section>

      <section>
        <RevealOnScroll delay={40}>
          <HomeSectionTitle title="Category Favorites" action=" " />
        </RevealOnScroll>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-2 xl:grid-cols-4">
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
      </section>

      <section className="elevated-section rounded-[1.8rem] bg-[#b8efe7] p-5 shadow-[0_18px_38px_rgba(36,54,46,0.07)]">
        <RevealOnScroll delay={40}>
          <HomeSectionTitle title={beautyCare.title} action="View More Products" />
        </RevealOnScroll>
        <ProductGrid products={beautyCare.products} sectionLabel="Beauty" />
      </section>

      <section>
        <RevealOnScroll delay={40}>
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="text-[1.45rem] font-extrabold text-[var(--color-heading)]">Latest Blog</h2>
            <button className="text-sm font-bold text-[var(--color-accent)]">View All</button>
          </div>
        </RevealOnScroll>
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
      </section>

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
          <button className="h-12 rounded-full bg-[var(--color-accent)] px-6 text-sm font-bold text-white">
            Subscribe
          </button>
        </div>
      </RevealOnScroll>
    </div>
  )
}

export default HomePage

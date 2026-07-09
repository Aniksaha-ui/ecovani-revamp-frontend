function Footer() {
  return (
    <footer className="overflow-hidden rounded-t-[2rem] bg-[#0f5c58] text-white">
      <div className="mx-auto w-[80%] max-w-[1720px] px-0 py-12">
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-5">
          <div className="xl:col-span-2">
            <h2 className="text-3xl font-extrabold">Sellzy</h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-white/74">
              A modern beauty and wellness storefront with category-led discovery,
              curated promotions, and polished shopping flows.
            </p>
            <div className="mt-6 flex gap-3">
              <div className="rounded-xl bg-white/10 px-4 py-3 text-sm">App Store</div>
              <div className="rounded-xl bg-white/10 px-4 py-3 text-sm">Google Play</div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.22em] text-white/80">About</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/74">
              <li>Our Company</li>
              <li>Privacy Policy</li>
              <li>Terms & Conditions</li>
              <li>Contact Us</li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.22em] text-white/80">My Account</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/74">
              <li>Dashboard</li>
              <li>Order History</li>
              <li>Saved Products</li>
              <li>Address Book</li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.22em] text-white/80">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/74">
              <li>+88 01700 000000</li>
              <li>support@sellzy.store</li>
              <li>House 18, Road 10, Dhaka 1212</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/12 pt-5 text-sm text-white/65">
          Copyright 2026 Sellzy. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer

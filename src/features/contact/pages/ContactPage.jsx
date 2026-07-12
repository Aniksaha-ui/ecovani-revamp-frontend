import { contactPageContent } from '../constants/contactPageContent'

function ContactPage() {
  const { hero, contactMethods, officeHours, faqs } = contactPageContent

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#fff7d1_0%,#ffe7a3_45%,#ffd16b_100%)] px-6 py-10 shadow-[0_20px_42px_rgba(36,54,46,0.08)] sm:px-8 lg:px-12 lg:py-14">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#9a6a00]">{hero.eyebrow}</p>
        <div className="mt-4 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <h1 className="max-w-3xl text-3xl font-black tracking-[-0.05em] text-[#14213d] sm:text-4xl lg:text-5xl">
              {hero.title}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#4d5d56] sm:text-base">
              {hero.description}
            </p>
          </div>
          <div className="rounded-[1.6rem] border border-white/60 bg-white/70 p-6 shadow-[0_12px_24px_rgba(36,54,46,0.06)] backdrop-blur">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#9a6a00]">Support promise</p>
            <p className="mt-3 text-2xl font-extrabold tracking-[-0.04em] text-[#14213d]">Clear answers, quick follow-up.</p>
            <p className="mt-3 text-sm leading-7 text-[#4d5d56]">
              The details below are all const-driven, so phone numbers, email, hours, and FAQ copy can be updated from one place.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {contactMethods.map((item) => (
          <article
            key={item.title}
            className="rounded-[1.6rem] border border-[var(--color-border)] bg-white p-6 shadow-[0_14px_28px_rgba(24,35,30,0.05)]"
          >
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-copy-soft)]">{item.title}</p>
            <h2 className="mt-3 text-xl font-extrabold text-[var(--color-heading)]">{item.value}</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--color-copy)]">{item.description}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-[1.8rem] border border-[var(--color-border)] bg-[#14213d] p-6 text-white shadow-[0_18px_38px_rgba(20,33,61,0.16)] sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/65">Office hours</p>
          <div className="mt-5 space-y-4">
            {officeHours.map((item) => (
              <div key={item.day} className="flex items-center justify-between gap-4 rounded-[1.2rem] border border-white/10 bg-white/5 px-4 py-4">
                <span className="text-sm font-semibold text-white/80">{item.day}</span>
                <span className="text-sm font-extrabold text-white">{item.time}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[1.8rem] border border-[var(--color-border)] bg-white p-6 shadow-[0_14px_30px_rgba(24,35,30,0.06)] sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-copy-soft)]">FAQ</p>
          <div className="mt-5 space-y-4">
            {faqs.map((item) => (
              <div key={item.question} className="rounded-[1.2rem] border border-[var(--color-border)] bg-[var(--color-page)] px-5 py-4">
                <h3 className="text-base font-extrabold text-[var(--color-heading)]">{item.question}</h3>
                <p className="mt-2 text-sm leading-7 text-[var(--color-copy)]">{item.answer}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  )
}

export default ContactPage

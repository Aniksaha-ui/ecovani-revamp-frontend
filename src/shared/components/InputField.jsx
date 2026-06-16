function InputField({ label, type = 'text', placeholder }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-[var(--color-heading)]">
      <span>{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        className="min-h-12 rounded-2xl border border-white/85 bg-white/88 px-4 text-sm text-[var(--color-heading)] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] outline-none transition placeholder:text-[var(--color-copy-soft)] focus:border-[var(--color-accent)] focus:ring-4 focus:ring-orange-100"
      />
    </label>
  )
}

export default InputField

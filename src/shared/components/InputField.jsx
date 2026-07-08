function InputField({ label, type = 'text', placeholder }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-[var(--color-heading)]">
      <span className="text-[13px]">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        className="min-h-12 rounded-2xl border border-[var(--color-border)] bg-white px-4 text-sm text-[var(--color-heading)] outline-none transition placeholder:text-[var(--color-copy-soft)] focus:border-[var(--color-accent)] focus:bg-white focus:ring-4 focus:ring-[var(--color-accent)]/10"
      />
    </label>
  )
}

export default InputField

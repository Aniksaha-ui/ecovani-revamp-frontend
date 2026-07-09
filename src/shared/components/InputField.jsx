function InputField({
  label,
  type = 'text',
  placeholder,
  name,
  value,
  onChange,
  autoComplete,
  error = '',
  disabled = false,
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-[var(--color-heading)]">
      <span className="text-[13px]">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        disabled={disabled}
        className={`min-h-12 rounded-2xl border bg-white px-4 text-sm text-[var(--color-heading)] outline-none transition placeholder:text-[var(--color-copy-soft)] focus:bg-white focus:ring-4 ${
          error
            ? 'border-[#dc2626] focus:border-[#dc2626] focus:ring-[#dc2626]/10'
            : 'border-[var(--color-border)] focus:border-[var(--color-accent)] focus:ring-[var(--color-accent)]/10'
        } ${disabled ? 'cursor-not-allowed opacity-70' : ''}`}
      />
      {error ? <span className="text-[12px] font-medium text-[#b91c1c]">{error}</span> : null}
    </label>
  )
}

export default InputField

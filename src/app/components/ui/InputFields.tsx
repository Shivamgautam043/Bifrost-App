type InputFieldWithLabelProps = {
  name: string
  label?: string
  placeholder?: string
  className?: string
  disabled?: boolean
} & React.InputHTMLAttributes<HTMLInputElement>

export function InputFieldWithLabel({
  name,
  label,
  placeholder,
  className = "",
  disabled = false,
  ...rest
}: InputFieldWithLabelProps) {
  return (
    <div className="flex flex-col gap-1 min-w-md">
      {label && (
        <label htmlFor={name} className="text-sm font-medium">
          {label}
        </label>
      )}

      <input
        id={name}
        name={name}
        placeholder={placeholder}
        disabled={disabled}
        className={`border p-2 rounded ${className}`}
        {...rest}
      />
    </div>
  )
}

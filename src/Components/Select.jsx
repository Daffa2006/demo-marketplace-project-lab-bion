// components/Select.jsx
export default function Select({
  label,
  name,
  value,
  onChange,
  options,
  error,
  required = false,
  placeholder = "Select an option",
  ...props
}) {
  return (
    <div>
      <label htmlFor={name}>
        {label}
        {required && <span style={{ color: "red" }}> *</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${name}-error` : undefined}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <span id={`${name}-error`} className="error-message">
          {error}
        </span>
      )}
    </div>
  );
}

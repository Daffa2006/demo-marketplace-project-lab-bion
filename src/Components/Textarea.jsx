// components/Textarea.jsx
export default function Textarea({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  required = false,
  rows = 4,
  ...props
}) {
  return (
    <div>
      <label htmlFor={name}>
        {label}
        {required && <span style={{ color: "red" }}> *</span>}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${name}-error` : undefined}
        {...props}
      />
      {error && (
        <span id={`${name}-error`} className="error-message">
          {error}
        </span>
      )}
    </div>
  );
}

// components/Input.jsx
export default function Input({
  label,
  type = "text",
  name,
  value,
  onChange,
  error,
  placeholder,
  required = false,
  ...props
}) {
  return (
    <div>
      <label htmlFor={name}>
        {label}
        {required && <span style={{ color: "red" }}> *</span>}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
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

// components/Checkbox.jsx
export default function Checkbox({
  label,
  name,
  checked,
  onChange,
  error,
  ...props
}) {
  return (
    <div>
      <label htmlFor={name}>
        <input
          id={name}
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${name}-error` : undefined}
          {...props}
        />
        <span>{label}</span>
      </label>
      {error && (
        <span id={`${name}-error`} className="error-message">
          {error}
        </span>
      )}
    </div>
  );
}

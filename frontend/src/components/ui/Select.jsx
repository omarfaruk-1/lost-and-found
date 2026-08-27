export default function Select({ label, options, error, className = "", ...props }) {
  return (
    <label className={`field ${className}`}>
      {label && <span className="field-label">{label}</span>}
      <select className={`input ${error ? "input-error" : ""}`} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      {error && <span className="field-error">{error}</span>}
    </label>
  );
}
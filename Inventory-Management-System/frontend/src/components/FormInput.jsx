export default function FormInput({ label, type = "text", value, onChange, error, ...rest }) {
  return (
    <div className="form-group">
      {label && <label>{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={error ? "input-error" : ""}
        {...rest}
      />
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}
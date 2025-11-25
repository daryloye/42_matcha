type TextInputProps = {
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
};

export function TextInput({
  type,
  value,
  onChange,
  placeholder,
}: TextInputProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value.trim())}
      placeholder={placeholder}
      required
    />
  );
}

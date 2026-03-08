import { Dropdown, HStack } from 'rsuite';

export function SearchSortDropdown({
  label,
  options,
  value,
  onClick,
}: {
  label: string;
  options: any[];
  value: { value: number; label: string };
  onClick: (value: any) => void;
}) {
  return (
    <HStack>
      <p className='text-sm'>{label}</p>
      <Dropdown trigger='click' title={value.label}>
        {options.map((m) => (
          <Dropdown.Item key={m.value} onClick={() => onClick(m)}>
            {m.label}
          </Dropdown.Item>
        ))}
      </Dropdown>
    </HStack>
  );
}

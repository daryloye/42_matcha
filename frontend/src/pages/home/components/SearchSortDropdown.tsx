import ReactDropdownSelect from 'react-dropdown-select';
const DropdownSelect =
  (ReactDropdownSelect as any).default || ReactDropdownSelect;

const sortOptions = [
  { value: 0, label: 'None' },
  { value: 1, label: 'Low-to-high' },
  { value: -1, label: 'High-to-low' },
];

export function SearchSortDropdown({
  label,
  values,
  onChange,
}: {
  label: string;
  values: any[];
  onChange: (value: any) => void;
}) {
  return (
    <div className='flex-1'>
      <p className='text-sm'>{label}</p>
      <DropdownSelect
        options={sortOptions}
        values={values}
        onChange={onChange}
        searchable={false}
      />
    </div>
  );
}

import { RangeSlider } from 'rsuite';

export function SearchFilterRange({
  label,
  range,
  values,
  onChange,
}: {
  label: string;
  range: [number, number];
  values: [number, number];
  onChange: (value: [number, number]) => void;
}) {
  return (
    <div className='flex-1'>
      <p className='text-sm mb-3'>
        {label}{' '}
        <span className='font-bold'>
          {values[0]} - {values[1]}
        </span>
      </p>
      <RangeSlider
        min={range[0]}
        max={range[1]}
        value={values}
        onChange={onChange}
      />
    </div>
  );
}

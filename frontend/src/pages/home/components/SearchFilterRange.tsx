import RangeSliderModule from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
const RangeSlider = (RangeSliderModule as any).default || RangeSliderModule;

export function SearchFilterRange({
  label,
  range,
  values,
  onChange,
}: {
  label: string;
  range: number[];
  values: number[];
  onChange: (value: number[]) => void;
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
        onInput={onChange}
      />
    </div>
  );
}

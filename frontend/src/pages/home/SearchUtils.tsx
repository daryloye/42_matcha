import type { SearchFilters, SearchSort } from '../../utils/types';
import { RangeSlider } from 'rsuite';

export const baseFilters = {
  name: '',
  age: [0, 100] as [number, number],
  distance: [0, 100] as [number, number],
  fame: [0, 100] as [number, number],
  tags: [],
};

export const sortOptions = [
  { value: 0, label: 'None' },
  { value: 1, label: 'Low-to-high' },
  { value: -1, label: 'High-to-low' },
];

export const baseSorts = {
  age: 0,
  distance: 0,
  fame: 0,
  tags: 0,
};

export function getFilteredProfiles(profiles: any, filters: SearchFilters) {
  return profiles.filter(
    (p: any) => {
      const fullName = `${p.first_name} ${p.last_name}`.toLowerCase();
      const profileTags = (p.interests ?? [])
        .filter((t: any) => t != null && t !== '')
        .map((t: any) => String(t).toLowerCase());

      return (
        fullName.startsWith(filters.name.toLowerCase()) &&
        isInRange(Number(p.age ?? 0), filters.age) &&
        isInRange(Number(p.distance ?? 0), filters.distance) &&
        isInRange(Number(p.fame_rating ?? 0), filters.fame) &&
        filters.tags.every((tag) => profileTags.includes(tag.toLowerCase()))
      );
    },
  );
}

function isInRange(value: number, range: number[]) {
  return value >= range[0] && value <= range[1];
}

export function getSortedProfiles(profiles: any, sortBy: SearchSort) {
  return [...profiles].sort((a, b): number => {
    let r;

    r = doSort(sortBy.age, a.age, b.age);
    if (r !== 0) return r;

    r = doSort(sortBy.distance, a.distance, b.distance);
    if (r !== 0) return r;

    r = doSort(sortBy.fame, Number(a.fame_rating ?? 0), Number(b.fame_rating ?? 0));
    if (r !== 0) return r;

    r = doSort(
      sortBy.tags,
      (a.interests ?? []).filter((t: any) => t != null && t !== '').length,
      (b.interests ?? []).filter((t: any) => t != null && t !== '').length,
    );
    if (r !== 0) return r;

    return 0;
  });
}

function doSort(order: number, a: number, b: number) {
  if (order === 1) {
    const r = a - b;
    if (r !== 0) return r;
  }
  if (order === -1) {
    const r = b - a;
    if (r !== 0) return r;
  }
  return 0;
}

export function getRange<T extends Record<string, unknown>, K extends keyof T>(
  profiles: T[],
  field: K,
): [number, number] {
  const [min, max] = profiles.reduce(
    ([min, max], p) => [
      Math.min(min, Number(p[field])),
      Math.max(max, Number(p[field])),
    ],
    [Infinity, -Infinity],
  );

  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return [0, 0];
  }

  return [Math.round(min), Math.round(max)];
}

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

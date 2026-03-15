import profilePic from '../../assets/profilePic2.png';
import type { SearchFilters, SearchSort } from '../../utils/types';

export const profilesJson = [
  {
    id: 1,
    name: 'very-very-very-very-long-name',
    image: profilePic,
    age: 25,
    fame: 1,
    distance: 10.1,
    tags: [
      'car',
      'animals',
      'very-very-long-words',
      'dogs',
      'very-very-longer-longer- longer-words',
    ],
  },
  {
    id: 2,
    name: 'User2',
    image: profilePic,
    age: 30,
    fame: 2,
    distance: 15.0,
    tags: ['car', 'animals'],
  },
  {
    id: 3,
    name: 'User3',
    image: profilePic,
    age: 67,
    fame: 3,
    distance: 12.0,
    tags: ['car', 'animals'],
  },
  {
    id: 4,
    name: 'User1',
    image: profilePic,
    age: 25,
    fame: 1,
    distance: 10.1,
    tags: ['car', 'animals'],
  },
  {
    id: 5,
    name: 'User2',
    image: profilePic,
    age: 30,
    fame: 2,
    distance: 15.0,
    tags: ['car', 'animals'],
  },
  {
    id: 6,
    name: 'User3',
    image: profilePic,
    age: 67,
    fame: 3,
    distance: 12.0,
    tags: ['car', 'animals'],
  },
  {
    id: 7,
    name: 'User1',
    image: profilePic,
    age: 25,
    fame: 1,
    distance: 10.1,
    tags: ['car', 'animals'],
  },
  {
    id: 8,
    name: 'User2',
    image: profilePic,
    age: 30,
    fame: 2,
    distance: 15.0,
    tags: ['car', 'animals'],
  },
  {
    id: 9,
    name: 'User3',
    image: profilePic,
    age: 67,
    fame: 3,
    distance: 12.0,
    tags: ['car', 'animals'],
  },
  {
    id: 10,
    name: 'User3',
    image: profilePic,
    age: 67,
    fame: 3,
    distance: 12.0,
    tags: ['car', 'animals'],
  },
];

export const baseFilters = {
  name: '',
  age: getRange('age'),
  distance: getRange('distance'),
  fame: getRange('fame'),
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
    (p: any) =>
      p.name.toLowerCase().startsWith(filters.name.toLowerCase()) &&
      isInRange(p.age, filters.age) &&
      isInRange(p.distance, filters.distance) &&
      isInRange(p.fame, filters.fame) &&
      filters.tags.every((tag) => p.tags.includes(tag)),
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

    r = doSort(sortBy.fame, a.fame, b.fame);
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

function getRange<T extends keyof (typeof profilesJson)[number]>(
  field: T,
): [number, number] {
  const [min, max] = profilesJson.reduce(
    ([min, max], p) => [
      Math.min(min, Number(p[field])),
      Math.max(max, Number(p[field])),
    ],
    [Infinity, -Infinity],
  );
  return [Math.round(min), Math.round(max)];
}

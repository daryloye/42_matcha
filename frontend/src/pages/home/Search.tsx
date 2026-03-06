import { useState } from 'react';
import profilePic from '../../assets/profilePic2.png';
import { HomePageTemplate } from './HomePageTemplate';
import { SearchFilterRange } from './components/SearchFilterRange';
import { SearchSortDropdown } from './components/SearchSortDropdown';

const profilesJson = [
  {
    id: 1,
    name: 'User1',
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

const sortDefaultState = [{ value: 0, label: 'None' }];

const ageRangeLimit = (() => {
  const [min, max] = profilesJson.reduce(
    ([min, max], p) => [Math.min(min, p.age), Math.max(max, p.age)],
    [Infinity, -Infinity],
  );
  return [Math.round(min), Math.round(max)];
})();

const distanceRangeLimit = (() => {
  const [min, max] = profilesJson.reduce(
    ([min, max], p) => [Math.min(min, p.distance), Math.max(max, p.distance)],
    [Infinity, -Infinity],
  );
  return [Math.round(min), Math.round(max)];
})();

const fameRangeLimit = (() => {
  const [min, max] = profilesJson.reduce(
    ([min, max], p) => [Math.min(min, p.fame), Math.max(max, p.fame)],
    [Infinity, -Infinity],
  );
  return [Math.round(min), Math.round(max)];
})();

export default function Search() {
  return <HomePageTemplate page={<SearchPage />} />;
}

function SearchPage() {
  const [searchUser, setSearchUser] = useState('');

  const [sortByAge, setSortByAge] = useState(sortDefaultState);
  const [sortByDistance, setSortByDistance] = useState(sortDefaultState);
  const [sortByFame, setSortByFame] = useState(sortDefaultState);
  const [sortByTags, setSortByTags] = useState(sortDefaultState);

  const [ageRange, setAgeRange] = useState<number[]>(ageRangeLimit);
  const [distanceRange, setDistanceRange] =
    useState<number[]>(distanceRangeLimit);
  const [fameRange, setFameRange] = useState<number[]>(fameRangeLimit);

  const filtered = profilesJson.filter(
    (p) =>
      p.name.toLowerCase().startsWith(searchUser.toLowerCase()) &&
      p.age >= ageRange[0] &&
      p.age <= ageRange[1] &&
      p.distance >= distanceRange[0] &&
      p.distance <= distanceRange[1] &&
      p.fame >= fameRange[0] &&
      p.fame <= fameRange[1],
  );

  const sorted = [...filtered].sort((a, b): number => {
    if (sortByAge[0].value === 1) {
      const r = a.age - b.age;
      if (r !== 0) return r;
    }
    if (sortByAge[0].value === -1) {
      const r = b.age - a.age;
      if (r !== 0) return r;
    }

    if (sortByFame[0].value === 1) {
      const r = a.fame - b.fame;
      if (r !== 0) return r;
    }
    if (sortByFame[0].value === -1) {
      const r = b.fame - a.fame;
      if (r !== 0) return r;
    }

    if (sortByDistance[0].value === 1) {
      const r = a.distance - b.distance;
      if (r !== 0) return r;
    }
    if (sortByDistance[0].value === -1) {
      const r = b.distance - a.distance;
      if (r !== 0) return r;
    }

    return 0;
  });

  return (
    <div>
      <h1>Search</h1>

      <div className='flex flex-col mt-5 gap-3'>
        {/* Search Bar */}
        <input
          className='w-full'
          type='text'
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
          placeholder='Search for user'
          color='grey'
        />

        {/* Sort Options */}
        <div className='flex flex-row items-center gap-5 w-full'>
          <SearchSortDropdown
            label='Sort by age:'
            values={sortByAge}
            onChange={setSortByAge}
          />

          <SearchSortDropdown
            label='Sort by distance:'
            values={sortByDistance}
            onChange={setSortByDistance}
          />

          <SearchSortDropdown
            label='Sort by fame:'
            values={sortByFame}
            onChange={setSortByFame}
          />

          <SearchSortDropdown
            label='Sort by common tags:'
            values={sortByTags}
            onChange={setSortByTags}
          />
        </div>

        {/* Filter Options */}
        <div className='flex flex-row items-center gap-5 w-full'>
          <SearchFilterRange
            label='Age range:'
            range={ageRangeLimit}
            values={ageRange}
            onChange={setAgeRange}
          />

          <SearchFilterRange
            label='Distance range:'
            range={distanceRangeLimit}
            values={distanceRange}
            onChange={setDistanceRange}
          />

          <SearchFilterRange
            label='Fame range:'
            range={fameRangeLimit}
            values={fameRange}
            onChange={setFameRange}
          />
        </div>

        {/* Search Results */}
        <div className='mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
          {sorted.map((c) => (
            <button
              className='flex flex-col p-4 items-center rounded-3xl border-2 cursor-pointer transition-colors hover:bg-[var(--color-link-hover)]'
              type='button'
              key={c.id}
            >
              <img src={c.image} className='w-32 h-32 rounded-full' />
              <h2 className='text-lg font-bold py-2 truncate'>{c.name}</h2>
              <p className='italic'>Age: {c.age}</p>
              <p className='italic'>{c.fame}❤️</p>
              <p className='italic'>{c.distance} km away</p>
              <div className='flex flex-wrap gap-2 justify-center w-full min-w-0'>
                {c.tags.map((t) => (
                  <p className='truncate max-w-full min-w-0 bg-pink-200 rounded-sm border px-1'>
                    #{t}
                  </p>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

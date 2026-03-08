import CalendarIcon from '@rsuite/icons/Calendar';
import HeartIcon from '@rsuite/icons/Heart';
import LocationIcon from '@rsuite/icons/Location';
import TagIcon from '@rsuite/icons/Tag';
import { useState } from 'react';
import { Card, Input, Tag, TagGroup, TagInput, VStack } from 'rsuite';
import profilePic from '../../assets/profilePic2.png';
import { SearchFilterRange } from '../../components/search/SearchFilterRange';
import { SearchSortDropdown } from '../../components/search/SearchSortDropdown';
import { HomePageTemplate } from './HomePageTemplate';

const profilesJson = [
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

const sortOptions = [
  { value: 0, label: 'None' },
  { value: 1, label: 'Low-to-high' },
  { value: -1, label: 'High-to-low' },
];

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

export default function Search() {
  return <HomePageTemplate page={<SearchPage />} />;
}

function SearchPage() {
  const [searchUser, setSearchUser] = useState('');

  const [sortByAge, setSortByAge] = useState(sortOptions[0]);
  const [sortByDistance, setSortByDistance] = useState(sortOptions[0]);
  const [sortByFame, setSortByFame] = useState(sortOptions[0]);
  const [sortByTags, setSortByTags] = useState(sortOptions[0]);

  const [ageRange, setAgeRange] = useState(getRange('age'));
  const [distanceRange, setDistanceRange] = useState(getRange('distance'));
  const [fameRange, setFameRange] = useState(getRange('fame'));

  const [tagFilter, setTagFilter] = useState<string[]>([]);

  const filtered = profilesJson.filter(
    (p) =>
      p.name.toLowerCase().startsWith(searchUser.toLowerCase()) &&
      p.age >= ageRange[0] &&
      p.age <= ageRange[1] &&
      p.distance >= distanceRange[0] &&
      p.distance <= distanceRange[1] &&
      p.fame >= fameRange[0] &&
      p.fame <= fameRange[1] &&
      tagFilter.every((tag) => p.tags.includes(tag)),
  );

  const sorted = [...filtered].sort((a, b): number => {
    if (sortByAge.value === 1) {
      const r = a.age - b.age;
      if (r !== 0) return r;
    }
    if (sortByAge.value === -1) {
      const r = b.age - a.age;
      if (r !== 0) return r;
    }

    if (sortByFame.value === 1) {
      const r = a.fame - b.fame;
      if (r !== 0) return r;
    }
    if (sortByFame.value === -1) {
      const r = b.fame - a.fame;
      if (r !== 0) return r;
    }

    if (sortByDistance.value === 1) {
      const r = a.distance - b.distance;
      if (r !== 0) return r;
    }
    if (sortByDistance.value === -1) {
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
        <Input
          placeholder='Search for user'
          value={searchUser}
          onChange={setSearchUser}
        />

        {/* Sort Options */}
        <div className='grid grid-cols-4 gap-10'>
          <SearchSortDropdown
            label='Sort by age:'
            options={sortOptions}
            value={sortByAge}
            onClick={setSortByAge}
          />

          <SearchSortDropdown
            label='Sort by distance:'
            options={sortOptions}
            value={sortByDistance}
            onClick={setSortByDistance}
          />

          <SearchSortDropdown
            label='Sort by fame:'
            options={sortOptions}
            value={sortByFame}
            onClick={setSortByFame}
          />

          <SearchSortDropdown
            label='Sort by tags:'
            options={sortOptions}
            value={sortByTags}
            onClick={setSortByTags}
          />
        </div>

        {/* Filter Options */}
        <div className='grid grid-cols-4 gap-10'>
          <SearchFilterRange
            label='Age range:'
            range={getRange('age')}
            values={ageRange}
            onChange={setAgeRange}
          />

          <SearchFilterRange
            label='Distance range:'
            range={getRange('distance')}
            values={distanceRange}
            onChange={setDistanceRange}
          />

          <SearchFilterRange
            label='Fame range:'
            range={getRange('fame')}
            values={fameRange}
            onChange={setFameRange}
          />

          <VStack>
            <p className='text-sm'>Filter for tags:</p>
            <TagInput
              value={tagFilter}
              trigger={['Space', 'Comma', 'Enter']}
              placeholder='Add a space after each tag'
              onChange={(value) => setTagFilter([...value])}
            />
          </VStack>
        </div>

        {/* Search Results */}
        <div className='mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
          {sorted.map((c) => (
            <Card
              key={c.id}
              shaded
              as='button'
              className='text-left transition transform active:scale-95 hover:scale-[1.02]'
            >
              <img src={c.image} alt='Shadow' />
              <Card.Header>
                <p className='text-xl font-bold truncate'>{c.name}</p>
              </Card.Header>
              <Card.Body>
                <VStack>
                  <Tag color='violet' size='lg' className='opacity-70'>
                    <CalendarIcon /> Age: {c.age}
                  </Tag>
                  <Tag color='cyan' size='lg' className='opacity-80'>
                    <LocationIcon /> {c.distance} km away
                  </Tag>
                  <Tag color='red' size='lg'>
                    <HeartIcon /> {c.fame}
                  </Tag>
                </VStack>
              </Card.Body>
              <Card.Footer>
                <TagGroup className='flex flex-wrap w-full'>
                  {c.tags.map((t) => (
                    <Tag key={t} color='pink' className='tag-ellipsis'>
                      <TagIcon /> {t}
                    </Tag>
                  ))}
                </TagGroup>
              </Card.Footer>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

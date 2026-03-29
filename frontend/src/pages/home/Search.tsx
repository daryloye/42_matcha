import CalendarIcon from '@rsuite/icons/Calendar';
import HeartIcon from '@rsuite/icons/Heart';
import LocationIcon from '@rsuite/icons/Location';
import TagIcon from '@rsuite/icons/Tag';
import { useEffect, useState } from 'react';
import { MdPersonOutline } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Input,
  SelectPicker,
  Tag,
  TagGroup,
  TagInput,
  VStack,
  useToaster,
  Notification,
} from 'rsuite';
import type { SearchFilters, SearchSort } from '../../utils/types';
import { HomePageTemplate } from './HomePageTemplate';
import {
  baseFilters,
  baseSorts,
  getRange,
  getFilteredProfiles,
  getSortedProfiles,
  sortOptions,
  SearchFilterRange
} from './SearchUtils';
import { getToken } from '../../utils/token';
import { GetSearchProfiles } from '../../api/search';

export default function Search() {
  return <HomePageTemplate page={<SearchPage />} />;
}

function SearchPage() {
  const [filters, setFilters] = useState<SearchFilters>(baseFilters);
  const [sortBy, setSortBy] = useState<SearchSort>(baseSorts);
  const [profiles, setProfiles] = useState<any | null>(null);

  const navigate = useNavigate();
  const toaster = useToaster();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate('/');
      return;
    }

    async function fetchProfiles() {
      try {
        const res = await GetSearchProfiles(token!);
        setProfiles(res.profiles);

        setFilters((prev) => ({
          ...prev,
          age: getRange(res.profiles, 'age'),
          distance: getRange(res.profiles, 'distance'),
          fame: getRange(res.profiles, 'fame_rating'),
        }));
      } catch (err: any) {
        toaster.push(
          <Notification type='error' closable>
            {err.message}
          </Notification>,
        );
      }
    }

    fetchProfiles();
  }, []);

  if (!profiles) return null;

  const ageRange = getRange(profiles, 'age');
  const distanceRange = getRange(profiles, 'distance');
  const fameRange = getRange(profiles, 'fame_rating');

  const filtered = getFilteredProfiles(profiles, filters);
  const sorted = getSortedProfiles(filtered, sortBy);

  return (
    <div>
      <h1>Search</h1>

      <div className='flex flex-col mt-5 gap-4'>
        {/* Search Bar */}
        <Input
          placeholder='Search for user'
          value={filters.name}
          onChange={(value: string) => setFilters((prev) => ({ ...prev, name: value }))}
        />

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-4'>
          {/* Sort Options */}
          <SelectPicker
            label='Sort by age:'
            data={sortOptions}
            value={sortBy.age}
            onChange={(value: number) =>
              setSortBy((prev) => ({ ...prev, age: value! }))
            }
            cleanable={false}
            searchable={false}
          />

          <SelectPicker
            label='Sort by distance:'
            data={sortOptions}
            value={sortBy.distance}
            onChange={(value: number) =>
              setSortBy((prev) => ({ ...prev, distance: value! }))
            }
            cleanable={false}
            searchable={false}
          />

          <SelectPicker
            label='Sort by fame:'
            data={sortOptions}
            value={sortBy.fame}
            onChange={(value: number) =>
              setSortBy((prev) => ({ ...prev, fame: value! }))
            }
            cleanable={false}
            searchable={false}
          />

          <SelectPicker
            label='Sort by tags:'
            data={sortOptions}
            value={sortBy.tags}
            onChange={(value: number) =>
              setSortBy((prev) => ({ ...prev, tags: value! }))
            }
            cleanable={false}
            searchable={false}
          />

          {/* Filter Options */}
          <SearchFilterRange
            label='Age ranges:'
            range={ageRange}
            values={filters.age}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, age: value }))
            }
          />

          <SearchFilterRange
            label='Distance ranges:'
            range={distanceRange}
            values={filters.distance}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, distance: value }))
            }
          />

          <SearchFilterRange
            label='Fame ranges:'
            range={fameRange}
            values={filters.fame}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, fame: value }))
            }
          />

          <VStack>
            <p className='text-sm'>Filter for tags:</p>
            <TagInput
              value={filters.tags}
              trigger={['Space', 'Comma', 'Enter']}
              placeholder='Add a space after each tag'
              onChange={(value: string[]) =>
                setFilters((prev) => ({ ...prev, tags: [...value] }))
              }
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
              onClick={() => navigate(`/users/${c.id}`)}
              className='text-left transition transform active:scale-95 hover:scale-[1.02]'
            >
              <img src={c.profile_pic} alt='Shadow' className='w-full aspect-square object-cover'/>
              <Card.Header>
                <p className='text-xl font-bold truncate'>
                  {`${c.first_name} ${c.last_name}`}
                </p>
              </Card.Header>
              <Card.Body>
                <VStack>
                  <Tag color='green' size='lg' className='opacity-70'>
                    <MdPersonOutline className='inline' /> {c.gender}
                  </Tag>
                  <Tag color='violet' size='lg' className='opacity-70'>
                    <CalendarIcon /> {c.age} years old
                  </Tag>
                  <Tag color='cyan' size='lg' className='opacity-80'>
                    <LocationIcon /> {c.distance} km away
                  </Tag>
                  <Tag color='red' size='lg'>
                    <HeartIcon /> {c.fame_rating}
                  </Tag>
                </VStack>
              </Card.Body>
              <Card.Footer>
                <TagGroup className='flex flex-wrap w-full'>
                  {(c.interests ?? []).filter((t: any) => t).map((t: string) => (
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

import CalendarIcon from '@rsuite/icons/Calendar';
import HeartIcon from '@rsuite/icons/Heart';
import LocationIcon from '@rsuite/icons/Location';
import TagIcon from '@rsuite/icons/Tag';
import { useState } from 'react';
import {
  Card,
  Input,
  SelectPicker,
  Tag,
  TagGroup,
  TagInput,
  VStack,
} from 'rsuite';
import { SearchFilterRange } from '../../components/search/SearchFilterRange';
import type { SearchFilters, SearchSort } from '../../utils/types';
import { HomePageTemplate } from './HomePageTemplate';
import {
  baseFilters,
  baseSorts,
  getFilteredProfiles,
  getSortedProfiles,
  profilesJson,
  sortOptions,
} from './SearchUtils';

export default function Search() {
  return <HomePageTemplate page={<SearchPage />} />;
}

function SearchPage() {
  const [filters, setFilters] = useState<SearchFilters>(baseFilters);
  const [sortBy, setSortBy] = useState<SearchSort>(baseSorts);

  const filtered = getFilteredProfiles(profilesJson, filters);
  const sorted = getSortedProfiles(filtered, sortBy);

  return (
    <div>
      <h1>Search</h1>

      <div className='flex flex-col mt-5 gap-4'>
        {/* Search Bar */}
        <Input
          placeholder='Search for user'
          value={filters.name}
          onChange={(value) => setFilters((prev) => ({ ...prev, name: value }))}
        />

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-4'>
          {/* Sort Options */}

          <SelectPicker
            label='Sort by age:'
            data={sortOptions}
            value={sortBy.age}
            onChange={(value) =>
              setSortBy((prev) => ({ ...prev, age: value! }))
            }
            cleanable={false}
            searchable={false}
          />

          <SelectPicker
            label='Sort by distance:'
            data={sortOptions}
            value={sortBy.distance}
            onChange={(value) =>
              setSortBy((prev) => ({ ...prev, distance: value! }))
            }
            cleanable={false}
            searchable={false}
          />

          <SelectPicker
            label='Sort by fame:'
            data={sortOptions}
            value={sortBy.fame}
            onChange={(value) =>
              setSortBy((prev) => ({ ...prev, fame: value! }))
            }
            cleanable={false}
            searchable={false}
          />

          <SelectPicker
            label='Sort by tags:'
            data={sortOptions}
            value={sortBy.tags}
            onChange={(value) =>
              setSortBy((prev) => ({ ...prev, tags: value! }))
            }
            cleanable={false}
            searchable={false}
          />

          {/* Filter Options */}
          <SearchFilterRange
            label='Age ranges:'
            range={baseFilters.age}
            values={filters.age}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, age: value }))
            }
          />

          <SearchFilterRange
            label='Distance ranges:'
            range={baseFilters.distance}
            values={filters.distance}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, distance: value }))
            }
          />

          <SearchFilterRange
            label='Fame ranges:'
            range={baseFilters.fame}
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
              onChange={(value) =>
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
                  {c.tags.map((t: string) => (
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

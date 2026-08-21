import type { Marker as LeafletMarker } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from 'react-leaflet';
import CalendarIcon from '@rsuite/icons/Calendar';
import HeartIcon from '@rsuite/icons/Heart';
import LocationIcon from '@rsuite/icons/Location';
import TagIcon from '@rsuite/icons/Tag';
import StarIcon from '@rsuite/icons/Star';
import { useEffect, useRef, useState } from 'react';
import { MdPersonOutline } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  Input,
  Notification,
  SelectPicker,
  Tag,
  TagGroup,
  TagInput,
  VStack,
  useToaster,
} from 'rsuite';
import { GetSearchProfiles } from '../../api/search';
import type { Position, SearchFilters, SearchSort } from '../../utils/types';
import { getPictureSrc } from '../../utils/utils';
import { HomePageTemplate } from './HomePageTemplate';
import {
  SearchFilterRange,
  baseFilters,
  baseSorts,
  countMatchingInterestTags,
  getFilteredProfiles,
  getMatchaGrade,
  getRange,
  getSortedProfiles,
  sortOptions,
} from './SearchUtils';
import { GetFullProfile } from '../../api/profile';

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
    async function fetchProfiles() {
      try {
        // get user's profile for the interest tags
        const userProfile = await GetFullProfile();

        const res = await GetSearchProfiles();
        setProfiles(
          res.profiles.map((profile: any) => ({
            ...profile,
            matchingTags: countMatchingInterestTags(userProfile.profile.interests, profile.interests),
            matchaGrade: getMatchaGrade(
              countMatchingInterestTags(userProfile.profile.interests, profile.interests),
              profile.distance,
              profile.fame_rating
            ).toFixed(1)
          }))
        );

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

  // filter, then sort profiles
  const filtered = getFilteredProfiles(profiles, filters);
  const sorted = getSortedProfiles(filtered, sortBy);

  return (
    <div>
      <header>Search</header>

      <div className='flex flex-col mt-5 gap-4'>
        {/* Search Bar */}
        <Input
          placeholder='Search for user'
          value={filters.name}
          onChange={(value: string) =>
            setFilters((prev) => ({ ...prev, name: value }))
          }
        />

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-4'>
          {/* Sort Options */}
          <SelectPicker
            label='Sort by age:'
            data={sortOptions}
            value={sortBy.age}
            onChange={(value: number | null) =>
              setSortBy((prev) => ({ ...prev, age: value! }))
            }
            cleanable={false}
            searchable={false}
          />

          <SelectPicker
            label='Sort by distance:'
            data={sortOptions}
            value={sortBy.distance}
            onChange={(value: number | null) =>
              setSortBy((prev) => ({ ...prev, distance: value! }))
            }
            cleanable={false}
            searchable={false}
          />

          <SelectPicker
            label='Sort by fame:'
            data={sortOptions}
            value={sortBy.fame}
            onChange={(value: number | null) =>
              setSortBy((prev) => ({ ...prev, fame: value! }))
            }
            cleanable={false}
            searchable={false}
          />

          <SelectPicker
            label='Sort by tags:'
            data={sortOptions}
            value={sortBy.tags}
            onChange={(value: number | null) =>
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
              onChange={(value: readonly string[]) =>
                setFilters((prev) => ({ ...prev, tags: [...value] }))
              }
            />
          </VStack>
        </div>

        <p className='italic text-indigo-500'>* By default, profiles are sorted by Mactcha Grade {<StarIcon />} = (10 * matching tags + 5 * fame - 0.5 * distance)</p>

        <LocationMap profiles={sorted}/>

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
              <img
                src={
                  getPictureSrc(c.profile_pic) ??
                  import.meta.env.VITE_PLACEHOLDER_IMAGE
                }
                className='w-full aspect-square object-cover'
              />
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
                  <Tag color='yellow' size='lg'>
                    <StarIcon /> {c.matchaGrade}
                  </Tag>
                </VStack>
              </Card.Body>
              <Card.Footer>
                <TagGroup className='flex flex-wrap w-full'>
                  {(c.interests ?? [])
                    .filter((t: any) => t)
                    .map((t: string) => (
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

export function LocationMap({ profiles }: { profiles: any }) {
  return (
    <MapContainer
      center={[0, 0]}
      zoom={1}
      scrollWheelZoom={true}
      className='h-[300px] w-full'
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      {profiles.map((p: any) => (
        <LocationMarker
          key={p.id}
          position={{ lat: p.latitude, lng: p.longitude }}
          firstname={p.first_name}
          lastname={p.last_name}
          id={p.id}
        />
      ))}
    </MapContainer>
  );
}

function LocationMarker({
  position,
  firstname,
  lastname,
  id
}: {
  position: Position | null,
  firstname: string,
  lastname: string,
  id: string
}) {
  const markerRef = useRef<LeafletMarker | null>(null);
  const navigate = useNavigate();

  if (!position) return null;

  return (
    <Marker
      draggable={false}
      position={position}
      ref={markerRef}
    >
      <Popup>
        <div className='flex flex-col items-center text-center mt-0'>
          <p>{firstname} {lastname}
          <br />{position.lat}, {position.lng}</p>
          <Button onClick={() => navigate(`/users/${id}`)}>
            View Profile
          </Button>
        </div>
      </Popup>
    </Marker>
  );
}
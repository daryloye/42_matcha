import { useState } from 'react';
import profilePic from '../../assets/profilePic2.png';
import { HomePageTemplate } from '../../components/home/HomePageTemplate';
import styles from './Search.module.css';

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
      'very-very-longer-words',
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

export default function Search() {
  return <HomePageTemplate page={<SearchPage />} />;
}

function SearchPage() {
  const [searchUser, setSearchUser] = useState('');
  const filtered = profilesJson.filter((profile) =>
    profile.name.toLowerCase().startsWith(searchUser.toLowerCase()),
  );

  return (
    <div className='home-page-layout'>
      <h1>Search</h1>
      <div className={styles.searchContainer}>
        <input
          type='text'
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value.trim())}
          placeholder='Search for user'
          className={styles.searchUserInput}
        />

        {/* Search Results */}
        <div className={styles.searchResultsGrid}>
          {filtered.map((c) => (
            <button
              type='button'
              key={c.id}
              className={styles.searchResultsItem}
            >
              <img
                src={c.image}
                className={styles.searchResultsProfilePicture}
              />
              <h2>{c.name}</h2>
              <p>Age: {c.age}</p>
              <p>{c.fame}❤️</p>
              <p>{c.distance} km away</p>
              <div className={styles.tags}>
                {c.tags.map((t) => (
                  <p>#{t}</p>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

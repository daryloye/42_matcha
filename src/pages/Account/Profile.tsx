import { IonIcon } from '@ionic/react';
import { closeSharp } from 'ionicons/icons';
import { atom, useAtom } from 'jotai';
import { Link } from 'react-router-dom';
import profilePic from '../../assets/profilePic.jpg';
import './Profile.css';

const genderAtom = atom('Male');
const genderPreferenceAtom = atom('Male');
const biographyAtom = atom('');
const tagInputAtom = atom('');
const tagListAtom = atom<string[]>(['hello', 'world']);

export default function Profile() {
  const [biography, setBiography] = useAtom(biographyAtom);
  const [tagInput, setTagInput] = useAtom(tagInputAtom);
  const [tagList, setTagList] = useAtom(tagListAtom);

  return (
    <div className='page-wrapper-center' style={{ alignItems: 'baseline', marginTop: '5em' }}>
      <div id='profile-container'>
        <img src={profilePic} id='profile-picture' />

        <h1>Your Name</h1>

        <h1 className='profile-heading'>Gender:</h1>
        <SelectionButtons atom={genderAtom} />

        <h1 className='profile-heading'>Preference:</h1>
        <SelectionButtons atom={genderPreferenceAtom} />

        <h1 className='profile-heading'>Biography:</h1>
        <textarea
          id='profile-biography-text'
          rows={5}
          cols={50}
          wrap='soft'
          placeholder='Add biography...'
        >
        </textarea>

        <h1 className='profile-heading'>Interests (max 5):</h1>
        <TagButtons />
        <input
          type='text'
          value={tagInput}
          onChange={(event) => setTagInput(event.target.value.trim())}
          onKeyDown={(event) => {
            if (event.key == 'Enter' && tagInput !== '' && !tagList.includes(tagInput) && tagList.length < 5) {
              setTagList([...tagList, tagInput])
              setTagInput('');
            }
          }}
        />

        <Link to='/'>
          <button type='button'>Back to Home</button>
        </Link>
      </div>
    </div>
  )
}


function SelectionButtons({ atom }: { atom: any }) {
  const [selection, setSelection] = useAtom(atom);

  function SelectionButton({ text }: { text: string }) {
    return (
      <button
        type='button'
        className='profile-button'
        onClick={() => setSelection(text)}
        style={{ backgroundColor: selection === text ? 'purple' : 'orange' }}
      >
        {text}
      </button>
    )
  }

  return (
    <div id='profile-button-container'>
      <SelectionButton text='Male' />
      <SelectionButton text='Female' />
      <SelectionButton text='Both??' />
    </div>
  )
}

function TagButtons() {
  const [tagList, setTagList] = useAtom(tagListAtom);

  function TagButton({ text }: { text: string }) {
    return (
      <div className='profile-tag'>

        <p className='profile-tag-text'># {text}</p>

        <button
          type='button'
          className='profile-tag-button'
          onClick={() => {
            const newTagList = tagList.filter(item => item !== text);
            setTagList(newTagList);
          }}
        >

          <IonIcon
            icon={closeSharp}
            style={{ width: "20px", height: "20px", color: "black" }}
          />

        </button>
      </div>
    )
  }

  return (
    <div id='profile-tag-container'>
      {tagList.map((tag) => <TagButton key={tag} text={tag} />)}
    </div>
  )
}
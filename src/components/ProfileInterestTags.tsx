import { IonIcon } from '@ionic/react';
import { closeSharp } from 'ionicons/icons';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { tagListAtom } from '../utils/atoms';

function Tags() {
  const [tagList, setTagList] = useAtom(tagListAtom);

  const deleteTag = (tag: string) => {
    const newTagList = tagList.filter(item => item !== tag);
    setTagList(newTagList);
  }

  return (
    <div id='profile-tag-container'>
      {tagList.map((tag) => (
        <div key={tag} className='profile-tag'>

          <p className='profile-tag-text'>#{tag}</p>

          <button
            type='button'
            className='profile-tag-button'
            onClick={() => deleteTag(tag)}
          >

            <IonIcon
              icon={closeSharp}
              style={{ width: "20px", height: "20px", color: "black" }}
            />

          </button>
        </div>
      ))}
    </div>
  )
}

function TagInput() {
  const [tagList, setTagList] = useAtom(tagListAtom);
  const [tagInput, setTagInput] = useState('');

  const addTag = () => {
    if (tagInput !== '' && !tagList.includes(tagInput) && tagList.length < 5) {
      setTagList([...tagList, tagInput])
      setTagInput('');
    }
  }

  return (
    <div>
      <input
        type='text'
        value={tagInput}
        onChange={(event) => setTagInput(event.target.value.trim())}
        onKeyDown={(event) => {
          if (event.key == 'Enter')
            addTag();
        }}
        placeholder='Add tag...'
        className='profile-tag-input'
      />
      <button
        type='button'
        className='profile-util-button'
        onClick={() => addTag()}
      >
        Add
      </button>
    </div>
  )
}

export function ProfileInterestTags() {
  return (
    <div>
      <Tags />
      <TagInput />
    </div>
  )
}
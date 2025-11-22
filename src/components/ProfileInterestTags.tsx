import { IonIcon } from '@ionic/react';
import { closeSharp } from 'ionicons/icons';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { tagListAtom } from '../utils/atoms';

function useTags() {
  const [tagList, setTagList] = useAtom(tagListAtom);
  const [tagInput, setTagInput] = useState('');
  
  const addTag = (tagInput: string) => {
    if (tagInput !== '' && !tagList.includes(tagInput) && tagList.length < 5) {
      setTagList([...tagList, tagInput])
      setTagInput('');
    }
  }

  const deleteTag = (tag: string) => {
    const newTagList = tagList.filter(item => item !== tag);
    setTagList(newTagList);
  }
  
  return { tagList, tagInput, setTagInput, addTag, deleteTag };
}


function Tags() {
  const {tagList, deleteTag} = useTags();

  return (
    <div id='profile-tag-container'>
      {tagList.map((tag) => (
        <div className='profile-tag'>

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
  const {tagInput, setTagInput, addTag } = useTags();

  return (
    <input
      type='text'
      value={tagInput}
      onChange={(event) => setTagInput(event.target.value.trim())}
      onKeyDown={(event) => {
        if (event.key == 'Enter')
          addTag(tagInput);
      }}
    />
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
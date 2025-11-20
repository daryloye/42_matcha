import { atom, useAtom } from 'jotai';
import { Link } from 'react-router-dom';
import profilePic from '../../assets/profilePic.jpg';
import './Profile.css';

const genderAtom = atom('Male');
const genderPreferenceAtom = atom('Male');
const biographyAtom = atom('');

export default function Profile() {
  const [biography, setBiography] = useAtom(biographyAtom);

  return (
    <div className='page-wrapper-center' style={{alignItems: 'baseline', marginTop: '5em'}}>
      <div className='profile-container'>
        <img src={profilePic} className='profile-picture' />
        <h1>Your Name</h1>



        <h1 className='profile-heading'>Gender:</h1>
        <SelectionButtons atom={genderAtom} />

        <h1 className='profile-heading'>Preference:</h1>
        <SelectionButtons atom={genderPreferenceAtom} />

        <h1 className='profile-heading'>Biography:</h1>
        <textarea
          className='profile-biography-text'
          rows={5}
          cols={50}
          wrap='soft'
        >
        </textarea>

        <h1 className='profile-heading'>Tags:</h1>


        {/* <input
        type='text'
        id='biography'
        value={biography}
        onChange={(event) => setBiography(event.target.value.trim())}
        rows='10'
      /> */}

        <Link to='/'>
        <button type='button'>Back to Home</button>
      </Link>
      </div>
    </div>
  )
}


function SelectionButtons({ atom }: { atom: any }) {
  const [selection, setSelection] = useAtom(atom);

  function Button({text}: {text: string}) {
    return (
      <button 
        type='button'
        className='profile-button'
        onClick={() => setSelection(text)}
        style={{backgroundColor: selection === text ? 'purple' : 'orange'}}
      >
        {text}
      </button>
    )
  }

  return (
      <div className='profile-button-container'>
        <Button text='Male' />
        <Button text='Female' />
        <Button text='Both??' />
      </div>
  )
}
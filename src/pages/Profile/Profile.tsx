import { useState } from 'react';
import profilePic from '../../assets/profilePic.jpg';
import './Profile.css';

export default function Profile() {
  return (
    <div>
      <img src={profilePic} className='profile-picture'/>
      <h1>Your Name</h1>
      
      <GenderButtons />
    </div>
  )
}


function GenderButtons() {
  const [gender, setGender] = useState('Male');

  function Button({text}: {text: string}) {
    return (
      <button 
        className='profile-button'
        onClick={() => setGender(text)}
        style={{backgroundColor: gender === text ? 'purple' : 'orange'}}
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
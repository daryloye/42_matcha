import { ProfileInterestTags } from '../../components/ProfileInterestTags';
import { ProfileLocation } from '../../components/ProfileLocation';
import { ProfileSelectionButtons } from '../../components/ProfileSelectionButtons';
import { ProfileUploadPictures } from '../../components/ProfileUploadPictures';
import { genderAtom, genderPreferenceAtom } from '../../utils/atoms';
import { HomePageTemplate } from './HomePageTemplate';
import './Profile.css';

export default function Profile() {
  return <HomePageTemplate page={<ProfilePage />} />;
}

function ProfilePage() {
  return (
    <div className='home-page-container'>
      <h1>Profile</h1>

      <div className='profile'>
        <h2>Profile Picture</h2>

        <h2>Fame</h2>

        <div className='row' style={{ gap: '10%' }}>
          <div>
            <h2>First name</h2>
            <input style={{ width: '100%' }} />
          </div>

          <div>
            <h2>Last name</h2>
            <input style={{ width: '100%' }} />
          </div>
        </div>

        <h2>Email</h2>
        <input style={{ width: '100%' }} />

        <h2>Gender</h2>
        <ProfileSelectionButtons
          atom={genderAtom}
          options={['Male', 'Female']}
        />

        <h2>Preference</h2>
        <ProfileSelectionButtons
          atom={genderPreferenceAtom}
          options={['Male', 'Female', 'Any']}
        />

        <h2>Biography</h2>
        <textarea
          className='profile-text-input'
          rows={5}
          wrap='soft'
          style={{ width: '100%' }}
          placeholder='Add biography...'
        ></textarea>

        <h2>Interests (max 5)</h2>
        <ProfileInterestTags />

        <h2>Pictures</h2>
        <ProfileUploadPictures />

        <h2>Location</h2>
        <ProfileLocation />
      </div>
      <button type='button'>Update Profile</button>
    </div>
  );
}

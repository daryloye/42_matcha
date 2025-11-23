import { ProfileInterestTags } from '../../components/ProfileInterestTags';
import { ProfileLocation } from '../../components/ProfileLocation';
import { ProfileSelectionButtons } from '../../components/ProfileSelectionButtons';
import { ProfileUploadPictures } from '../../components/ProfileUploadPictures';
import { genderAtom, genderPreferenceAtom } from '../../utils/atoms';
import { HomePageTemplate } from './HomePageTemplate';

export default function Profile() {
  return <HomePageTemplate page={<ProfilePage />} />;
}

function ProfilePage() {
  return (
    <div className='home-page-container profile'>
      <h1>Profile</h1>

      <h2>Gender:</h2>
      <ProfileSelectionButtons atom={genderAtom} options={['Male', 'Female']} />

      <h2>Preference:</h2>
      <ProfileSelectionButtons
        atom={genderPreferenceAtom}
        options={['Male', 'Female', 'Any']}
      />

      <h2>Biography:</h2>
      <textarea
        id='profile-biography-text'
        rows={5}
        cols={50}
        wrap='soft'
        placeholder='Add biography...'
      ></textarea>

      <h2>Interests (max 5, press Enter to add):</h2>
      <ProfileInterestTags />

      <h2>Profile Picture:</h2>

      <h2>Pictures:</h2>
      <ProfileUploadPictures />

      <h2>Location:</h2>
      <ProfileLocation />
    </div>
  );
}

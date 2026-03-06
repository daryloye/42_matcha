import { toast } from 'react-toastify';
import { ProfileInterestTags } from '../../components/profile/ProfileInterestTags';
import { ProfileLocation } from '../../components/profile/ProfileLocation';
import { ProfileSelectionButtons } from '../../components/profile/ProfileSelectionButtons';
import { ProfileUploadPictures } from '../../components/profile/ProfileUploadPictures';
import { genderAtom, genderPreferenceAtom } from '../../utils/atoms';
import { HomePageTemplate } from './HomePageTemplate';
import styles from './Profile.module.css';

export default function Profile() {
  return <HomePageTemplate page={<ProfilePage />} />;
}

function ProfilePage() {
  const handleSubmit = () => {
    toast.success('Profile updated');
  };

  return (
    <div>
      <h1>Profile</h1>

      <div className={styles.profile}>
        <form>
          <h2>Profile Picture</h2>

          <h2>Fame</h2>

          <div className={styles.profileGrid}>
            <div>
              <h2>First name</h2>
              <input className={styles.profileInput} />
            </div>

            <div>
              <h2>Last name</h2>
              <input className={styles.profileInput} />
            </div>

            <div>
              <h2>Email</h2>
              <input className={styles.profileInput} />
            </div>
          </div>

          <div className={styles.profileGrid}>
            <div>
              <h2>Date of birth</h2>
              <input type='date' className={styles.profileInput} />
            </div>

            <div>
              <h2>Gender</h2>
              <ProfileSelectionButtons
                atom={genderAtom}
                options={['Male', 'Female']}
              />
            </div>

            <div>
              <h2>Preference</h2>
              <ProfileSelectionButtons
                atom={genderPreferenceAtom}
                options={['Male', 'Female', 'Any']}
              />
            </div>
          </div>

          <h2>Biography</h2>
          <textarea
            className={styles.profileTextArea}
            rows={5}
            wrap='soft'
            placeholder='Add biography...'
          ></textarea>

          <h2>Interests (max 5)</h2>
          <ProfileInterestTags />

          <h2>Pictures</h2>
          <ProfileUploadPictures />

          <h2>Location</h2>
          <ProfileLocation />

          <button
            type='button'
            className='submit-button'
            onClick={handleSubmit}
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
}

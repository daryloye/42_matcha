import type { FormEvent } from 'react';
import { ActionButton } from '../../components/ActionButton';
import { HomePageTemplate } from '../../components/home/HomePageTemplate';
import { ProfileInterestTags } from '../../components/profile/ProfileInterestTags';
import { ProfileLocation } from '../../components/profile/ProfileLocation';
import { ProfileSelectionButtons } from '../../components/profile/ProfileSelectionButtons';
import { ProfileUploadPictures } from '../../components/profile/ProfileUploadPictures';
import { genderAtom, genderPreferenceAtom } from '../../utils/atoms';
import styles from './Profile.module.css';

export default function Profile() {
  return <HomePageTemplate page={<ProfilePage />} />;
}

function ProfilePage() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div className='home-page-layout'>
      <h1>Profile</h1>

      <div className={styles.profile}>
        <form onSubmit={handleSubmit}>
          <h2>Profile Picture</h2>

          <h2>Fame</h2>

          <div className={styles.profileRow}>
            <div className={styles.profileInputFull}>
              <h2>First name</h2>
              <input className={styles.profileInputFull} />
            </div>

            <div className={styles.profileInputFull}>
              <h2>Last name</h2>
              <input className={styles.profileInputFull} />
            </div>
          </div>

          <h2>Email</h2>
          <input className={styles.profileInputFull} />

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

          <ActionButton type='submit' text='Update Profile' />
        </form>
      </div>
    </div>
  );
}

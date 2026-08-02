import { useEffect, useState } from 'react';
import {
  Button,
  DatePicker,
  Form,
  Notification,
  SelectPicker,
  TagInput,
  Textarea,
  Uploader,
  useToaster,
  type FileType,
} from 'rsuite';
import { DeletePicture, DeleteProfilePic, GetFullProfile, GetPictures, GetProfilePic, UpdateProfile } from '../../api/profile';
import { ProfileLocation } from '../../components/profile/ProfileLocation';
import type { PictureData, ProfileForm } from '../../utils/types';
import { HomePageTemplate } from './HomePageTemplate';
import { genderData, model, preferenceData } from './ProfileUtils';
import { useSearchParams } from 'react-router-dom';
import { getPictureSrc } from '../../utils/utils';


export default function Profile() {
  return (
    <HomePageTemplate
      page={({ refreshBasicProfile }) => (
        <ProfilePage refreshBasicProfile={refreshBasicProfile} />
      )}
    />
  );
}

function ProfilePage({refreshBasicProfile}: { refreshBasicProfile: () => Promise<void> }) {
  const [loading, setLoading] = useState(false);
  const [formValue, setFormValue] = useState<ProfileForm | null>(null);
  const [profilePic, setProfilePic] = useState<FileType[] | null>(null);
  const [pictures, setPictures] = useState<FileType[] | null>(null);
  const [position, setPosition] = useState(null);

  const toaster = useToaster();
  
  const fetchProfile = async () => {
    try {
      const res = await GetFullProfile();
      setFormValue({
        firstname: res.profile.first_name,
        lastname: res.profile.last_name,
        email: res.profile.email,
        dateOfBirth: new Date(res.profile.date_of_birth),
        gender: res.profile.gender,
        preference: res.profile.sexual_preference,
        biography: res.profile.biography,
        interests: res.profile.interests,
      });

      const profile_pic = res.profile.profile_picture;
      if (profile_pic?.length > 0) {
        setProfilePic([{
          fileKey: profile_pic[0].id,
          name: 'profilepic',
          url: getPictureSrc(profile_pic[0].image_url),
          status: 'finished' as const,
        }]);
      }
      
      const pictures = res.profile.pictures;
      if (pictures?.length > 0) {
        setPictures(pictures.map((p: PictureData) => ({
          fileKey: p.id,
          name: 'picture',
          url: getPictureSrc(p.image_url),
          status: 'finished' as const,
        })))
      }
    } catch (err: any) {
      toaster.push(
        <Notification type='error' closable>
          {err.message}
        </Notification>,
      );
    }
  }

  const fetchProfilePic = async () => {
    try {
      const res = await GetProfilePic();
      const profile_pic = res.picture;
      if (profile_pic) {
        setProfilePic([{
          fileKey: profile_pic.id,
          name: 'profilepic',
          url: getPictureSrc(profile_pic.image_url),
          status: 'finished' as const
        }]);
      }
    } catch (err: any) {
      toaster.push(
        <Notification type='error' closable>
          {err.message}
        </Notification>,
      );
    }
  }

  const fetchPictures = async () => {
    try {
      const res = await GetPictures();
      const pictures = res.pictures;
      if (pictures?.length > 0) {
        setPictures(pictures.map((p: PictureData) => ({
          fileKey: p.id,
          name: 'picture',
          url: getPictureSrc(p.image_url),
          status: 'finished' as const,
        })))
      }
    } catch (err: any) {
      toaster.push(
        <Notification type='error' closable>
          {err.message}
        </Notification>,
      );
    }
  }

  const handleChange = (value: any) => {
    setFormValue({
      firstname: value.firstname.trim(),
      lastname: value.lastname.trim(),
      email: value.email.trim(),
      dateOfBirth: value.dateOfBirth,
      gender: value.gender,
      preference: value.preference,
      biography: value.biography,
      interests: value.interests,
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await UpdateProfile({
        first_name: formValue?.firstname,
        last_name: formValue?.lastname,
        email: formValue?.email,
        date_of_birth: formValue?.dateOfBirth,
        gender: formValue?.gender,
        sexual_preference: formValue?.preference,
        biography: formValue?.biography,
        interests: formValue?.interests,
      });

      toaster.push(
        <Notification type='success' closable>
          Profile updated
        </Notification>,
      );
    } catch (err: any) {
      toaster.push(
        <Notification type='error' closable>
          {err.message}
        </Notification>,
      );
    } finally {
      setLoading(false);
    }
  };

  
  const [searchParams] = useSearchParams();
  useEffect(() => {
    fetchProfile();
    
    if (searchParams.get("reason") === 'profile_incomplete') {
      toaster.push(
        <Notification type='error' closable>
          Complete your profile to continue
        </Notification>
      );
    }
  }, []);
  
  if (!formValue) return null;

  return (
    <div>
      <h1>Profile</h1>

      <Form
        fluid
        formValue={formValue}
        model={model}
        onChange={handleChange}
        onSubmit={async () => {
          await handleSubmit();
          await refreshBasicProfile();
        }}
        className='flex pt-6'
      >
        <Form.Stack spacing={10}>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-4'>
            <Form.Group>
              <p className='text-lg font-bold'>First Name</p>
              <Form.Control name='firstname' placeholder='First name' />
            </Form.Group>

            <Form.Group>
              <p className='text-lg font-bold'>Last Name</p>
              <Form.Control name='lastname' placeholder='Last name' />
            </Form.Group>

            <Form.Group>
              <p className='text-lg font-bold'>Email</p>
              <Form.Control name='email' placeholder='Email' />
            </Form.Group>

            <Form.Group>
              <p className='text-lg font-bold'>Date of Birth</p>
              <Form.Control
                name='dateOfBirth'
                placeholder='Date of Birth'
                accepter={DatePicker}
              />
            </Form.Group>

            <Form.Group>
              <p className='text-lg font-bold'>Gender</p>
              <Form.Control
                name='gender'
                accepter={SelectPicker}
                data={genderData}
                searchable={false}
                cleanable={false}
              />
            </Form.Group>

            <Form.Group>
              <p className='text-lg font-bold'>Preference</p>
              <Form.Control
                name='preference'
                accepter={SelectPicker}
                data={preferenceData}
                searchable={false}
                cleanable={false}
              />
            </Form.Group>

            <Form.Group>
              <p className='text-lg font-bold'>Biography</p>
              <Form.Control
                name='biography'
                accepter={Textarea}
                rows={5}
                maxLength={255}
              />
            </Form.Group>

            <Form.Group>
              <p className='text-lg font-bold'>Interests</p>
              <Form.Control
                name='interests'
                accepter={TagInput}
                trigger={['Space', 'Comma', 'Enter']}
                placeholder='Add a space after each tag'
              />
            </Form.Group>

            <Form.Group>
              <p className='text-lg font-bold'>Profile Picture (required)</p>
              <Uploader
                listType='picture'
                fileList={profilePic ?? undefined}
                action={`${import.meta.env.VITE_API_URL}/api/profile/profilepic`}
                name='picture'
                withCredentials
                accept={import.meta.env.VITE_ALLOWED_FILE_TYPES}
                onRemove={async () => {
                  await DeleteProfilePic();
                  await fetchProfilePic();
                  await refreshBasicProfile();
                }}
                onSuccess={async () => {
                  await fetchProfilePic();
                  await refreshBasicProfile();
                  toaster.push(
                    <Notification type='success'>
                      Picture uploaded
                    </Notification>,
                  );
                }}
                onError={(err) => {
                  toaster.push(
                    <Notification type='error' closable>
                      {err.response.message || 'File upload failed'}
                    </Notification>,
                  );
                }}
              >
              </Uploader>
            </Form.Group>

            <Form.Group>
              <p className='text-lg font-bold'>Pictures (optional, max 4)</p>
              <Uploader
                listType='picture'
                fileList={pictures ?? undefined}
                action={`${import.meta.env.VITE_API_URL}/api/profile/pictures`}
                name='picture'
                withCredentials
                accept={import.meta.env.VITE_ALLOWED_FILE_TYPES}
                onRemove={async (file) => {
                  if (!file.fileKey) return;
                  await DeletePicture(String(file.fileKey));
                  await fetchPictures();
                }}
                onSuccess={async () => {
                  await fetchPictures();
                  toaster.push(
                    <Notification type='success'>
                      Picture uploaded
                    </Notification>,
                  );
                }}
                onError={(err) => {
                  toaster.push(
                    <Notification type='error' closable>
                      {err.response.message || 'File upload failed'}
                    </Notification>,
                  );
                }}
              >
              </Uploader>
            </Form.Group>
          </div>

          <p className='text-lg font-bold'>Location</p>
          <ProfileLocation position={position} setPosition={setPosition} />

          <Form.Group className='my-4'>
            <Button type='submit' appearance='primary' loading={loading} block>
              Update Profile
            </Button>
          </Form.Group>
        </Form.Stack>
      </Form>
    </div>
  );
}

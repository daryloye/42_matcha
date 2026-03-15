import { useEffect, useState } from 'react';
import { RxAvatar, RxCamera } from 'react-icons/rx';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  DatePicker,
  Form,
  Loader,
  Notification,
  SelectPicker,
  TagInput,
  Textarea,
  Uploader,
  useToaster,
} from 'rsuite';
import { GetFullProfile, UpdateProfile } from '../../api/profile';
import { ProfileLocation } from '../../components/profile/ProfileLocation';
import { getToken } from '../../utils/token';
import type { ProfileForm } from '../../utils/types';
import { HomePageTemplate } from './HomePageTemplate';
import { genderData, model, preferenceData } from './ProfileUtils';

export default function Profile() {
  return <HomePageTemplate page={<ProfilePage />} />;
}

function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const [formValue, setFormValue] = useState<ProfileForm | null>(null);

  const [uploading, setUploading] = useState(false);
  const [fileInfo, setFileInfo] = useState<any>(null);
  const [position, setPosition] = useState(null);

  const toaster = useToaster();
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate('/');
      return;
    }

    async function fetchProfile() {
      try {
        const res = await GetFullProfile(token!);
        setFormValue({
          firstname: res.profile.first_name,
          lastname: res.profile.last_name,
          email: res.profile.email,
          dateOfBirth: new Date(res.profile.date_of_birth),
          gender: res.profile.gender,
          preference: res.profile.sexual_preference,
          biography: res.profile.biography,
          interests: res.profile.interests,
          pictures: res.profile.pictures,
        });
      } catch (err: any) {
        toaster.push(
          <Notification type='error' closable>
            {err.message}
          </Notification>,
        );
        navigate('/');
      }
    }

    fetchProfile();
  }, []);

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
      pictures: value.pictures,
    });
  };

  const handleSubmit = async () => {
    setLoading(true);

    const token = getToken();
    if (!token) {
      navigate('/');
      return;
    }

    try {
      await UpdateProfile(token, {
        firstname: formValue?.firstname,
        lastname: formValue?.lastname,
        email: formValue?.email,
        date_of_birth: formValue?.dateOfBirth,
        gender: formValue?.gender,
        sexual_preference: formValue?.preference,
        biography: formValue?.biography,
        interests: formValue?.interests,
        pictures: formValue?.pictures,
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

  if (!formValue) return null;

  return (
    <div>
      <h1>Profile</h1>

      <Form
        fluid
        formValue={formValue}
        model={model}
        onChange={handleChange}
        onSubmit={handleSubmit}
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
              <p className='text-lg font-bold'>Email Name</p>
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
              <p className='text-lg font-bold'>Avatar</p>
              <Form.Control
                name='profilePic'
                accepter={Uploader}
                listType='picture'
                action='/upload' // Change this
                accept='image/*'
                onUpload={(file) => {
                  setUploading(true);
                  previewFile(file.blobFile, (value) => {
                    setFileInfo(value);
                  });
                }}
                onSuccess={(response, file) => {
                  setUploading(false);
                  toaster.push(
                    <Notification type='success'>
                      Uploaded successfully
                    </Notification>,
                  );
                  console.log(response);
                }}
                onError={() => {
                  setFileInfo(null);
                  setUploading(false);
                  toaster.push(
                    <Notification type='error' closable>
                      File upload failed
                    </Notification>,
                  );
                }}
              >
                <Box as='button' w={150} h={150}>
                  {uploading && <Loader backdrop center />}
                  {fileInfo ? (
                    <img src={fileInfo} width='100%' height='100%' />
                  ) : (
                    <RxAvatar size={40} color='var(--rs-gray-500)' />
                  )}
                </Box>
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <p className='text-lg font-bold'>Pictures</p>
              <Form.Control
                name='pictures'
                accepter={Uploader}
                listType='picture'
                action='/upload' // Change this
                accept='image/*'
                multiple
                onUpload={(file) => {
                  setUploading(true);
                  previewFile(file.blobFile, (value) => {
                    setFileInfo(value);
                  });
                }}
                onSuccess={(response, file) => {
                  setUploading(false);
                  toaster.push(
                    <Notification type='success'>
                      Uploaded successfully
                    </Notification>,
                  );
                  console.log(response);
                }}
                onError={() => {
                  setFileInfo(null);
                  setUploading(false);
                  toaster.push(
                    <Notification type='error' closable>
                      File upload failed
                    </Notification>,
                  );
                }}
              >
                <button>
                  <RxCamera size={24} />
                </button>
              </Form.Control>
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

function previewFile(file: any, callback: any) {
  const reader = new FileReader();
  reader.onloadend = () => {
    callback(reader.result);
  };
  reader.readAsDataURL(file);
}

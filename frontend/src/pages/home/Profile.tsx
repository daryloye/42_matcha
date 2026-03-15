import { useState } from 'react';
import { RxAvatar, RxCamera } from 'react-icons/rx';
import {
  ArrayType,
  Box,
  Button,
  DatePicker,
  DateType,
  Form,
  Loader,
  Notification,
  Schema,
  SelectPicker,
  StringType,
  TagInput,
  Textarea,
  Uploader,
  useToaster,
} from 'rsuite';
import { ProfileLocation } from '../../components/profile/ProfileLocation';
import { HomePageTemplate } from './HomePageTemplate';

export default function Profile() {
  return <HomePageTemplate page={<ProfilePage />} />;
}

const genderData = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

const preferenceData = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'both', label: 'Both' },
];

const model = Schema.Model({
  firstname: StringType().isRequired('First name is required'),
  lastname: StringType().isRequired('Last name is required'),
  email: StringType()
    .isEmail('Please enter a vaild email')
    .isRequired('Email is required'),
  dateOfBirth: DateType().isRequired('Date of birth is required'),
  gender: StringType().isRequired('Gender is required'),
  preference: StringType().isRequired('Preference is required'),
  interests: ArrayType()
    .maxLength(5, 'Maximum 5 tags allowed')
    .of(StringType().maxLength(20, 'Max 20 characters for each tag')),
});

function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const [formValue, setFormValue] = useState({
    firstname: '',
    lastname: '',
    email: '',
    dateOfBirth: null as Date | null,
    gender: null as string | null,
    preference: null as string | null,
    biography: '',
    interests: null as string[] | null,
    pictures: null,
  });

  const [uploading, setUploading] = useState(false);
  const [fileInfo, setFileInfo] = useState<any>(null);
  const [position, setPosition] = useState(null);

  const toaster = useToaster();

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
    toaster.push(
      <Notification type='success' closable>
        Profile updated
        <p>Firstname: {formValue.firstname}</p>
        <p>Lastname: {formValue.lastname}</p>
        <p>Email: {formValue.email}</p>
        <p>Date of birth: {formValue.dateOfBirth?.toLocaleDateString()}</p>
        <p>Gender: {formValue.gender}</p>
        <p>Preference: {formValue.preference}</p>
        <p>Biography: {formValue.biography}</p>
        <p>Interests:</p>
        {formValue.interests?.map((i) => (
          <p>- {i}</p>
        ))}
      </Notification>,
    );
    setLoading(false);
  };

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

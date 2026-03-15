import { ArrayType, DateType, Schema, StringType } from 'rsuite';

export const genderData = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

export const preferenceData = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'both', label: 'Both' },
];

export const model = Schema.Model({
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

export type PictureItem = {
  file: File;
  url: string;
};

export type ChatItem = {
  id: number;
  name: string;
  image: string;
  status: string;
  messages: { from: string; message: string }[];
};

export type BasicProfile = {
  username: string;
  first_name: string;
  last_name: string;
  picture: string;
  is_profile_completed: boolean;
};

export type ProfileForm = {
  firstname: string;
  lastname: string;
  email: string;
  dateOfBirth: Date;
  gender: string;
  preference: string;
  biography: string;
  interests: string[];
  pictures: any;
};

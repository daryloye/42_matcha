export type PictureItem = {
  file: File;
  url: string;
};


export type SearchFilters = {
  name: string;
  age: [number, number];
  distance: [number, number];
  fame: [number, number];
  tags: string[];
};

export type SearchSort = {
  age: number;
  distance: number;
  fame: number;
  tags: number;
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

export type MatchStatus = {
  isConnected: boolean;
  hasLikedTarget: boolean;
  isBlockingTarget: boolean;
  isBlockedByTarget: boolean;
}

export enum MatchStatusEnum {
  LIKE = 'like',
  UNLIKE = 'unlike',
  CONNECTED = 'connected',
  BLOCK = 'block',
  UNBLOCK = 'unblock',
  VIEW = 'view',
  REPORT = 'report',
}

export interface RecommendedProfileRow {
  id: string;
  first_name: string;
  last_name: string;
  gender: string | null;
  date_of_birth: string;
  latitude: number | null;
  longitude: number | null;
  fame_rating: number;
  profile_pic: string | null;
  interests: string[];
}

export interface RecommendedProfile {
  id: string;
  first_name: string;
  last_name: string;
  gender: string | null;
  fame_rating: number;
  profile_pic: string | null;
  interests: string[];
  distance: number | null;
  age: number;
}
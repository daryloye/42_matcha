import { atom } from 'jotai';
<<<<<<< HEAD
import { atomWithStorage } from 'jotai/utils';
import type { ChatItem, PictureItem } from './types';

// Authorization token
export const authorizationAtom = atomWithStorage('authorizationToken', '');

// Basic Profile
export const basicProfileAtom = atom<any>(null);

// Profile Page
export const genderAtom = atom<string>('Male');
export const genderPreferenceAtom = atom<string>('Male');
export const biographyAtom = atom<string>('');
export const tagListAtom = atom<string[]>(['hello', 'world']);
export const picturesAtom = atom<PictureItem[]>([]);
export const locationAtom = atom<any>(null);
=======
import type { ChatItem } from './types';
>>>>>>> main

// Chat Page
export const selectedChatAtom = atom<ChatItem | null>(null);

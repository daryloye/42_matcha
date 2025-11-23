import { atom } from 'jotai';
import type { PictureItem } from './types';

// Profile Page
export const genderAtom = atom<string>('Male');
export const genderPreferenceAtom = atom<string>('Male');
export const biographyAtom = atom<string>('');
export const tagListAtom = atom<string[]>(['hello', 'world']);
export const picturesAtom = atom<PictureItem[]>([]);
export const locationAtom = atom<any>(null);
import { atom } from 'jotai';
import type { ChatItem } from './types';

// Chat Page
export const selectedChatAtom = atom<ChatItem | null>(null);

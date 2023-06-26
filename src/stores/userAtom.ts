import {UserType} from '../types/UserType';
import {atom} from 'jotai';
import Nullable from '../types/Nullable';

export const userAtom = atom<Nullable<UserType>>(null);

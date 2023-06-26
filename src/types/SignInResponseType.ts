import {UserType} from './UserType';

export type SignInResponseType = {
  data: UserType;
  result: number;
  msg: string;
  reason: string;
};

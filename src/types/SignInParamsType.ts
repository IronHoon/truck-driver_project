export type SignInParamsType = {
  id: string;
  login_type: 'kakao' | 'apple';
  dev_type: 'ios' | 'android';
  dev_token: string;
};

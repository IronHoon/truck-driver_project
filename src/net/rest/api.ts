import axios, {AxiosRequestConfig} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Nullable from '../../types/Nullable';

function handleError(
  error: any,
  errorHandler: ((error: any) => void) | undefined,
) {
  if (errorHandler) {
    errorHandler(error);
  } else {
    throw error;
  }
}

export async function get<ResponseType>(
  url: string,
  config: Nullable<AxiosRequestConfig> = null,
  errorHandler?: (error: any) => void,
  useLog: boolean = false,
) {
  try {
    useLog && console.log(`[get]${url} request`, '');
    const response = await axios.get(url, config ?? undefined);
    useLog && console.log(`[get]${url} response : `, response.data);
    return response.data as ResponseType;
  } catch (error: any) {
    handleError(error, errorHandler);
  }
}

export async function post<ResponseType, ParamType>(
  url: string,
  params: ParamType,
  config: Nullable<AxiosRequestConfig> = null,
  errorHandler?: (error: any) => void,
  useLog: boolean = false,
) {
  try {
    useLog && console.log(`[post]${url} request params`, params);
    const response = await axios.post(url, params, config ?? undefined);
    useLog && console.log(`[post]${url} response : `, response.data);
    return response.data as ResponseType;
  } catch (error: any) {
    handleError(error, errorHandler);
  }
}

export async function patch<ResponseType, ParamType>(
  url: string,
  params: ParamType,
  config: Nullable<AxiosRequestConfig> = null,
  errorHandler?: (error: any) => void,
  useLog: boolean = false,
) {
  try {
    useLog && console.log(`[patch]${url} request params`, params);
    const response = await axios.patch(url, params, config ?? undefined);
    useLog && console.log(`[patch]${url} response : `, response.data);
    return response.data as ResponseType;
  } catch (error: any) {
    handleError(error, errorHandler);
  }
}

export async function put<ResponseType, ParamType>(
  url: string,
  params: ParamType,
  config: Nullable<AxiosRequestConfig> = null,
  errorHandler?: (error: any) => void,
  useLog: boolean = false,
) {
  try {
    useLog && console.log(`[put]${url} request params`, params);
    const response = await axios.put(url, params, config ?? undefined);
    useLog && console.log(`[put]${url} response : `, response.data);
    return response.data as ResponseType;
  } catch (error: any) {
    handleError(error, errorHandler);
  }
}

export async function remove<ResponseType>(
  url: string,
  config: Nullable<AxiosRequestConfig> = null,
  errorHandler?: (error: any) => void,
  useLog: boolean = false,
) {
  try {
    useLog && console.log(`[remove]${url} request`, '');
    const response = await axios.delete(url, config ?? undefined);
    useLog && console.log(`[remove]${url} response : `, response.data);
    return response.data as ResponseType;
  } catch (error: any) {
    handleError(error, errorHandler);
  }
}

export async function rememberToken(token: string) {
  console.log('rememberToken token', token);
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  await AsyncStorage.setItem('token', token);
}

export async function rememberUser(data: any) {
  await AsyncStorage.setItem('userId', data.id);
  await AsyncStorage.setItem('login_type', data.login_type);
}

export function getToken() {
  return (axios.defaults.headers.common.Authorization ?? '')
    .toString()
    .split(' ')?.[1];
}

export function removeToken() {
  console.log('removeToken token', axios.defaults.headers.common.Authorization);
  delete axios.defaults.headers.common.Authorization;
  AsyncStorage.removeItem('token');
}

import axios, { AxiosInstance } from 'axios';
import { RequestTokenResponse, SessionIdResponse } from '../Types/types';


export const moviesAPI: AxiosInstance = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: import.meta.env.VITE_TMDB_API_KEY,
  },
});


async function getNewRequestToken(): Promise<void> {
  try {
    const { data } = await moviesAPI.get<RequestTokenResponse>('/authentication/token/new');
    const token = data.request_token;
    if (data.success) {
      localStorage.setItem('RequestToken_TMDB', token);
      window.location.href = `https://www.themoviedb.org/authenticate/${token}?redirect_to=${window.location.origin}/approved`;
    }
  } catch (error) {
    console.log('Sorry, your token could not be created.');
  }
}


async function createSessionID(): Promise<string | null> {
  const RequestToken = localStorage.getItem("RequestToken_TMDB");

  if (!RequestToken) {
    console.error("No request token found");
    return null;
  }

  try {
    const { data } = await moviesAPI.post<SessionIdResponse>('authentication/session/new', {
      request_token: RequestToken,
    });

    localStorage.setItem("SessionID_TMDB", data.session_id);
    return data.session_id;
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return null;
  }
}


export { getNewRequestToken, createSessionID };
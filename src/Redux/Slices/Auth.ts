import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'


export interface User {
  avatar: {
    gravatar: {
      hash: string;
    };
    tmdb: {
      avatar_path: string | null;
    };
  };
  id: number;
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  include_adult: boolean;
  username: string;
}

export interface InitStateType {
  user?: User; 
  isAuthenticated?: boolean;
  sessionID?: string | null;
}

const initialState: InitStateType = {
  user: undefined, 
  isAuthenticated: false,
  sessionID: localStorage.getItem("SessionID_TMDB") || null,
}

export const counterSlice = createSlice({
  name: 'Auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User> ) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.sessionID = localStorage.getItem("SessionID_TMDB");
      if (action.payload.id !== undefined) {
        localStorage.setItem('AccountID_TMDB', action.payload.id.toString()); 
      }
    }
  },
})


export const { setUser } = counterSlice.actions;
export default counterSlice.reducer;
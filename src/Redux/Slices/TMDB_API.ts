import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface InitStateType {
  genreIdOrCategoryName: string | number,
  page: number,
  searchQuery: string,
}

const initialState: InitStateType = {
  genreIdOrCategoryName: '',
  page: 1,
  searchQuery: '',
}

export const genreOrCategorySlice = createSlice({
  name: 'genreOrCategory',
  initialState,
  reducers: {
    selectGenreOrCategory: (state, action: PayloadAction<string | number>) => {
      state.genreIdOrCategoryName = action.payload;
      state.page = 1;
    },

    searchMovie: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.page = 1; 
    },

    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },

    nextPage: (state) => {
      state.page += 1;
    },
    
    previousPage: (state) => {
      state.page = Math.max(1, state.page - 1);
    },
  },
})

export const { 
  selectGenreOrCategory, 
  searchMovie, 
  setPage, 
  nextPage, 
  previousPage 
} = genreOrCategorySlice.actions;

export default genreOrCategorySlice.reducer;
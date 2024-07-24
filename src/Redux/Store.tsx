import { configureStore } from "@reduxjs/toolkit";
import { tmdbApi } from "./Services/Services";
import genreOrCategoryReducer from "./Slices/TMDB_API";
import userReducer from "./Slices/Auth";

export const store = configureStore({
  reducer: {
    [tmdbApi.reducerPath]: tmdbApi.reducer,
    currentGenreOrCategory: genreOrCategoryReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tmdbApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
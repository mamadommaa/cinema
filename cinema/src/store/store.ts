import { configureStore } from '@reduxjs/toolkit'
import moviesReducer from './moviesSlice'
import authReducer from './authSlice';
import userReducer from './userSlice';
import favoritesReducer from './favoritesSlice'
import watchProgressReducer from './watchProgress';
import shantiReducer from './shantiSlice';

export const store = configureStore({
    reducer: {
        movies: moviesReducer,
        auth: authReducer,
        user: userReducer,
        favorites: favoritesReducer,
        watchProgress: watchProgressReducer,
        shanti: shantiReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

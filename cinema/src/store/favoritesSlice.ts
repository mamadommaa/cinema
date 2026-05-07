import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Movie } from './moviesSlice';

const apiClient = axios.create({
    baseURL: 'http://localhost:5000/api',
});

interface FavoritesState {
    items: Movie[];
    loading: boolean;
    error: string | null;
    addingId: number | null;
}

const initialState: FavoritesState = {
    items: [],
    loading: false,
    error: null,
    addingId: null,
};

export const fetchFavorites = createAsyncThunk(
    'favorites/fetchFavorites',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get('/favorites');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Не удалось загрузить избранное');
        }
    }
);

export const addFavorite = createAsyncThunk(
    'favorites/addFavorite',
    async (movieId: number, { rejectWithValue }) => {
        try {
            const response = await apiClient.post('/favorites', { id: String(movieId) });
            return response.data;
        } catch (error: any) {
            console.log('Ошибка API:', error.response?.data);
            return rejectWithValue(error.response?.data?.message || 'Не удалось добавить в избранное');
        }
    }
);

export const removeFavorite = createAsyncThunk(
    'favorites/removeFavorite',
    async (movieId: number, { rejectWithValue }) => {
        try {
            await apiClient.delete(`/favorites/${movieId}`);
            return movieId;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Не удалось удалить из избранного');
        }
    }
);

const favoritesSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {
        clearFavorites: (state) => {
            state.items = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFavorites.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFavorites.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchFavorites.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Ошибка загрузки избранного';
            })
            .addCase(addFavorite.pending, (state, action) => {
                state.addingId = action.meta.arg;
                state.error = null;
                console.log(' Добавляем фильм с id:', action.meta.arg);
            })
            .addCase(addFavorite.fulfilled, (state, action) => {
                state.addingId = null;
                console.log('Фильм успешно добавлен с id:', action.meta.arg);
            })
            .addCase(addFavorite.rejected, (state, action) => {
                state.addingId = null;
                state.error = action.payload as string || 'Ошибка добавления';
                console.log(' Ошибка добавления:', action.payload);
            })
            .addCase(removeFavorite.pending, (state, action) => {
                state.addingId = action.meta.arg;
                state.error = null;
            })
            .addCase(removeFavorite.fulfilled, (state, action) => {
                state.addingId = null;
                state.items = state.items.filter(movie => movie.id !== action.payload);
            })
            .addCase(removeFavorite.rejected, (state, action) => {
                state.addingId = null;
                state.error = action.payload as string || 'Ошибка удаления';
            });
    },
});

export const { clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;

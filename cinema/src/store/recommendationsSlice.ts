import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Movie } from './moviesSlice';

const apiClient = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true,
});

interface RecommendationsState {
    lastWatched: Movie[];
    recommended: Movie[];
    loading: boolean;
    error: string | null;
}

const initialState: RecommendationsState = {
    lastWatched: [],
    recommended: [],
    loading: false,
    error: null,
};

// Получить последние просмотренные фильмы (заглушка, потом заменим на реальный запрос)
export const fetchLastWatched = createAsyncThunk(
    'recommendations/fetchLastWatched',
    async () => {
        // TODO: реальный запрос к бэкенду
        const response = await apiClient.get('/recommendations/last-watched');
        return response.data;
    }
);

// Получить рекомендации на основе предпочтений
export const fetchRecommended = createAsyncThunk(
    'recommendations/fetchRecommended',
    async () => {
        const response = await apiClient.get('/recommendations/by-preferences');
        return response.data;
    }
);

const recommendationsSlice = createSlice({
    name: 'recommendations',
    initialState,
    reducers: {
        clearRecommendations: (state) => {
            state.lastWatched = [];
            state.recommended = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchLastWatched
            .addCase(fetchLastWatched.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLastWatched.fulfilled, (state, action) => {
                state.loading = false;
                state.lastWatched = action.payload;
            })
            .addCase(fetchLastWatched.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Ошибка загрузки последних просмотров';
            })
            // fetchRecommended
            .addCase(fetchRecommended.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRecommended.fulfilled, (state, action) => {
                state.loading = false;
                state.recommended = action.payload;
            })
            .addCase(fetchRecommended.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Ошибка загрузки рекомендаций';
            });
    },
});

export const { clearRecommendations } = recommendationsSlice.actions;
export default recommendationsSlice.reducer;

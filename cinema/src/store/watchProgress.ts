import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true,
});

interface WatchProgressItem {
    movieId: number;
    progress: number;
    completed: boolean;
}

interface WatchProgressState {
    items: WatchProgressItem[];
    loading: boolean;
    error: string | null;
}

const initialState: WatchProgressState = {
    items: [],
    loading: false,
    error: null,
};

export const fetchWatchProgress = createAsyncThunk(
    'watchProgress/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get('/watch-progress');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки прогресса');
        }
    }
);


export const updateWatchProgress = createAsyncThunk(
    'watchProgress/update',
    async ({ movieId, progress }: { movieId: number; progress: number }, { rejectWithValue }) => {
        console.log(' Slice: отправка прогресса', { movieId, progress });
        try {
            const response = await apiClient.post('/watch-progress', { movieId, progress });
            console.log('Slice: ответ сервера', response.data);
            return response.data;
        } catch (error: any) {
            console.log('Slice: ошибка', error.response?.data);
            return rejectWithValue(error.response?.data?.message || 'Ошибка обновления прогресса');
        }
    }
);

const watchProgressSlice = createSlice({
    name: 'watchProgress',
    initialState,
    reducers: {
        clearProgress: (state) => {
            state.items = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchWatchProgress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWatchProgress.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchWatchProgress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Ошибка загрузки прогресса';
            })
            .addCase(updateWatchProgress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateWatchProgress.fulfilled, (state, action) => {
                state.loading = false;
                const updated = action.payload;
                const index = state.items.findIndex(item => item.movieId === updated.movieId);
                if (index !== -1) {
                    state.items[index] = updated;
                } else {
                    state.items.push(updated);
                }
            })
            .addCase(updateWatchProgress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Ошибка обновления прогресса';
            });
    },
});

export const { clearProgress } = watchProgressSlice.actions;
export default watchProgressSlice.reducer;

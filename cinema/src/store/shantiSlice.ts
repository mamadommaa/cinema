import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Movie } from './moviesSlice';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
    movies?: Movie[] | null;
}

interface ShantiState {
    messages: Message[];
    loading: boolean;
    error: string | null;
}

const initialState: ShantiState = {
    messages: [],
    loading: false,
    error: null,
};

const apiClient = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true,
});

export const sendToShanti = createAsyncThunk(
    'shanti/send',
    async (message: string, { rejectWithValue }) => {
        try {
            const response = await apiClient.post('/shanti/chat', { message });
            return {
                reply: response.data.reply,
                movies: response.data.movies || null
            };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Ошибка общения с Shanti');
        }
    }
);

const shantiSlice = createSlice({
    name: 'shanti',
    initialState,
    reducers: {
        addUserMessage: (state, action) => {
            const newMessage: Message = {
                id: Date.now(),
                text: action.payload,
                sender: 'user',
            };
            state.messages.push(newMessage);
        },
        clearChat: (state) => {
            state.messages = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendToShanti.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendToShanti.fulfilled, (state, action) => {
                state.loading = false;
                const botMessage: Message = {
                    id: Date.now(),
                    text: action.payload.reply,
                    sender: 'bot',
                    movies: action.payload.movies
                };
                state.messages.push(botMessage);
            })
            .addCase(sendToShanti.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { addUserMessage, clearChat } = shantiSlice.actions;
export default shantiSlice.reducer;

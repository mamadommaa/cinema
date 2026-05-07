import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface QuizOption {
    id: number;
    option_text: string;
}

interface QuizQuestion {
    id: number;
    question_text: string;
    options: QuizOption[];
}

interface QuizData {
    id: number;
    title: string;
    questions: QuizQuestion[];
}

interface QuizState {
    quiz: QuizData | null;
    loading: boolean;
    error: string | null;
    submitting: boolean;
    result: { score: number; passed: boolean } | null;
}

const initialState: QuizState = {
    quiz: null,
    loading: false,
    error: null,
    submitting: false,
    result: null,
};

const apiClient = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true,
});

export const fetchQuiz = createAsyncThunk(
    'quiz/fetch',
    async (movieId: number, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(`/quiz/${movieId}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Ошибка загрузки викторины');
        }
    }
);

export const submitQuiz = createAsyncThunk(
    'quiz/submit',
    async ({ quizId, answers }: { quizId: number; answers: Record<number, number> }, { rejectWithValue }) => {
        try {
            const response = await apiClient.post('/quiz/submit', { quizId, answers });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Ошибка отправки результатов');
        }
    }
);

const quizSlice = createSlice({
    name: 'quiz',
    initialState,
    reducers: {
        clearQuiz: (state) => {
            state.quiz = null;
            state.error = null;
            state.result = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchQuiz.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchQuiz.fulfilled, (state, action) => {
                state.loading = false;
                state.quiz = action.payload;
            })
            .addCase(fetchQuiz.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(submitQuiz.pending, (state) => {
                state.submitting = true;
                state.error = null;
            })
            .addCase(submitQuiz.fulfilled, (state, action) => {
                state.submitting = false;
                state.result = {
                    score: action.payload.score,
                    passed: action.payload.passed,
                };
            })
            .addCase(submitQuiz.rejected, (state, action) => {
                state.submitting = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearQuiz } = quizSlice.actions;
export default quizSlice.reducer;

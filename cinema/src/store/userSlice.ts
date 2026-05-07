import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface User {
    email: string;
    firstName?: string;
    lastName?: string;
}

interface UserState {
    user: User | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    registrationSuccess: boolean;
}

const initialState: UserState = {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
    registrationSuccess: false,
};

const apiClient = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true,
});

const transformProfileData = (data: any): User => {
    return {
        email: data.email,
        firstName: data.name,
        lastName: data.surname,
    };
};


export const fetchProfile = createAsyncThunk(
    'user/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get('/auth/profile');
            return transformProfileData(response.data);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Ошибка загрузки профиля');
        }
    }
);

export const loginUser = createAsyncThunk(
    'user/login',
    async ({ email, password }: { email: string; password: string }, { dispatch, rejectWithValue }) => {
        try {
            await apiClient.post('/auth/login', { email, password });
            const profile = await dispatch(fetchProfile()).unwrap();

            return profile;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Ошибка входа');
        }
    }
);

export const registerUser = createAsyncThunk(
    'user/register',
    async ({ email, password, firstName, lastName }: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
    }, { rejectWithValue }) => {
        try {
            await apiClient.post('/auth/register', {
                email,
                password,
                firstName,
                lastName,
            });
            return true;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Ошибка регистрации');
        }
    }
);

export const logoutUser = createAsyncThunk(
    'user/logout',
    async (_, { rejectWithValue }) => {
        try {
            await apiClient.post('/auth/logout');
            return true;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Ошибка выхода');
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearRegistrationSuccess: (state) => {
            state.registrationSuccess = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
                state.registrationSuccess = false;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Ошибка входа';
            })
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.registrationSuccess = false;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.loading = false;
                state.registrationSuccess = true;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Ошибка регистрации';
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(fetchProfile.rejected, (state) => {
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.registrationSuccess = false;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Ошибка выхода';
            });
    },
});

export const { clearError, clearRegistrationSuccess } = userSlice.actions;
export default userSlice.reducer;

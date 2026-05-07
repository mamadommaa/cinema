import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export interface Movie {
    id: number
    title: string
    posterUrl: string | null
    tmdbRating: number
    releaseYear: number
    genres: string[]
    runtime: number
    plot: string
    backdropUrl: string | null
    language?: string
    budget?: string
    revenue?: string
    director?: string
    production?: string
    awardsSummary?: string
    videoUrl?: string | null
}

interface MoviesState {
    top10: {
        data: Movie[]
        loading: boolean
        error: string | null
    }
    random: {
        data: Movie | null
        loading: boolean
        error: string | null
    }
    current: {
        data: Movie | null
        loading: boolean
        error: string | null
    },
    genres: {
        data: string[]
        loading: boolean
        error: string | null
    }
    moviesByGenre: {
        data: Movie[]
        loading: boolean
        error: string | null
        currentGenre: string | null
    }
    search: {
        query: string
        results: Movie[]
        loading: boolean
        error: string | null
    }
    currentWeek: {
        data: Movie[];
        loading: boolean;
        error: string | null;
    };
}

const initialState: MoviesState = {
    top10: {
        data: [],
        loading: false,
        error: null
    },
    random: {
        data: null,
        loading: false,
        error: null
    },
    current: {
        data: null,
        loading: false,
        error: null
    },
    genres: {
        data: [],
        loading: false,
        error: null
    },
    moviesByGenre: {
        data: [],
        loading: false,
        error: null,
        currentGenre: null
    },
    search: {
        query: '',
        results: [],
        loading: false,
        error: null
    },
    currentWeek: {
        data: [],
        loading: false,
        error: null
    },

}
export const searchMovies = createAsyncThunk(
    'movies/searchMovies',
    async (query: string, { rejectWithValue }) => {
        try {
            if (query.length < 2) {
                return [];
            }
            const response = await axios.get(`http://localhost:5000/api/movies/search?query=${query}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Ошибка поиска фильмов');
        }
    }
);
export const fetchCurrentWeek = createAsyncThunk(
    'movies/fetchCurrentWeek',
    async () => {
        const response = await axios.get('http://localhost:5000/api/movies/current-week');
        return response.data;
    }
);

export const fetchGenres = createAsyncThunk(
    'movies/fetchGenres',
    async () => {
        const response = await axios.get('http://localhost:5000/api/movies/genres');
        return response.data;
    }
);
export const fetchRandom = createAsyncThunk(
    'movies/fetchRandom',
    async () => {
        const response = await axios.get('http://localhost:5000/api/movies/random')
        return response.data
    }
)
export const fetchMoviesByGenre = createAsyncThunk(
    'movies/fetchMoviesByGenre',
    async (genre: string) => {
        const response = await axios.get(`http://localhost:5000/api/movies?genre=${genre}`);
        return { genre, movies: response.data };
    }
);
export const fetchTop10 = createAsyncThunk(
    'movies/fetchTop10',
    async () => {
        const response = await axios.get('http://localhost:5000/api/movies/top10')
        return response.data
    }
)
export const fetchMovieById = createAsyncThunk(
    'movies/fetchMovieById',
    async (id: number) => {
        const response = await axios.get(`http://localhost:5000/api/movies/${id}`);
        return response.data;
    }
);

const moviesSlice = createSlice({
    name: 'movies',
    initialState,
    reducers: {
        clearSearch: (state) => {
            state.search.query = '';
            state.search.results = [];
            state.search.loading = false;
            state.search.error = null;
        },
        setSearchQuery: (state, action) => {
            state.search.query = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTop10.pending, (state) => {
                state.top10.loading = true
                state.top10.error = null
            })
            .addCase(fetchTop10.fulfilled, (state, action) => {
                state.top10.loading = false
                state.top10.data = action.payload
            })
            .addCase(fetchTop10.rejected, (state, action) => {
                state.top10.loading = false
                state.top10.error = action.error.message || 'Ошибка загрузки'
            })
            .addCase(fetchRandom.pending, (state) => {
                state.random.loading = true
                state.random.error = null
            })
            .addCase(fetchRandom.fulfilled, (state, action) => {
                state.random.loading = false
                state.random.data = action.payload
            })
            .addCase(fetchRandom.rejected, (state, action) => {
                state.random.loading = false
                state.random.error = action.error.message || 'Ошибка загрузки'
            })
            .addCase(fetchMovieById.pending, (state) => {
                state.current.loading = true
                state.current.error = null
            })
            .addCase(fetchMovieById.fulfilled, (state, action) => {
                state.current.loading = false
                state.current.data = action.payload
            })
            .addCase(fetchMovieById.rejected, (state, action) => {
                state.current.loading = false
                state.current.error = action.error.message || 'Ошибка загрузки'
            })
            .addCase(fetchGenres.pending, (state) => {
                state.genres.loading = true
                state.genres.error = null
            })
            .addCase(fetchGenres.fulfilled, (state, action) => {
                state.genres.loading = false
                state.genres.data = action.payload
            })
            .addCase(fetchGenres.rejected, (state, action) => {
                state.genres.loading = false
                state.genres.error = action.error.message || 'Ошибка загрузки жанров'
            })
            .addCase(fetchMoviesByGenre.pending, (state) => {
                state.moviesByGenre.loading = true
                state.moviesByGenre.error = null
            })
            .addCase(fetchMoviesByGenre.fulfilled, (state, action) => {
                state.moviesByGenre.loading = false
                state.moviesByGenre.data = action.payload.movies
                state.moviesByGenre.currentGenre = action.payload.genre
            })
            .addCase(fetchMoviesByGenre.rejected, (state, action) => {
                state.moviesByGenre.loading = false
                state.moviesByGenre.error = action.error.message || 'Ошибка загрузки фильмов'
            })
            .addCase(searchMovies.pending, (state) => {
                state.search.loading = true
                state.search.error = null
            })
            .addCase(searchMovies.fulfilled, (state, action) => {
                state.search.loading = false
                state.search.results = action.payload
                state.search.error = null
            })
            .addCase(searchMovies.rejected, (state, action) => {
                state.search.loading = false
                state.search.error = action.payload as string || 'Ошибка поиска'
                state.search.results = []
            })
            .addCase(fetchCurrentWeek.pending, (state) => {
                state.currentWeek.loading = true;
                state.currentWeek.error = null;
            })
            .addCase(fetchCurrentWeek.fulfilled, (state, action) => {
                state.currentWeek.loading = false;
                state.currentWeek.data = action.payload;
            })
            .addCase(fetchCurrentWeek.rejected, (state, action) => {
                state.currentWeek.loading = false;
                state.currentWeek.error = action.error.message || 'Ошибка загрузки подборки';
            });
    }
})
export const { clearSearch, setSearchQuery } = moviesSlice.actions
export default moviesSlice.reducer

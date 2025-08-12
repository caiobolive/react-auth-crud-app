import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  total: 0,
  perPage: 6,
  searchTerm: '',
};

const crudSlice = createSlice({
  name: 'crud',
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setTotalPages: (state, action) => {
      state.totalPages = action.payload;
    },
    setTotal: (state, action) => {
      state.total = action.payload;
    },
    setPerPage: (state, action) => {
      state.perPage = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    addUser: (state, action) => {
      state.users.push(action.payload);
    },
    updateUser: (state, action) => {
      const { id, userData } = action.payload;
      const index = state.users.findIndex((user) => user.id === id);
      if (index !== -1) {
        state.users[index] = { ...state.users[index], ...userData };
      }
    },
    deleteUser: (state, action) => {
      state.users = state.users.filter((user) => user.id !== action.payload);
    },
  },
});

export const {
  setUsers,
  setLoading,
  setError,
  setCurrentPage,
  setTotalPages,
  setTotal,
  setPerPage,
  setSearchTerm,
  addUser,
  updateUser,
  deleteUser,
} = crudSlice.actions;

export default crudSlice.reducer;

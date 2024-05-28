import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    userId: null,
    email: null,
    userName: null,
    contactDetails: null,
    photoUrl: null,
  },
  reducers: {
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setUserName: (state, action) => {
      state.userName = action.payload;
    },
    setContactDetails: (state, action) => {
      state.contactDetails = action.payload;
    },
    setUserPhoto: (state, action) => {
      state.photoUrl = action.payload;
    },
  },
});

export const { setUserId, setUserName, setContactDetails, setUserPhoto, setEmail } = userSlice.actions;

export default userSlice.reducer;

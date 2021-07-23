import {createSlice} from '@reduxjs/toolkit';

export const counterSlice = createSlice({
  name: 'user',
  initialState: {
    email: '',
    name: '',
    photo: '',
  },
  reducers: {
    updateUser: (state, action) => {
      state = action.payload;
      return state;
    },
    deleteUser: state => {
      state = {email: '', name: '', photo: ''};
      return state;
    },
  },
});

// Action creators are generated for each case reducer function
export const {updateUser, deleteUser} = counterSlice.actions;

export default counterSlice.reducer;

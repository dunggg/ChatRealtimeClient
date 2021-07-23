import {configureStore} from '@reduxjs/toolkit';
import updateUser from './action';

export default configureStore({
  reducer: {
    user: updateUser,
  },
});

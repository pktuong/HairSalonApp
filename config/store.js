import { configureStore } from '@reduxjs/toolkit';
import itemReducer from './slices/itemSlice';

export const store = configureStore({
  reducer: {
    item: itemReducer, // Khai báo reducer
  },
});

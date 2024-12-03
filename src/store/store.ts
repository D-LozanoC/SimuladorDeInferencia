import { configureStore } from '@reduxjs/toolkit';
import factsReducer from './factsSlice';

const store = configureStore({
  reducer: {
    facts: factsReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;  // Esto obtiene el tipo del estado global
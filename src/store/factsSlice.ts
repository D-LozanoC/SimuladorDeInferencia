import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Fact from '../types/Fact';

interface FactsState {
  facts: Fact[];
  inferredFacts: Fact[];
  error: string | null;
}

const initialState: FactsState = {
  facts: [],
  inferredFacts: [],
  error: null
};

const factsSlice = createSlice({
  name: 'facts',
  initialState,
  reducers: {
    setFacts(state, action: PayloadAction<Fact[]>) {
      state.facts = action.payload;
    },
    addFact(state, action: PayloadAction<Fact>) {
      state.facts.push(action.payload);
    },
    removeFact(state, action: PayloadAction<string>) {
      state.facts = state.facts.filter(fact => fact.key !== action.payload);
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setInferredFacts: (state, action: PayloadAction<Fact[]>) => {
      state.inferredFacts = action.payload;
    },
  }
});

export const { setFacts, addFact, removeFact, setError, setInferredFacts } = factsSlice.actions;
export default factsSlice.reducer;

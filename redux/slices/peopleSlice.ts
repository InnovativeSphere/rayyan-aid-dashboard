import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import * as api from "../../pages/lib/api";

// ------------------- TYPES -------------------

export type PersonType = "supervisor" | "volunteer" | "trustee";

export type PersonImageType = "avatar";

export interface Person {
  id: number;
  first_name: string;
  last_name: string;
  bio?: string;
  type: PersonType;
  photo_url?: string;
  photo_type?: PersonImageType; // <-- NEW
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PeopleState {
  people: Person[];
  loading: boolean;
  error: string | null;
}

// Payload for updates
interface UpdatePersonPayload {
  id: number;
  updates: Partial<Person>;
}

// ------------------- THUNKS -------------------

// Fetch all people
export const fetchPeople = createAsyncThunk<
  Person[],
  void,
  { rejectValue: string }
>("people/fetchAll", async (_, thunkAPI) => {
  try {
    return await api.getPeople();
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

// Create a new person
export const createPerson = createAsyncThunk<
  Person,
  Omit<Person, "id">,
  { rejectValue: string }
>("people/create", async (personData, thunkAPI) => {
  try {
    const data = await api.createPerson(personData);
    return { id: data.id, ...personData } as Person;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

// Update a person
export const updatePerson = createAsyncThunk<
  UpdatePersonPayload,
  UpdatePersonPayload,
  { rejectValue: string }
>("people/update", async ({ id, updates }, thunkAPI) => {
  try {
    const result = await api.updatePerson(id, updates);
    return { id, updates, result };
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

// Delete a person
export const deletePerson = createAsyncThunk<
  { id: number },
  number,
  { rejectValue: string }
>("people/delete", async (id, thunkAPI) => {
  try {
    await api.deletePerson(id);
    return { id };
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

// ------------------- SLICE -------------------

const initialState: PeopleState = {
  people: [],
  loading: false,
  error: null,
};

const peopleSlice = createSlice({
  name: "people",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // FETCH
    builder.addCase(fetchPeople.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchPeople.fulfilled,
      (state, action: PayloadAction<Person[]>) => {
        state.loading = false;
        state.people = action.payload;
      }
    );
    builder.addCase(fetchPeople.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Error fetching people";
    });

    // CREATE
    builder.addCase(createPerson.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      createPerson.fulfilled,
      (state, action: PayloadAction<Person>) => {
        state.loading = false;
        state.people.push(action.payload);
      }
    );
    builder.addCase(createPerson.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Error creating person";
    });

    // UPDATE
    builder.addCase(updatePerson.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      updatePerson.fulfilled,
      (state, action: PayloadAction<UpdatePersonPayload>) => {
        state.loading = false;
        const idx = state.people.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1)
          state.people[idx] = {
            ...state.people[idx],
            ...action.payload.updates,
          };
      }
    );
    builder.addCase(updatePerson.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Error updating person";
    });

    // DELETE
    builder.addCase(deletePerson.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      deletePerson.fulfilled,
      (state, action: PayloadAction<{ id: number }>) => {
        state.loading = false;
        state.people = state.people.filter(
          (p) => p.id !== action.payload.id
        );
      }
    );
    builder.addCase(deletePerson.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Error deleting person";
    });
  },
});

export default peopleSlice.reducer;

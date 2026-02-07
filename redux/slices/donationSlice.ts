import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import * as api from "../../pages/lib/api";

// ---- Types ----
export interface Donation {
  id: number;
  project_id: number;
  donor_name?: string;
  amount: number;
  donation_date: string;
  created_at: string;
  project_title?: string;
}

export interface DonationsState {
  donations: Donation[];
  groupedByAmount: any[];
  totalsPerProject: any[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: DonationsState = {
  donations: [],
  groupedByAmount: [],
  totalsPerProject: [],
  status: "idle",
  error: null,
};

// ---- Async Thunks ----

// Fetch all donations (optionally by project)
export const fetchDonations = createAsyncThunk<
  Donation[],
  number | undefined, // project_id optional
  { rejectValue: string }
>("donations/fetchAll", async (project_id, thunkAPI) => {
  try {
    // if project_id is undefined, fetch all donations
    const data =
      project_id === undefined
        ? await api.getDonations() // fetch all donations
        : await api.getDonations(project_id); // fetch for specific project
    return data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});


// Add a new donation
export const addDonation = createAsyncThunk<
  Donation,
  { project_id: number; donor_name?: string; amount: number },
  { rejectValue: string }
>("donations/add", async (payload, thunkAPI) => {
  try {
    const data = await api.addDonation(payload);
    return data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

// Update a donation
export const updateDonation = createAsyncThunk<
  { id: number },
  { id: number; project_id?: number; donor_name?: string; amount?: number },
  { rejectValue: string }
>("donations/update", async (payload, thunkAPI) => {
  try {
    await api.updateDonation(payload.id, payload);
    return { id: payload.id };
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

// Delete a donation
export const removeDonation = createAsyncThunk<
  { id: number },
  number,
  { rejectValue: string }
>("donations/remove", async (id, thunkAPI) => {
  try {
    await api.deleteDonation(id);
    return { id };
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

// Custom: Group donations by amount
export const fetchDonationsGroupedByAmount = createAsyncThunk<
  any[],
  void,
  { rejectValue: string }
>("donations/groupByAmount", async (_, thunkAPI) => {
  try {
    const data = await api.getDonationsGroupedByAmount();
    return data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

// Custom: Total donations per project
export const fetchTotalDonationsPerProject = createAsyncThunk<
  any[],
  void,
  { rejectValue: string }
>("donations/totalPerProject", async (_, thunkAPI) => {
  try {
    const data = await api.getTotalDonationsPerProject();
    return data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

// ---- Slice ----
const donationsSlice = createSlice({
  name: "donations",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch donations
      .addCase(fetchDonations.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchDonations.fulfilled,
        (state, action: PayloadAction<Donation[]>) => {
          state.status = "succeeded";
          state.donations = action.payload;
        },
      )
      .addCase(fetchDonations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch donations";
      })

      // add donation
      .addCase(
        addDonation.fulfilled,
        (state, action: PayloadAction<Donation>) => {
          state.donations.push(action.payload);
        },
      )

      // update donation
      .addCase(updateDonation.fulfilled, (state, action) => {
        const index = state.donations.findIndex(
          (d) => d.id === action.payload.id,
        );
        if (index >= 0)
          state.donations[index] = {
            ...state.donations[index],
            ...action.meta.arg,
          };
      })

      // remove donation
      .addCase(removeDonation.fulfilled, (state, action) => {
        state.donations = state.donations.filter(
          (d) => d.id !== action.payload.id,
        );
      })

      // custom grouped by amount
      .addCase(fetchDonationsGroupedByAmount.fulfilled, (state, action) => {
        state.groupedByAmount = action.payload;
      })

      // custom total per project
      .addCase(fetchTotalDonationsPerProject.fulfilled, (state, action) => {
        state.totalsPerProject = action.payload;
      });
  },
});

export default donationsSlice.reducer;

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import * as api from "../../pages/lib/api";

export type PartnerImageType = "jewel_foundation_partner_logo";

export interface Partner {
  id: number;
  name: string;
  logo_url?: string | null;
  logo_type?: PartnerImageType;
  website_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

interface PartnersState {
  partners: Partner[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: PartnersState = {
  partners: [],
  status: "idle",
  error: null,
};

// ------------------- ASYNC THUNKS -------------------

// GET all partners
export const fetchPartners = createAsyncThunk<
  Partner[],
  void,
  { rejectValue: string }
>("partners/fetchAll", async (_, thunkAPI) => {
  try {
    return await api.getPartners();
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

// CREATE partner
export const createPartner = createAsyncThunk<
  Partner,
  Omit<Partner, "id" | "created_at" | "updated_at">,
  { rejectValue: string }
>("partners/create", async (partner, thunkAPI) => {
  try {
    return await api.createPartner(partner);
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

// UPDATE partner
export const updatePartner = createAsyncThunk<
  { id: number; partner: Partner },
  { id: number; data: Partial<Partner> },
  { rejectValue: string }
>("partners/update", async ({ id, data }, thunkAPI) => {
  try {
    await api.updatePartner(id, data);
    return { id, partner: { id, ...data } as Partner };
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

// DELETE partner
export const deletePartner = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("partners/delete", async (id, thunkAPI) => {
  try {
    await api.deletePartner(id);
    return id;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

// UPLOAD partner logo
export const uploadPartnerLogo = createAsyncThunk<
  { partnerId: number; logo_url: string },
  { partnerId: number; file: File },
  { rejectValue: string }
>("partners/uploadLogo", async ({ partnerId, file }, thunkAPI) => {
  try {
    const res = await api.uploadImage(file, "jewel_foundation_partner_logo");

    return {
      partnerId,
      logo_url: res.url,
    };
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

// ------------------- SLICE -------------------
const partnersSlice = createSlice({
  name: "partners",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchPartners.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPartners.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.partners = action.payload;
      })
      .addCase(fetchPartners.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch partners";
      })

      // create
      .addCase(createPartner.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createPartner.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.partners.push(action.payload);
      })
      .addCase(createPartner.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to create partner";
      })

      // update
      .addCase(updatePartner.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updatePartner.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.partners.findIndex(
          (p) => p.id === action.payload.id,
        );
        if (index !== -1) {
          state.partners[index] = {
            ...state.partners[index],
            ...action.payload.partner,
          };
        }
      })
      .addCase(updatePartner.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to update partner";
      })

      // delete
      .addCase(deletePartner.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deletePartner.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.partners = state.partners.filter((p) => p.id !== action.payload);
      })
      .addCase(deletePartner.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to delete partner";
      })

      // upload logo
      .addCase(uploadPartnerLogo.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(uploadPartnerLogo.fulfilled, (state, action) => {
        state.status = "succeeded";
        const partner = state.partners.find(
          (p) => p.id === action.payload.partnerId,
        );
        if (partner) partner.logo_url = action.payload.logo_url;
      })
      .addCase(uploadPartnerLogo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to upload partner logo";
      });
  },
});

export default partnersSlice.reducer;

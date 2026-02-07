import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import * as api from "../../pages/lib/api";

// ------------------- TYPES -------------------

export type ImageDescription = string;

export interface ProjectImage {
  id: number;
  project_id: number;
  image_url: string;
  description: ImageDescription;
  created_at: string;
  project_title?: string;
}

export interface AddImagesPayload {
  project_id: number;
  images: {
    image_url: string;
    description: ImageDescription;
  }[];
}

export interface ProjectImagesState {
  images: ProjectImage[];
  loading: boolean;
  error: string | null;
}

// ------------------- HELPERS -------------------

const normalizeError = (err: any) => {
  if (!err) return "Unknown error";
  if (typeof err === "string") return err;
  if (err.response?.data) {
    if (typeof err.response.data === "string") return err.response.data;
    return JSON.stringify(err.response.data);
  }
  if (err.message) return err.message;
  return JSON.stringify(err);
};

// ------------------- THUNKS -------------------
// Allow optional project_id
export const fetchProjectImages = createAsyncThunk<
  ProjectImage[],
  number | undefined,
  { rejectValue: string }
>(
  "projectImages/fetch",
  async (project_id, thunkAPI) => {
    try {
      // If project_id is undefined, fetch all images
      const images = project_id
        ? await api.getProjectImages(project_id)
        : await api.getAllProjectImages(); // <-- make sure your API has this method
      return images;
    } catch (err) {
      return thunkAPI.rejectWithValue(normalizeError(err));
    }
  }
);


// Add images
export const addProjectImages = createAsyncThunk<
  ProjectImage[],
  AddImagesPayload,
  { rejectValue: string }
>("projectImages/add", async (payload, thunkAPI) => {
  try {
    await api.addProjectImages(payload.project_id, payload.images);
    const now = new Date().toISOString();
    return payload.images.map((img) => ({
      id: Math.floor(Math.random() * 1000000),
      project_id: payload.project_id,
      image_url: img.image_url,
      description: img.description,
      created_at: now,
    }));
  } catch (err) {
    return thunkAPI.rejectWithValue(normalizeError(err));
  }
});

// Remove image (fixed to handle token/cookie correctly)
export const removeProjectImage = createAsyncThunk<
  { id: number },
  number,
  { rejectValue: string }
>("projectImages/remove", async (id, thunkAPI) => {
  try {
    // Choose which version based on your auth strategy
    // 1) If using cookies:
    await api.removeProjectImage(id);

    // 2) If using localStorage token:
    // await api.removeProjectImageWithToken(id);

    return { id };
  } catch (err) {
    return thunkAPI.rejectWithValue(normalizeError(err));
  }
});

// ------------------- SLICE -------------------

const initialState: ProjectImagesState = {
  images: [],
  loading: false,
  error: null,
};

const projectImagesSlice = createSlice({
  name: "projectImages",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchProjectImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProjectImages.fulfilled,
        (state, action: PayloadAction<ProjectImage[]>) => {
          state.loading = false;
          state.images = action.payload;
        },
      )
      .addCase(fetchProjectImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error fetching images";
      })

      // ADD
      .addCase(addProjectImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addProjectImages.fulfilled,
        (state, action: PayloadAction<ProjectImage[]>) => {
          state.loading = false;
          state.images.push(...action.payload);
        },
      )
      .addCase(addProjectImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error adding images";
      })

      // REMOVE
      .addCase(removeProjectImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        removeProjectImage.fulfilled,
        (state, action: PayloadAction<{ id: number }>) => {
          state.loading = false;
          state.images = state.images.filter(
            (img) => img.id !== action.payload.id,
          );
        },
      )
      .addCase(removeProjectImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error removing image";
      });
  },
});

export default projectImagesSlice.reducer;

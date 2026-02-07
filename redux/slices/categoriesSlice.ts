import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../pages/lib/api";

// ---------------- TYPES ----------------

export interface Category {
  id: number;
  name: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

interface CategoriesState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  categories: [],
  loading: false,
  error: null,
};

// ---------------- THUNKS ----------------

// Fetch all
export const fetchCategories = createAsyncThunk(
  "categories/fetchAll",
  async () => {
    return await getCategories();
  },
);

// Create
export const addCategory = createAsyncThunk(
  "categories/create",
  async (data: { name: string; description: string }) => {
    return await createCategory(data);
  },
);

// Update
export const editCategory = createAsyncThunk(
  "categories/update",
  async ({
    id,
    data,
  }: {
    id: number;
    data: { name?: string; description?: string };
  }) => {
    return await updateCategory(id, data);
  },
);

// Delete
export const removeCategory = createAsyncThunk(
  "categories/delete",
  async (id: number) => {
    return await deleteCategory(id);
  },
);

// ---------------- SLICE ----------------

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // FETCH
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to load categories";
      })

      // CREATE
      .addCase(addCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })

      // UPDATE
      .addCase(editCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(
          (c) => c.id === action.payload.id,
        );
        if (index !== -1) {
          state.categories[index] = {
            ...state.categories[index],
            ...action.payload,
          };
        }
      })

      // DELETE
      .addCase(removeCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          (c) => c.id !== action.meta.arg,
        );
      });
  },
});

export default categoriesSlice.reducer;

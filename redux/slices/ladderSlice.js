
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 🔐 API Key
const APPKEY = "Py9YJXgBecbbqxjRVaHarcSnJyuzhxGqJTkY6xKZRfrdXFy72HPXvFRvfEjy";

// ✅ Create Ladder
export const createLadder = createAsyncThunk(
  "ladder/create",
  async ({ user_id, name, type }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `https://ne-games.com/leaderBoard/api/user/creatLadder`,
        { user_id, name, type },
        {
          headers: { APPKEY },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

// ✅ Fetch Ladder By User ID
export const fetchLadderByUserId = createAsyncThunk(
  "ladder/fetchByUserId",
  async (user_id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://ne-games.com/leaderBoard/api/user/getLadderByUserId/${user_id}`,
        {
          headers: { APPKEY },
        }
      );
      console.log("API Response:", response.data);
      // Handle backend structure: { success, data: [...] }
      return response.data?.data || [];
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

const createLadderSlice = createSlice({
  name: "createLadder",
  initialState: {
    data: [],        // ✅ default empty array for safe map
    loading: false,
    error: null,
  },
  reducers: {
    clearCreateLadderState: (state) => {
      state.data = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Ladder
      .addCase(createLadder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLadder.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload?.data || []; // ensure array
      })
      .addCase(createLadder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Ladder by User ID
      .addCase(fetchLadderByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLadderByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload; // already handled as array
      })
      .addCase(fetchLadderByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCreateLadderState } = createLadderSlice.actions;
export default createLadderSlice.reducer;










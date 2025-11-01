// redux/slices/ladderSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchLadders = createAsyncThunk(
  "ladder/fetchLadders",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(
        `https://ne-games.com/leaderBoard/api/user/ladderList?user_id=${id}`,
        {
          headers: {
            APPKEY:
              "Py9YJXgBecbbqxjRVaHarcSnJyuzhxGqJTkY6xKZRfrdXFy72HPXvFRvfEjy",
          },
        }
      );
      return response.data.data; // this is the array of ladders

    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch ladders");
    }
  }
);





const ladderSlice = createSlice({
  name: "fetchLadder", // yeh wahi naam hona chahiye jo store me mount hai
  initialState: {
    allLadders: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearLadders: (state) => {
      state.allLadders = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLadders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLadders.fulfilled, (state, action) => {
        state.loading = false;
        state.allLadders = action.payload;
      })
      .addCase(fetchLadders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearLadders } = ladderSlice.actions; // <-- yeh export karo
export default ladderSlice.reducer;



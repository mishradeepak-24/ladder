 
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const APPKEY =
  "Py9YJXgBecbbqxjRVaHarcSnJyuzhxGqJTkY6xKZRfrdXFy72HPXvFRvfEjy";

// ✅ Move player / Save result thunk
export const movePlayer = createAsyncThunk(
  "playerMoving/movePlayer",
  async (
    {
      user_id,
      move_from_user_id,
      move_to_rank,
      move_from_rank,
      ladder_id,
      match_status, // "beat" | "lost"
      score
    },
    { rejectWithValue }
  ) => {
    try {
      const params = {
        user_id,
        ladder_id,
        match_status,
        move_from_user_id,
        score,
      };

      // ✅ Agar beat hai → move bhi hoga
      if (match_status === "beat") {
        params.move_to_rank = move_to_rank;
        if (move_from_rank) params.move_from_rank = move_from_rank;
      }
      // ✅ Agar lost hai → sirf log save hoga
      else if (match_status === "lost") {
        params.move_to_rank = move_to_rank; // API ko rank chahiye activity ke liye
      }

      const response = await axios.get(
        `https://ne-games.com/leaderBoard/api/user/result/save`,
        {
          params,
          headers: { APPKEY },
        }
      );

      const data = response.data;
      if (data.status === 200) {
        return {
          success_message:
            data.message ||
            (match_status === "beat"
              ? "Move Successful "
              : "Result Saved (Lost) "),
          result: data,
        };
      } else {
        return rejectWithValue(data.message || "Move failed");
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const movePlayer1 = createAsyncThunk(
  "playerMoving/movePlayer1",
  async (
    { user_id, move_from_user_id, move_to_rank, move_from_rank, ladder_id },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(
        "https://ne-games.com/leaderBoard/api/user/move_to",
        {
          params: { user_id, move_from_user_id, move_to_rank, move_from_rank, ladder_id },
          headers: { APPKEY },
        }
      );
      const data = response.data;
      if (data.status === 200) {
        return { success_message: data.message || "Move Successful ", result: data };
      } else {
        return rejectWithValue(data.message || "Move failed");
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const playerMovingSlice = createSlice({
  name: "playerMoving",
  initialState: {
    loading: false,
    error: null,
    successMessage: null,
    result: null,
  },
  reducers: {
    clearMoveResult(state) {
      state.loading = false;
      state.error = null;
      state.successMessage = null;
      state.result = null;
    },
  },


  extraReducers: (builder) => {
  builder
    .addCase(movePlayer.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.successMessage = null;
      state.result = null;
    })
    .addCase(movePlayer.fulfilled, (state, action) => {
      state.loading = false;
      state.successMessage = action.payload.success_message;
      state.result = action.payload.result;
    })
    .addCase(movePlayer.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Move failed";
      state.successMessage = null;
    })

    // ✅ movePlayer1 ke liye bhi same handling
    .addCase(movePlayer1.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.successMessage = null;
      state.result = null;
    })
    .addCase(movePlayer1.fulfilled, (state, action) => {
      state.loading = false;
      state.successMessage = action.payload.success_message;
      state.result = action.payload.result;
    })
    .addCase(movePlayer1.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Move failed";
      state.successMessage = null;
    });
}

});

export const { clearMoveResult } = playerMovingSlice.actions;
export default playerMovingSlice.reducer;
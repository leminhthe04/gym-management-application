import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { authService } from "@/services/authService";
import { toast } from "sonner";
import { type AuthState } from "@/types/store";

const initialState: AuthState = {
  accessToken: null,
  admin: null,
  loading: false,
};


export const signUp = createAsyncThunk(
  "auth/signUp",
  async ({ username, password }: any, { rejectWithValue }) => {
    try {
      await authService.signUp(username, password);
      toast.success("Sign up successful! You will be redirected to Sign In page.");
      return;
    } catch (error) {
      toast.error("Sign up failed. Please try again.");
      return rejectWithValue(error);
    }
  }
);

export const signIn = createAsyncThunk(
  "auth/signIn",
  async ({ username, password }: any, { dispatch, rejectWithValue }) => {
    try {
      // 1. Gọi API Login
      const { accessToken } = await authService.signIn(username, password);
      
      // 2. Dispatch fetchMe ngay sau khi có token (Redux state sẽ update token ở extraReducers)
      // Lưu ý: Chúng ta trả về accessToken để reducer cập nhật trước
      
      toast.success("Sign in successful!");
      return accessToken;
    } catch (error) {
      toast.error("Sign in failed. Please try again.");
      return rejectWithValue(error);
    }
  }
);

export const fetchMe = createAsyncThunk(
  "auth/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.fetchMe();
      return user;
    } catch (error) {
      console.error("Fetch me error:", error);
      toast.error("Fetching user info failed.");
      return rejectWithValue(error);
    }
  }
);

export const signOut = createAsyncThunk(
  "auth/signOut",
  async (_, { dispatch }) => {
    try {
      await authService.signOut();
      toast.success("Sign out successful!");
    } catch (error) {
      toast.error("Sign out failed.");
    }
    // Logic clear state sẽ được xử lý ở extraReducers
  }
);

export const refresh = createAsyncThunk(
  "auth/refresh",
  async (_, { dispatch, getState, rejectWithValue }) => {
    try {
      const accessToken = await authService.refresh();
      
      // Kiểm tra nếu chưa có user thì fetch lại
      const state = getState() as any; // Type RootState sau này
      if (!state.auth.user) {
        dispatch(fetchMe());
      }
      
      return accessToken;
    } catch (error) {
      console.error("Token refresh error:", error);
      toast.error("Session expired. Please sign in again.");
      return rejectWithValue(error);
    }
  }
);

export const test = createAsyncThunk(
  "auth/test",
  async (_, { rejectWithValue }) => {
    try {
      const message = await authService.test();
      toast.message(message);
    } catch (error) {
      console.error("Test error:", error);
      return rejectWithValue(error);
    }
  }
)

// --- Slice ---

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Các action đồng bộ thông thường
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    clearState: (state) => {
      state.accessToken = null;
      state.admin = null;
      state.loading = false;
      sessionStorage.clear();
      // localStorage sẽ được redux-persist xử lý riêng
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Sign Up ---
      .addCase(signUp.pending, (state) => { state.loading = true; })
      .addCase(signUp.fulfilled, (state) => { state.loading = false; })
      .addCase(signUp.rejected, (state) => { state.loading = false; })

      // --- Sign In ---
      .addCase(signIn.pending, (state) => { state.loading = true; })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload; // Update Token
      })
      .addCase(signIn.rejected, (state) => { state.loading = false; })

      // --- Fetch Me ---
      .addCase(fetchMe.pending, (state) => { state.loading = true; })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload; // Update User
      })
      .addCase(fetchMe.rejected, (state) => {
        state.loading = false;
        state.admin = null;
        state.accessToken = null;
      })

      // --- Sign Out ---
      .addCase(signOut.fulfilled, (state) => {
        state.accessToken = null;
        state.admin = null;
        state.loading = false;
        sessionStorage.clear();
      })

      // --- Refresh ---
      .addCase(refresh.fulfilled, (state, action) => {
        state.accessToken = action.payload;
      })
      .addCase(refresh.rejected, (state) => {
        state.accessToken = null;
        state.admin = null; // Clear user khi refresh fail (hết session)
      })
  },
});

export const { setAccessToken, clearState } = authSlice.actions;
export default authSlice.reducer;
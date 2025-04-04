import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, authService } from "../../services/api";
import axios from "axios";
import toast from "react-hot-toast";
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  token: string;
  currency: string;
  phone: string;
  location: string;
}

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

export const login = createAsyncThunk(
  "user/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authService.signIn(credentials);
      return response.data;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const register = createAsyncThunk(
  "user/register",
  async (
    userData: { firstName: string; lastName: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/users/register", userData);
      localStorage.setItem("user", JSON.stringify(response.data));
      return response.data.data;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const logout = createAsyncThunk("user/logout", async () => {
  localStorage.removeItem("user");
});

export const getUser = createAsyncThunk(
  "user/getUser",
  async () => {
    try {
      const user = localStorage.getItem("user");
      if (!user) {
        throw new Error("No authentication token found");
      }
      const response = await api.get("/users/profile", {
        headers: {
          Authorization: `Bearer ${JSON.parse(user).token}`,
        },
      });
      response.data.data.token = JSON.parse(user).token;
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem("user");
      }
      throw error;
    }
  }
);

export const updateUserPassword = createAsyncThunk(
  "user/updateUserPassword",
  async (creds: { newPassword: string; currentPassword: string }) => {
    try {
      const user = localStorage.getItem("user");
      if (!user) {
        throw new Error("No authentication token found");
      }
      const response = await api.post("/users/update-password", creds, {
        headers: {
          Authorization: `Bearer ${JSON.parse(user).token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Current password is incorrect");
        throw new Error("Current password is incorrect");
      }
      throw error;
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload as User;
        state.isAuthenticated = true;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Registration failed";
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        localStorage.removeItem("user");
        state.isAuthenticated = false;
      })
      // Get User
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "User fetch failed";
      });
  },
});

export const { clearError } = userSlice.actions;

export default userSlice.reducer;

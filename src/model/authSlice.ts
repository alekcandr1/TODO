import { setAppStatus } from "model/appSlice"
import { authAPI, AuthValues, STATUS_CODE } from "api/api"
import { handleServerAppError, handleServerNetworkError } from "utils/app-utils"
import { createSlice } from "@reduxjs/toolkit"
import { clearTasksAndTodolists } from "common/actions/common.actions"
import { createAppAsyncThunk } from "utils/createAppAsyncThunk"

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    isInitialized: false,
  },
  reducers: {
    // setIsLoggedIn: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
    //     state.isLoggedIn = action.payload.isLoggedIn
    // },
    // setIsInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
    //     state.isInitialized = action.payload.isInitialized
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn
      })
      .addCase(me.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn
        state.isInitialized = true
      })
  },
})

// thunks
export const login = createAppAsyncThunk<{ isLoggedIn: boolean }, { data: AuthValues }>(
  `${slice.name}/login`,
  async ({ data }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setAppStatus({ status: "loading" }))
      const res = await authAPI.login(data)
      if (res.data.resultCode === STATUS_CODE.SUCCESS) {
        dispatch(setAppStatus({ status: "succeeded" }))
        return { isLoggedIn: true }
      } else {
        handleServerAppError(res.data, dispatch)
        return rejectWithValue(null)
      }
    } catch (error: unknown) {
      handleServerNetworkError(error, dispatch)
      return rejectWithValue(null)
    }
  },
)

export const logout = createAppAsyncThunk<{ isLoggedIn: boolean }>(
  `${slice.name}/logout`,
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setAppStatus({ status: "loading" }))
      const res = await authAPI.logout()
      if (res.data.resultCode === STATUS_CODE.SUCCESS) {
        dispatch(setAppStatus({ status: "succeeded" }))
        dispatch(clearTasksAndTodolists())
        return { isLoggedIn: false }
      } else {
        handleServerAppError(res.data, dispatch)
        return rejectWithValue(null)
      }
    } catch (error: unknown) {
      handleServerNetworkError(error, dispatch)
      return rejectWithValue(null)
    }
  },
)

export const me = createAppAsyncThunk<{ isLoggedIn: boolean }>(
  `${slice.name}/me`,
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setAppStatus({ status: "loading" }))
      const res = await authAPI.me()
      dispatch(setAppStatus({ status: "succeeded" }))
      return { isLoggedIn: !!res.data.data.id }
    } catch (error: unknown) {
      handleServerNetworkError(error, dispatch)
      return rejectWithValue(null)
    }
  },
)

export const authReducer = slice.reducer
export const authThunks = { login, logout, me }

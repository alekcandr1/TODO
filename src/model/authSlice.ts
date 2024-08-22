import { setAppStatusAC } from "./app-reducer"
import { authAPI, AuthValues, STATUS_CODE } from "api/api"
import { handleServerAppError, handleServerNetworkError } from "utils/app-utils"
import { clearTodosAC } from "./todolists-reducer"

import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppThunk } from "model/store"

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    isInitialized: false,
  },
  reducers: {
    setIsLoggedIn: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
      state.isLoggedIn = action.payload.isLoggedIn
    },
    setIsInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
      state.isInitialized = action.payload.isInitialized
    },
  },
})

export const authReducer = slice.reducer
export const { setIsLoggedIn, setIsInitialized } = slice.actions

// thunks
export const loginTC =
  (data: AuthValues): AppThunk =>
  (dispatch) => {
    dispatch(setAppStatusAC("loading"))
    authAPI
      .login(data)
      .then((res) => {
        if (res.data.resultCode === STATUS_CODE.SUCCESS) {
          dispatch(setIsLoggedIn({ isLoggedIn: true }))
          dispatch(setAppStatusAC("succeeded"))
        } else {
          handleServerAppError(res.data, dispatch)
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch)
      })
  }
export const meTC = (): AppThunk => (dispatch) => {
  authAPI
    .me()
    .then((res) => {
      if (res.data.resultCode === STATUS_CODE.SUCCESS) {
        dispatch(setIsLoggedIn({ isLoggedIn: true }))
      } else {
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch)
    })
    .finally(() => {
      dispatch(setIsInitialized({ isInitialized: true }))
    })
}
export const logoutTC = (): AppThunk => (dispatch) => {
  dispatch(setAppStatusAC("loading"))
  authAPI
    .logout()
    .then((res) => {
      if (res.data.resultCode === STATUS_CODE.SUCCESS) {
        dispatch(setIsLoggedIn({ isLoggedIn: false }))
        dispatch(setAppStatusAC("succeeded"))
        dispatch(clearTodosAC())
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch)
    })
}

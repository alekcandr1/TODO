import { Dispatch } from "redux"
import { SetAppErrorType, setAppStatusAC, SetAppStatusType } from "./app-reducer"
import { authAPI, AuthValues, STATUS_CODE } from "../api/api"
import { handleServerAppError, handleServerNetworkError } from "../utils/app-utils"
import { clearTodosAC, ClearTodosType } from "./todolists-reducer"

const initialState = {
  isLoggedIn: false,
  isInitialized: false,
}
type InitialStateType = typeof initialState

export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
  switch (action.type) {
    case "auth/SET-IS-LOGGED-IN":
      return { ...state, isLoggedIn: action.value }
    case "auth/SET-IS-INITIALIZED":
      return { ...state, isInitialized: action.value }
    default:
      return state
  }
}
// actions
export const setIsLoggedInAC = (value: boolean) => ({ type: "auth/SET-IS-LOGGED-IN", value }) as const
export const setIsInitializedAC = (value: boolean) => ({ type: "auth/SET-IS-INITIALIZED", value }) as const

// thunks
export const loginTC = (data: AuthValues) => (dispatch: Dispatch<ActionsType>) => {
  dispatch(setAppStatusAC("loading"))
  authAPI
    .login(data)
    .then((res) => {
      if (res.data.resultCode === STATUS_CODE.SUCCESS) {
        dispatch(setIsLoggedInAC(true))
        dispatch(setAppStatusAC("succeeded"))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch)
    })
}
export const meTC = () => (dispatch: Dispatch) => {
  authAPI
    .me()
    .then((res) => {
      if (res.data.resultCode === STATUS_CODE.SUCCESS) {
        dispatch(setIsLoggedInAC(true))
      } else {
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch)
    })
    .finally(() => {
      dispatch(setIsInitializedAC(true))
    })
}
export const logoutTC = () => (dispatch: Dispatch<ActionsType>) => {
  dispatch(setAppStatusAC("loading"))
  authAPI
    .logout()
    .then((res) => {
      if (res.data.resultCode === STATUS_CODE.SUCCESS) {
        dispatch(setIsLoggedInAC(false))
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

// types
type ActionsType =
  | ReturnType<typeof setIsLoggedInAC>
  | ReturnType<typeof setIsInitializedAC>
  | SetAppStatusType
  | SetAppErrorType
  | ClearTodosType

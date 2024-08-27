import { AppRootStateType } from "model/store"

export const selectIsInitialized = (state: AppRootStateType) => state.auth.isInitialized
export const selectIsLoggedIn = (state: AppRootStateType) => state.auth.isLoggedIn

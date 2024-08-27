import { AppRootStateType } from "model/store"

export const selectorAppStatus = (state: AppRootStateType) => state.app.status
export const selectorAppError = (state: AppRootStateType) => state.app.error

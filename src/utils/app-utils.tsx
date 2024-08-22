import { setAppError, setAppStatus } from "model/appSlice"
import { Dispatch } from "redux"
import { ResponseType } from "api/api"

export const handleServerAppError = <T,>(data: ResponseType<T>, dispatch: Dispatch) => {
  if (data.messages.length) {
    dispatch(setAppError({ error: data.messages[0] }))
  } else {
    dispatch(setAppError({ error: "Some error occurred" }))
  }
  dispatch(setAppStatus({ status: "failed" }))
}

export const handleServerNetworkError = (error: { message: string }, dispatch: Dispatch) => {
  dispatch(setAppStatus({ status: "failed" }))
  dispatch(setAppError({ error: error.message }))
}

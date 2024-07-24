import { setAppErrorAC, setAppStatusAC } from '../model/app-reducer';
import { Dispatch } from 'redux';
import { ResponseType } from '../api/api'

export const handleServerAppError = <T, >( data: ResponseType<T>, dispatch: Dispatch ) => {

    if (data.messages.length) {
        dispatch(setAppErrorAC(data.messages[0]))
    } else {
        dispatch(setAppErrorAC('Some error occurred'))
    }
    dispatch(setAppStatusAC('failed'))
}

export const handleServerNetworkError = ( error: {message: string}, dispatch: Dispatch ) => {
    dispatch(setAppStatusAC('failed'))
    dispatch(setAppErrorAC(error.message))
}
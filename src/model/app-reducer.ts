export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as string | null
}

export const appReducer = ( state: InitialStateType = initialState, action: ActionsType ): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        default:
            return state
    }
}

// actions
export const setStatusAC = ( status: RequestStatusType ) => {
    return {type: 'APP/SET-STATUS', status} as const
}
export const setErrorAC = ( error: string | null ) => {
    return {type: 'APP/SET-ERROR', error} as const
}

//types
export type InitialStateType = typeof initialState

export type SetStatusType = ReturnType<typeof setStatusAC>
export type SetErrorType = ReturnType<typeof setErrorAC>
type ActionsType =
    | SetStatusType
    | SetErrorType

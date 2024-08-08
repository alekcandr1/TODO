import { AnyAction, applyMiddleware, combineReducers, legacy_createStore } from 'redux'
import { TasksActionsType, tasksReducer } from './task-reducer';
import { TodolistsActionsType, todolistsReducer } from './todolists-reducer'
import { thunk, ThunkAction, ThunkDispatch } from 'redux-thunk';
import { useDispatch } from 'react-redux';
import { appReducer } from './app-reducer';
import { authReducer } from './auth-reducer';

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
    app: appReducer,
    tasks: tasksReducer,
    todolists: todolistsReducer,
    auth: authReducer
})
export const store = legacy_createStore(rootReducer, applyMiddleware(thunk))

// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof rootReducer>

export type AppThunkDispatch = ThunkDispatch<AppRootStateType, any, AnyAction>
export const useAppDispatch = () => useDispatch<AppThunkDispatch>()

export type AppThunkType = TodolistsActionsType | TasksActionsType
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AppThunkType>

// @ts-ignore
window.store = store

import { combineReducers } from "redux"
import { TasksActionsType, tasksReducer } from "./task-reducer"
import { TodolistsActionsType, todolistsReducer } from "./todolists-reducer"
import { ThunkAction, ThunkDispatch } from "redux-thunk"
import { useDispatch } from "react-redux"
import { appReducer } from "model/appSlice"
import { authReducer } from "model/authSlice"
import { configureStore, UnknownAction } from "@reduxjs/toolkit"

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
  app: appReducer,
  tasks: tasksReducer,
  todolists: todolistsReducer,
  auth: authReducer,
})
// export const store = legacy_createStore(rootReducer, applyMiddleware(thunk))

export const store = configureStore({ reducer: rootReducer })

// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof store.getState>

export type AppDispatch = ThunkDispatch<AppRootStateType, any, UnknownAction>
export const useAppDispatch = () => useDispatch<AppDispatch>()

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, UnknownAction>

export type AppThunkType = TodolistsActionsType | TasksActionsType

// @ts-ignore
window.store = store

import { combineReducers } from "redux"
import { ThunkAction, ThunkDispatch } from "redux-thunk"
import { configureStore, UnknownAction } from "@reduxjs/toolkit"
import { useDispatch } from "react-redux"
import { appReducer } from "model/appSlice"
import { authReducer } from "model/authSlice"
import { tasksReducer } from "model/tasksSlice"
import { todosReducer } from "model/todolistsSlice"

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
  app: appReducer,
  tasks: tasksReducer,
  todolists: todosReducer,
  auth: authReducer,
})
// export const store = legacy_createStore(rootReducer, applyMiddleware(thunk))

export const store = configureStore({
  reducer: rootReducer,
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunkMiddleware),
})

// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof store.getState>

export type AppDispatch = ThunkDispatch<AppRootStateType, any, UnknownAction>
export const useAppDispatch = () => useDispatch<AppDispatch>()

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, UnknownAction>

// @ts-ignore
window.store = store

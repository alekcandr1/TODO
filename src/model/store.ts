import { AnyAction, applyMiddleware, combineReducers, legacy_createStore } from 'redux'
import { tasksReducer } from './task-reducer';
import { todolistsReducer } from './todolists-reducer'
import { thunk, ThunkDispatch } from 'redux-thunk';
import { useDispatch } from 'react-redux';

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer
})
export const store = legacy_createStore(rootReducer, applyMiddleware(thunk))

// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof rootReducer>

export type AppThunkDispatch = ThunkDispatch<AppRootStateType, any, AnyAction>
export const useAppDispatch = () => useDispatch<AppThunkDispatch>()


// @ts-ignore
window.store = store

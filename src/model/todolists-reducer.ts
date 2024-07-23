import { api, TodoListType } from '../api/api';
import { AppThunk } from './store';
import { RequestStatusType } from './app-reducer';

const initialState: TodoListDomainType[] = []

export const todolistsReducer = ( state = initialState, action: TodolistsActionsType ): TodoListDomainType[] => {
    switch (action.type) {
        case 'ADD-TODOLIST':
            return [...state, {...action.payload.list, filter: 'ALL', entityStatus: 'idle'}]
        case 'DELETE-TODOLIST':
            return state.filter(tl => tl.id !== action.payload.id)
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.payload.id ? {...tl, title: action.payload.title} : tl)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(tl => tl.id === action.payload.id ? {...tl, filter: action.payload.filter} : tl)
        case 'CHANGE-TODOLIST-ENTITY-STATUS':
            return state.map(tl => tl.id === action.payload.id ? {...tl, entityStatus: action.payload.status} : tl)
        case 'SET-TODOS':
            return action.todos.map(tl => ({...tl, filter: 'ALL', entityStatus: 'idle'}))
        default:
            return state
    }
}

//actions
export const deleteTodolistAC = ( id: string ) =>
    ({type: 'DELETE-TODOLIST', payload: {id}} as const)
export const addTodolistAC = ( list: TodoListType ) =>
    ({type: 'ADD-TODOLIST', payload: {list}} as const)
export const changeTodolistTitleAC = ( id: string, title: string ) =>
    ({type: 'CHANGE-TODOLIST-TITLE', payload: {id, title}} as const)
export const changeTodolistFilterAC = ( id: string, filter: FilterType ) =>
    ({type: 'CHANGE-TODOLIST-FILTER', payload: {id, filter}} as const)
export const changeTodolistStatusAC = ( id: string, status: RequestStatusType ) =>
    ({type: 'CHANGE-TODOLIST-ENTITY-STATUS', payload: {id, status}} as const)
export const setTodosAC = ( todos: TodoListType[] ) =>
    ({type: 'SET-TODOS', todos} as const)

// thunks
export const getTodosTC = (): AppThunk => async dispatch => {
    const res = await api.getTodos()
    dispatch(setTodosAC(res.data))
}
export const deleteTodoTC = ( listID: string ): AppThunk => async dispatch => {
    await api.deleteTodos(listID)
    dispatch(deleteTodolistAC(listID))
}
export const addTodoTC = ( title: string ): AppThunk => async dispatch => {
    const res = await api.addTodo(title)
    dispatch(addTodolistAC(res.data.data.item))
}
export const changeTodoTitleTC = ( listID: string, newTitle: string ): AppThunk => async ( dispatch ) => {
    await api.changeTodoTitle(listID, newTitle)
    dispatch(changeTodolistTitleAC(listID, newTitle))
}

// types
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type RemoveTodolistActionType = ReturnType<typeof deleteTodolistAC>
export type SetTodosType = ReturnType<typeof setTodosAC>
export type ChangeTodolistStatusType = ReturnType<typeof changeTodolistStatusAC>

export type TodolistsActionsType =
    | SetTodosType
    | RemoveTodolistActionType
    | AddTodolistActionType
    | ChangeTodolistStatusType
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>

export type TodoListDomainType = TodoListType & {
    filter: FilterType,
    entityStatus: RequestStatusType
}

export type FilterType = 'ALL' | 'ACTIVE' | 'COMPLETED'

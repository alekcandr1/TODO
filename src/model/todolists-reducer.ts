import { FilterType } from '../AppWithRedux'
import { api, TodoListType } from '../api/api';
import { AppThunk } from './store';

export type TodolistsActionsType =
    | ReturnType<typeof removeTodolistAC>
    | ReturnType<typeof addTodolistAC>
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | ReturnType<typeof setTodosAC>


export type TodoListDomainType = TodoListType & {
    filter: FilterType
}

const initialState: TodoListDomainType[] = []

export const todolistsReducer = ( state = initialState, action: TodolistsActionsType ): TodoListDomainType[] => {
    switch (action.type) {
        case 'ADD-TODOLIST': {
            return [
                ...state,
                {
                    id: action.payload.list.id,
                    title: action.payload.list.title,
                    filter: 'ALL',
                    addedDate: '',
                    order: 0
                }]
        }
        case 'REMOVE-TODOLIST': {
            return state.filter(list => list.id !== action.payload.id)
        }
        case 'CHANGE-TODOLIST-TITLE': {
            return state.map(list => list.id === action.payload.id ? {...list, title: action.payload.title} : list)
        }
        case 'CHANGE-TODOLIST-FILTER': {
            return state.map(list => list.id === action.payload.id ? {
                ...list,
                filter: action.payload.filter
            } : list)
        }
        case 'SET-TODOS': {
            return action.todos.map(el => ({...el, filter: 'ALL'}))
        }
        default:
            return state
    }
}


export const removeTodolistAC = ( todolistId: string ) => {
    return {type: 'REMOVE-TODOLIST', payload: {id: todolistId}} as const
}
export const addTodolistAC = ( list: TodoListType ) => {
    return {type: 'ADD-TODOLIST', payload: {list}} as const
}
export const changeTodolistTitleAC = ( listID: string, newTitle: string ) => {
    return {type: 'CHANGE-TODOLIST-TITLE', payload: {id: listID, title: newTitle}} as const
}
export const changeTodolistFilterAC = ( listID: string, newFilter: FilterType ) => {
    return {type: 'CHANGE-TODOLIST-FILTER', payload: {id: listID, filter: newFilter}} as const
}
export const setTodosAC = ( todos: TodoListType[] ) => {
    return {type: 'SET-TODOS', todos} as const
}

export const getTodosTC = (): AppThunk => async dispatch => {
    const res = await api.getTodos()
    dispatch(setTodosAC(res.data))
}
export const deleteTodoTC = ( listID: string ): AppThunk => async dispatch => {
    await api.deleteTodos(listID)
    dispatch(removeTodolistAC(listID))
}
export const addTodoTC = ( title: string ): AppThunk => async dispatch => {
    const res = await api.addTodo(title)
    dispatch(addTodolistAC(res.data.data.item))
}
export const changeTodoTitleTC = ( listID: string, newTitle: string ): AppThunk => async ( dispatch ) => {
    await api.changeTodoTitle(listID, newTitle)
    dispatch(changeTodolistTitleAC(listID, newTitle))
}


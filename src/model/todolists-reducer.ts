import { v1 } from 'uuid';
import { FilterType } from '../AppWithRedux'
import { Dispatch } from 'redux';
import { api, TodoListType } from '../api/api';

export type RemoveTodolistActionType = {
    type: 'REMOVE-TODOLIST'
    payload: {
        id: string
    }
}
export type AddTodolistActionType = {
    type: 'ADD-TODOLIST'
    payload: {
        list: TodoListType
    }
}
export type ChangeTodolistTitleActionType = {
    type: 'CHANGE-TODOLIST-TITLE'
    payload: {
        id: string
        title: string
    }
}
export type ChangeTodolistFilterActionType = {
    type: 'CHANGE-TODOLIST-FILTER'
    payload: {
        id: string
        filter: FilterType
    }
}
export type SetTodosType = ReturnType<typeof setTodosAC>

export type TodolistsActionsType =
    | RemoveTodolistActionType
    | AddTodolistActionType
    | ChangeTodolistTitleActionType
    | ChangeTodolistFilterActionType
    | SetTodosType


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


export const removeTodolistAC = ( todolistId: string ): RemoveTodolistActionType => {
    return {type: 'REMOVE-TODOLIST', payload: {id: todolistId}} as const
}

export const addTodolistAC = ( list: TodoListType ): AddTodolistActionType => {
    return {type: 'ADD-TODOLIST', payload: {list}} as const
}

export const changeTodolistTitleAC = ( listID: string, newTitle: string ): ChangeTodolistTitleActionType => {
    return {type: 'CHANGE-TODOLIST-TITLE', payload: {id: listID, title: newTitle}} as const
}

export const changeTodolistFilterAC = ( listID: string, newFilter: FilterType ): ChangeTodolistFilterActionType => {
    return {type: 'CHANGE-TODOLIST-FILTER', payload: {id: listID, filter: newFilter}} as const
}

export const setTodosAC = ( todos: TodoListType[] ) => {
    return {type: 'SET-TODOS', todos} as const
}

export const getTodosTC = () => {
    return ( dispatch: Dispatch ) => {
        api.getTodos().then(res => {
            dispatch(setTodosAC(res.data))
        })
    }
}
export const deleteTodoTC = ( listID: string ) => {
    return ( dispatch: Dispatch ) => {
        api.deleteTodos(listID).then(res => {
            dispatch(removeTodolistAC(listID))
        })
    }
}
export const addTodoTC = ( title: string ) => {
    return ( dispatch: Dispatch ) => {
        api.addTodo(title).then(res => {
            dispatch(addTodolistAC(res.data.data.item))
        })
    }
}
export const changeTodoTitleTC = ( listID: string, newTitle: string ) => {
    return ( dispatch: Dispatch ) => {
        api.changeTodoTitle(listID, newTitle).then(res => {
            dispatch(changeTodolistTitleAC(listID, newTitle))
        })
    }
}


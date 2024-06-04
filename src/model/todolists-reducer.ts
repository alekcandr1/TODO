import { v1 } from 'uuid';
import { FilterType, TodoListType } from '../AppWithRedux'

export type RemoveTodolistActionType = {
    type: 'REMOVE-TODOLIST'
    payload: {
        id: string
    }
}

export type AddTodolistActionType = {
    type: 'ADD-TODOLIST'
    payload: {
        title: string
        listID: string
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

export type TodolistsActionsType =
    | RemoveTodolistActionType
    | AddTodolistActionType
    | ChangeTodolistTitleActionType
    | ChangeTodolistFilterActionType

const initialState: TodoListType[] = []

export const todolistsReducer = ( state: TodoListType[] = initialState, action: TodolistsActionsType ): TodoListType[] => {
    switch (action.type) {
        case 'ADD-TODOLIST': {
            return [...state, {listID: action.payload.listID, title: action.payload.title, filter: 'ALL'}]
        }
        case 'REMOVE-TODOLIST': {
            return state.filter(list => list.listID !== action.payload.id)
        }
        case 'CHANGE-TODOLIST-TITLE': {
            return state.map(list => list.listID === action.payload.id ? {...list, title: action.payload.title} : list)
        }
        case 'CHANGE-TODOLIST-FILTER': {
            return state.map(list => list.listID === action.payload.id ? {...list, filter: action.payload.filter} : list)
        }
        default:
            return state
    }
}


export const removeTodolistAC = ( todolistId: string ): RemoveTodolistActionType => {
    return {type: 'REMOVE-TODOLIST', payload: {id: todolistId}} as const
}

export const addTodolistAC = ( title: string ): AddTodolistActionType => {
    return {type: 'ADD-TODOLIST', payload: {title: title, listID: v1()}} as const
}

export const changeTodolistTitleAC = (listID: string, newTitle: string): ChangeTodolistTitleActionType => {
    return {type: 'CHANGE-TODOLIST-TITLE', payload: {id: listID, title: newTitle}} as const
}

export const changeTodolistFilterAC = (listID: string, newFilter: FilterType): ChangeTodolistFilterActionType => {
    return {type: 'CHANGE-TODOLIST-FILTER', payload: {id: listID, filter: newFilter}} as const
}


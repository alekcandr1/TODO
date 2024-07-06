import { v1 } from 'uuid';
import {
    AddTodolistActionType,
    RemoveTodolistActionType, setTodosAC,
    SetTodosType
} from './todolists-reducer';
import { TasksType, TaskType } from '../AppWithRedux';
import { Dispatch } from 'redux';
import { api } from '../api/api';


const initialState: TasksType = {}

export type RemoveTaskType = ReturnType<typeof removeTaskAC>
export type AddTaskType = ReturnType<typeof addTaskAC>
export type ChangeTaskStatusType = ReturnType<typeof changeTaskStatusAC>
export type ChangeTaskTitleType = ReturnType<typeof changeTaskTitleAC>
export type SetTasksType = ReturnType<typeof setTasksAC>

export type TasksActionsType =
    | RemoveTaskType
    | AddTaskType
    | ChangeTaskStatusType
    | ChangeTaskTitleType
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodosType
    | SetTasksType

export const tasksReducer = ( state: TasksType = initialState, action: TasksActionsType ): TasksType => {
    switch (action.type) {
        case 'REMOVE-TASK':
            return {
                ...state,
                [action.payload.listID]: state[action.payload.listID].filter(
                    task => task.id !== action.payload.taskID
                )
            }
        case 'ADD-TASK':
            return {
                ...state,
                [action.payload.listID]:
                    [
                        {
                            id: v1(),
                            title: action.payload.title,
                            isDone: false
                        },
                        ...state[action.payload.listID]
                    ]
            }
        case 'CHANGE-TASK-STATUS':
            return {
                ...state,
                [action.payload.listID]: state[action.payload.listID].map(task => task.id === action.payload.taskID ? {
                    ...task,
                    isDone: action.payload.status
                } : task)
            }
        case 'CHANGE-TASK-TITLE':
            return {
                ...state,
                [action.payload.listID]: state[action.payload.listID].map(task => task.id === action.payload.taskID ? {
                    ...task,
                    title: action.payload.title
                } : task)
            }
        case 'ADD-TODOLIST':
            return {
                ...state,
                [action.payload.list.id]: []
            }
        case 'REMOVE-TODOLIST':
            let copyState = {...state}
            delete copyState[action.payload.id]
            return copyState
        case 'SET-TODOS': {
            const stateCopy = {...state}
            action.todos.forEach(tl => {
                stateCopy[tl.id] = []
            })
            return stateCopy
        }
        case 'SET-TASKS': {
            return {
                ...state,
                [action.listID]: action.tasks
            }
        }
        default:
            return state
    }
}

export const removeTaskAC = ( listID: string, taskID: string ) => {
    return {type: 'REMOVE-TASK', payload: {listID: listID, taskID: taskID}} as const
}
export const addTaskAC = ( listID: string, title: string ) => {
    return {type: 'ADD-TASK', payload: {listID: listID, title: title}} as const
}
export const changeTaskStatusAC = ( listID: string, taskID: string, status: boolean ) => {
    return {
        type: 'CHANGE-TASK-STATUS',
        payload: {
            listID: listID,
            taskID: taskID,
            status: status
        }
    } as const
}
export const changeTaskTitleAC = ( listID: string, taskID: string, title: string ) => {
    return {
        type: 'CHANGE-TASK-TITLE',
        payload: {
            listID: listID,
            taskID: taskID,
            title: title
        }
    } as const
}

export const setTasksAC = ( listID: string, tasks: TaskType[] ) => {
    return {type: 'SET-TASKS', listID, tasks} as const
}

export const getTasksTC = ( listID: string ) => {
    return ( dispatch: Dispatch ) => {
        api.getTasks(listID).then(res => {
            dispatch(setTasksAC(listID, res.data.items))
        })
    }
}
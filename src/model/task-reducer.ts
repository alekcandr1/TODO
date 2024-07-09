import {
    AddTodolistActionType,
    RemoveTodolistActionType, SetTodosType
} from './todolists-reducer';
import { Dispatch } from 'redux';
import { api, TasksType, TaskType, UpdateTaskModelType } from '../api/api';


const initialState: TasksType = {}

export type RemoveTaskType = ReturnType<typeof removeTaskAC>
export type AddTaskType = ReturnType<typeof addTaskAC>
export type ChangeTaskStatusType = ReturnType<typeof changeTaskStatusAC>
export type ChangeTaskTitleType = ReturnType<typeof changeTaskTitleAC>
export type SetTasksType = ReturnType<typeof setTasksAC>
export type changeTaskType = ReturnType<typeof changeTaskAC>

export type TasksActionsType =
    | RemoveTaskType
    | AddTaskType
    | ChangeTaskStatusType
    | ChangeTaskTitleType
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodosType
    | SetTasksType
    | changeTaskType

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
                [action.payload.listID]: [
                    action.payload.task,
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
                [action.payload.listID]:
                    state[action.payload.listID].map(task => task.id === action.payload.taskID ? {
                        ...task,
                        title: action.payload.title
                    } : task)
            }
        case 'CHANGE-TASK':
            return {
                ...state,
                [action.payload.listID]:
                    state[action.payload.listID].map(task => task.id === action.payload.taskID ? {
                        ...task,
                        title: action.payload.task.title,
                        status: action.payload.task.status
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
export const setTasksAC = ( listID: string, tasks: TaskType[] ) => {
    return {type: 'SET-TASKS', listID, tasks} as const
}
export const removeTaskAC = ( listID: string, taskID: string ) => {
    return {type: 'REMOVE-TASK', payload: {listID: listID, taskID: taskID}} as const
}
export const addTaskAC = ( listID: string, task: TaskType ) => {
    return {type: 'ADD-TASK', payload: {listID: listID, task}} as const
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
export const changeTaskAC = ( listID: string, taskID: string, task: TaskType ) => {
    return {
        type: 'CHANGE-TASK',
        payload: {
            listID,
            taskID,
            task
        }
    } as const
}

export const getTasksTC = ( listID: string ) => {
    return ( dispatch: Dispatch ) => {
        api.getTasks(listID).then(res => {
            dispatch(setTasksAC(listID, res.data.items))
        })
    }
}
export const addTaskTC = ( listID: string, title: string ) => {
    return ( dispatch: Dispatch ) => {
        api.addTask(listID, title).then(res => {
            dispatch(addTaskAC(listID, res.data.data.item))
        })
    }
}
export const deleteTaskTC = ( listID: string, taskID: string ) => {
    return ( dispatch: Dispatch ) => {
        api.deleteTask(listID, taskID).then(res => {
            dispatch(removeTaskAC(listID, taskID))
        })
    }
}
export const updateTaskTC = ( listID: string, taskID: string, model: UpdateTaskModelType ) => {
    return ( dispatch: Dispatch ) => {
        api.updateTask(listID, taskID, model).then(res => {
            dispatch(changeTaskAC(listID, taskID, res.data.data.item))
        })
    }
}

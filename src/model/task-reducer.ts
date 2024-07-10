import { AddTodolistActionType, RemoveTodolistActionType, SetTodosType } from './todolists-reducer';
import { api, TasksType, TaskType, UpdateTaskModelType } from '../api/api';
import { AppThunk } from './store';

const initialState: TasksType = {}

export const tasksReducer = ( state: TasksType = initialState, action: TasksActionsType ): TasksType => {
    switch (action.type) {
        case 'REMOVE-TASK':
            return {
                ...state,
                [action.payload.listID]: state[action.payload.listID].filter(t => t.id !== action.payload.taskID)
            }
        case 'ADD-TASK':
            return {
                ...state,
                [action.payload.listID]: [action.payload.task, ...state[action.payload.listID]]
            }
        case 'CHANGE-TASK':
            return {
                ...state,
                [action.payload.listID]:
                    state[action.payload.listID].map(t => t.id === action.payload.taskID ? {...action.payload.task} : t)
            }
        case 'ADD-TODOLIST':
            return {...state, [action.payload.list.id]: []}
        case 'DELETE-TODOLIST':
            const copyState = {...state}
            delete copyState[action.payload.id]
            return copyState
        case 'SET-TODOS':
            const stateCopy = {...state}
            action.todos.forEach(tl => {
                stateCopy[tl.id] = []
            })
            return stateCopy
        case 'SET-TASKS':
            return {...state, [action.listID]: action.tasks}
        default:
            return state
    }
}

// actions
export const setTasksAC = ( listID: string, tasks: TaskType[] ) =>
    ({type: 'SET-TASKS', listID, tasks} as const)
export const removeTaskAC = ( listID: string, taskID: string ) =>
    ({type: 'REMOVE-TASK', payload: {listID: listID, taskID: taskID}} as const)
export const addTaskAC = ( listID: string, task: TaskType ) =>
    ({type: 'ADD-TASK', payload: {listID: listID, task}} as const)
export const changeTaskAC = ( listID: string, taskID: string, task: TaskType ) =>
    ({type: 'CHANGE-TASK', payload: {listID, taskID, task}} as const)

// thunks
export const getTasksTC = ( listID: string ): AppThunk => dispatch => {
    api.getTasks(listID).then(res => {
        dispatch(setTasksAC(listID, res.data.items))
    })
}
export const addTaskTC = ( listID: string, title: string ): AppThunk => dispatch => {
    api.addTask(listID, title).then(res => {
        dispatch(addTaskAC(listID, res.data.data.item))
    })
}
export const deleteTaskTC = ( listID: string, taskID: string ): AppThunk => dispatch => {
    api.deleteTask(listID, taskID).then(res => {
        dispatch(removeTaskAC(listID, taskID))
    })
}
export const updateTaskTC = ( listID: string, taskID: string, model: UpdateTaskModelType ): AppThunk => dispatch => {
    api.updateTask(listID, taskID, model).then(res => {
        dispatch(changeTaskAC(listID, taskID, res.data.data.item))
    })
}

// types
export type TasksActionsType =
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodosType
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof setTasksAC>
    | ReturnType<typeof changeTaskAC>


import {
  AddTodolistActionType,
  changeTodolistStatusAC,
  ClearTodosType,
  RemoveTodolistActionType,
  SetTodosType,
} from "./todolists-reducer"
import { api, STATUS_CODE, TaskType, UpdateTaskModelType } from "../api/api"
import { AppThunk } from "./store"
import { RequestStatusType, SetAppErrorType, setAppStatusAC, SetAppStatusType } from "./app-reducer"
import { handleServerAppError, handleServerNetworkError } from "../utils/app-utils"

const initialState: TasksDomainType = {}

export const tasksReducer = (state: TasksDomainType = initialState, action: TasksActionsType): TasksDomainType => {
  switch (action.type) {
    case "REMOVE-TASK":
      return {
        ...state,
        [action.payload.listID]: state[action.payload.listID].filter((t) => t.id !== action.payload.taskID),
      }
    case "ADD-TASK":
      return {
        ...state,
        [action.payload.listID]: [{ ...action.payload.task, entityStatus: "idle" }, ...state[action.payload.listID]],
      }
    case "CHANGE-TASK":
      return {
        ...state,
        [action.payload.listID]: state[action.payload.listID].map((t) =>
          t.id === action.payload.taskID
            ? {
                ...action.payload.task,
                entityStatus: "idle",
              }
            : t,
        ),
      }
    case "ADD-TODOLIST":
      return { ...state, [action.payload.list.id]: [] }
    case "DELETE-TODOLIST":
      const copyState = { ...state }
      delete copyState[action.payload.id]
      return copyState
    case "SET-TODOS":
      const stateCopy = { ...state }
      action.todos.forEach((tl) => {
        stateCopy[tl.id] = []
      })
      return stateCopy
    case "SET-TASKS":
      return {
        ...state,
        [action.listID]: action.tasks.map((t) => t && { ...t, entityStatus: "idle" }),
      }
    case "CHANGE-TASK-ENTITY-STATUS":
      return {
        ...state,
        [action.payload.listID]: state[action.payload.listID].map((t) =>
          t.id === action.payload.taskID ? { ...t, entityStatus: action.payload.status } : t,
        ),
      }
    case "CLEAR-TODOS":
      return {}
    default:
      return state
  }
}

// actions
export const setTasksAC = (listID: string, tasks: TaskType[]) => ({ type: "SET-TASKS", listID, tasks }) as const
export const removeTaskAC = (listID: string, taskID: string) =>
  ({ type: "REMOVE-TASK", payload: { listID: listID, taskID: taskID } }) as const
export const addTaskAC = (listID: string, task: TaskType) =>
  ({ type: "ADD-TASK", payload: { listID: listID, task } }) as const
export const changeTaskAC = (listID: string, taskID: string, task: TaskType) =>
  ({ type: "CHANGE-TASK", payload: { listID, taskID, task } }) as const
export const changeTaskEntityStatusAC = (listID: string, taskID: string, status: RequestStatusType) =>
  ({ type: "CHANGE-TASK-ENTITY-STATUS", payload: { listID, taskID, status } }) as const

// thunks
export const getTasksTC =
  (listID: string): AppThunk =>
  (dispatch) => {
    dispatch(setAppStatusAC("loading"))
    api
      .getTasks(listID)
      .then((res) => {
        dispatch(setTasksAC(listID, res.data.items))
        dispatch(setAppStatusAC("succeeded"))
      })
      .catch((err) => {
        handleServerNetworkError(err, dispatch)
      })
  }
export const addTaskTC =
  (listID: string, title: string): AppThunk =>
  (dispatch) => {
    dispatch(setAppStatusAC("loading"))
    dispatch(changeTodolistStatusAC(listID, "loading"))
    api
      .addTask(listID, title)
      .then((res) => {
        if (res.data.resultCode === STATUS_CODE.SUCCESS) {
          dispatch(addTaskAC(listID, res.data.data.item))
          dispatch(setAppStatusAC("succeeded"))
        } else {
          handleServerAppError(res.data, dispatch)
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch)
      })
      .finally(() => {
        dispatch(changeTodolistStatusAC(listID, "idle"))
      })
  }
export const deleteTaskTC =
  (listID: string, taskID: string): AppThunk =>
  (dispatch) => {
    dispatch(setAppStatusAC("loading"))
    dispatch(changeTaskEntityStatusAC(listID, taskID, "loading"))
    api
      .deleteTask(listID, taskID)
      .then((res) => {
        if (res.data.resultCode === STATUS_CODE.SUCCESS) {
          dispatch(removeTaskAC(listID, taskID))
          dispatch(setAppStatusAC("succeeded"))
        } else {
          handleServerAppError(res.data, dispatch)
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch)
      })
      .finally(() => {
        dispatch(changeTaskEntityStatusAC(listID, taskID, "idle"))
      })
  }
export const updateTaskTC =
  (listID: string, taskID: string, model: UpdateTaskModelType): AppThunk =>
  (dispatch) => {
    dispatch(setAppStatusAC("loading"))
    dispatch(changeTaskEntityStatusAC(listID, taskID, "loading"))
    api
      .updateTask(listID, taskID, model)
      .then((res) => {
        if (res.data.resultCode === STATUS_CODE.SUCCESS) {
          dispatch(changeTaskAC(listID, taskID, res.data.data.item))
          dispatch(setAppStatusAC("succeeded"))
        } else {
          handleServerAppError(res.data, dispatch)
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch)
      })
      .finally(() => {
        dispatch(changeTaskEntityStatusAC(listID, taskID, "idle"))
      })
  }

// types
export type TaskDomainType = TaskType & {
  entityStatus: RequestStatusType
}
export type TasksDomainType = {
  [key: string]: TaskDomainType[]
}
export type TasksActionsType =
  | AddTodolistActionType
  | RemoveTodolistActionType
  | SetTodosType
  | ReturnType<typeof removeTaskAC>
  | ReturnType<typeof addTaskAC>
  | ReturnType<typeof setTasksAC>
  | ReturnType<typeof changeTaskAC>
  | ReturnType<typeof changeTaskEntityStatusAC>
  | SetAppStatusType
  | SetAppErrorType
  | ClearTodosType

import { addTodolist, changeTodolistStatus, clearTodos, deleteTodolist, setTodos } from "model/todolistsSlice"
import { api, STATUS_CODE, TaskType, UpdateTaskModelType } from "api/api"
import { AppThunk } from "./store"
import { RequestStatusType, setAppStatus } from "model/appSlice"
import { handleServerAppError, handleServerNetworkError } from "utils/app-utils"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const slice = createSlice({
  name: "tasks",
  initialState: {} as TasksDomainType,
  reducers: {
    removeTask: (state, action: PayloadAction<{ taskId: string; todolistId: string }>) => {
      const tasks = state[action.payload.todolistId]
      const index = tasks.findIndex((tl) => tl.id === action.payload.taskId)
      if (index !== -1) {
        tasks.splice(index, 1)
      }
    },
    changeTaskEntityStatus: (
      state,
      action: PayloadAction<{ listId: string; taskId: string; status: RequestStatusType }>,
    ) => {
      const tasks = state[action.payload.listId]
      const index = tasks.findIndex((tl) => tl.id === action.payload.taskId)
      if (index !== -1) {
        tasks[index].entityStatus = action.payload.status
      }
    },
    addTask: (state, action: PayloadAction<{ task: TaskType }>) => {
      const todolistId = action.payload.task.todoListId
      if (!state[todolistId]) {
        state[todolistId] = []
      }
      state[todolistId].unshift({ ...action.payload.task, entityStatus: "idle" })
    },

    updateTask: (state, action: PayloadAction<{ taskId: string; model: TaskType; todolistId: string }>) => {
      const tasks = state[action.payload.todolistId]
      const index = tasks.findIndex((tl) => tl.id === action.payload.taskId)
      if (index !== -1) {
        tasks[index] = { ...tasks[index], ...action.payload.model }
      }
    },
    setTasks: (state, action: PayloadAction<{ tasks: Array<TaskType>; todolistId: string }>) => {
      action.payload.tasks.forEach((t) => {
        state[action.payload.todolistId] = [...state[action.payload.todolistId], { ...t, entityStatus: "idle" }]
      })
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addTodolist, (state, action) => {
        state[action.payload.todolist.id] = []
      })
      .addCase(deleteTodolist, (state, action) => {
        delete state[action.payload.id]
      })
      .addCase(setTodos, (state, action) => {
        action.payload.todos.forEach((tl) => {
          state[tl.id] = []
        })
      })
      .addCase(clearTodos, (state, action: PayloadAction) => {
        return {}
      })
  },
})

// thunks
export const getTasksTC =
  (listID: string): AppThunk =>
  (dispatch) => {
    dispatch(setAppStatus({ status: "loading" }))
    api
      .getTasks(listID)
      .then((res) => {
        dispatch(setTasks({ tasks: res.data.items, todolistId: listID }))
        dispatch(setAppStatus({ status: "succeeded" }))
      })
      .catch((err) => {
        handleServerNetworkError(err, dispatch)
      })
  }
export const addTaskTC =
  (listID: string, title: string): AppThunk =>
  (dispatch) => {
    dispatch(setAppStatus({ status: "loading" }))
    dispatch(changeTodolistStatus({ id: listID, status: "loading" }))
    api
      .addTask(listID, title)
      .then((res) => {
        if (res.data.resultCode === STATUS_CODE.SUCCESS) {
          dispatch(addTask({ task: res.data.data.item }))
          dispatch(setAppStatus({ status: "succeeded" }))
        } else {
          handleServerAppError(res.data, dispatch)
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch)
      })
      .finally(() => {
        dispatch(changeTodolistStatus({ id: listID, status: "idle" }))
      })
  }
export const deleteTaskTC =
  (listId: string, taskId: string): AppThunk =>
  (dispatch) => {
    dispatch(setAppStatus({ status: "loading" }))
    dispatch(changeTaskEntityStatus({ listId, taskId, status: "loading" }))
    api
      .deleteTask(listId, taskId)
      .then((res) => {
        if (res.data.resultCode === STATUS_CODE.SUCCESS) {
          dispatch(removeTask({ taskId, todolistId: listId }))
          dispatch(setAppStatus({ status: "succeeded" }))
        } else {
          handleServerAppError(res.data, dispatch)
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch)
      })
      .finally(() => {
        dispatch(changeTaskEntityStatus({ listId, taskId, status: "idle" }))
      })
  }
export const updateTaskTC =
  (listId: string, taskId: string, model: UpdateTaskModelType): AppThunk =>
  (dispatch) => {
    dispatch(setAppStatus({ status: "loading" }))
    dispatch(changeTaskEntityStatus({ listId, taskId, status: "loading" }))
    api
      .updateTask(listId, taskId, model)
      .then((res) => {
        if (res.data.resultCode === STATUS_CODE.SUCCESS) {
          dispatch(updateTask({ taskId, model: res.data.data.item, todolistId: listId }))
          dispatch(setAppStatus({ status: "succeeded" }))
        } else {
          handleServerAppError(res.data, dispatch)
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch)
      })
      .finally(() => {
        dispatch(changeTaskEntityStatus({ listId, taskId, status: "idle" }))
      })
  }

// types
export type TaskDomainType = TaskType & {
  entityStatus: RequestStatusType
}
export type TasksDomainType = {
  [key: string]: TaskDomainType[]
}

export const tasksReducer = slice.reducer
export const { addTask, setTasks, updateTask, removeTask, changeTaskEntityStatus } = slice.actions

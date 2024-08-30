import { addTodolist, changeTodolistStatus, deleteTodolist, setTodos } from "model/todolistsSlice"
import { api, STATUS_CODE, TaskType, UpdateTaskModelType } from "api/api"
import { AppThunk } from "./store"
import { RequestStatusType, setAppStatus } from "model/appSlice"
import { handleServerAppError, handleServerNetworkError } from "utils/app-utils"
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { clearTasksAndTodolists } from "common/actions/common.actions"

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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.fulfilled, (state, action) => {
        action.payload.tasks.forEach((t) => {
          state[action.payload.todolistId] = [
            ...state[action.payload.todolistId],
            {
              ...t,
              entityStatus: "idle",
            },
          ]
        })
      })
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
      .addCase(clearTasksAndTodolists, () => {
        return {}
      })
  },
})

// thunks
export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async (todolistId: string, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI
  try {
    dispatch(setAppStatus({ status: "loading" }))
    const res = await api.getTasks(todolistId)
    const tasks = res.data.items
    dispatch(setAppStatus({ status: "succeeded" }))
    return { tasks, todolistId }
  } catch (error: any) {
    return rejectWithValue(error)
  }
})

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
export const { addTask, updateTask, removeTask, changeTaskEntityStatus } = slice.actions
export const tasksThunks = { fetchTasks }

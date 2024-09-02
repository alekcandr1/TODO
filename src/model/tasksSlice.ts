import { addTodolist, changeTodolistStatus, deleteTodolist, setTodos } from "model/todolistsSlice"
import { addTaskArg, api, STATUS_CODE, TaskType, updateTaskArg, UpdateTaskModelType } from "api/api"
import { AppThunk } from "./store"
import { RequestStatusType, setAppStatus } from "model/appSlice"
import { handleServerAppError, handleServerNetworkError } from "utils/app-utils"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { clearTasksAndTodolists } from "common/actions/common.actions"
import { createAppAsyncThunk } from "utils/createAppAsyncThunk"

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
      action: PayloadAction<{ todolistId: string; taskId: string; status: RequestStatusType }>,
    ) => {
      const tasks = state[action.payload.todolistId]
      const index = tasks.findIndex((tl) => tl.id === action.payload.taskId)
      if (index !== -1) {
        tasks[index].entityStatus = action.payload.status
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
      .addCase(addTask.fulfilled, (state, action) => {
        const todolistId = action.payload.task.todoListId
        if (!state[todolistId]) {
          state[todolistId] = []
        }
        state[todolistId].unshift({ ...action.payload.task, entityStatus: "idle" })
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId]
        const index = tasks.findIndex((tl) => tl.id === action.payload.taskId)
        if (index !== -1) {
          tasks.splice(index, 1)
        }
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId]
        const index = tasks.findIndex((tl) => tl.id === action.payload.taskId)
        if (index !== -1) {
          tasks[index] = { ...tasks[index], ...action.payload.model }
        }
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
export const fetchTasks = createAppAsyncThunk<
  {
    tasks: TaskType[]
    todolistId: string
  },
  string
>(`${slice.name}/fetchTasks`, async (todolistId: string, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI
  try {
    dispatch(setAppStatus({ status: "loading" }))
    const res = await api.getTasks(todolistId)
    const tasks = res.data.items
    dispatch(setAppStatus({ status: "succeeded" }))
    return { tasks, todolistId }
  } catch (error: any) {
    handleServerNetworkError(error, dispatch)
    return rejectWithValue(null)
  }
})

export const addTask = createAppAsyncThunk<
  {
    task: TaskType
  },
  addTaskArg
>(`${slice.name}/addTask`, async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI
  try {
    dispatch(setAppStatus({ status: "loading" }))
    const res = await api.addTask(arg)
    if (res.data.resultCode === STATUS_CODE.SUCCESS) {
      dispatch(setAppStatus({ status: "succeeded" }))
      return { task: res.data.data.item }
    } else {
      handleServerAppError(res.data, dispatch)
      return rejectWithValue(null)
    }
  } catch (error: unknown) {
    handleServerNetworkError(error, dispatch)
    return rejectWithValue(null)
  }
})

export const updateTask = createAppAsyncThunk<updateTaskArg, updateTaskArg>(
  `${slice.name}/updateTask`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue, getState } = thunkAPI
    try {
      const state = getState()
      const task = state.tasks[arg.todolistId].find((t) => t.id === arg.taskId)
      if (!task) {
        console.warn("task not found in the state")
        return rejectWithValue(null)
      }

      const apiModel: UpdateTaskModelType = {
        deadline: task.deadline,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
        title: task.title,
        status: task.status,
        ...arg.model,
      }

      const res = await api.updateTask(arg.todolistId, arg.taskId, apiModel)
      if (res.data.resultCode === STATUS_CODE.SUCCESS) {
        return arg
      } else {
        handleServerAppError(res.data, dispatch)
        return rejectWithValue(null)
      }
    } catch (error: unknown) {
      handleServerNetworkError(error, dispatch)
      return rejectWithValue(null)
    }
  },
)

export const deleteTask = createAppAsyncThunk<
  { todolistId: string; taskId: string },
  { todolistId: string; taskId: string }
>(`${slice.name}/deleteTask`, async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI
  try {
    dispatch(setAppStatus({ status: "loading" }))
    const res = await api.deleteTask(arg)
    if (res.data.resultCode === STATUS_CODE.SUCCESS) {
      dispatch(setAppStatus({ status: "succeeded" }))
      return arg
    } else {
      handleServerAppError(res.data, dispatch)
      return rejectWithValue(null)
    }
  } catch (error: unknown) {
    handleServerNetworkError(error, dispatch)
    return rejectWithValue(null)
  }
})

// export const deleteTask =
//   (todolistId: string, taskId: string): AppThunk =>
//   (dispatch) => {
//     dispatch(setAppStatus({ status: "loading" }))
//     dispatch(changeTaskEntityStatus({ todolistId, taskId, status: "loading" }))
//     api
//       .deleteTask(todolistId, taskId)
//       .then((res) => {
//         if (res.data.resultCode === STATUS_CODE.SUCCESS) {
//           dispatch(removeTask({ taskId, todolistId: todolistId }))
//           dispatch(setAppStatus({ status: "succeeded" }))
//         } else {
//           handleServerAppError(res.data, dispatch)
//         }
//       })
//       .catch((error) => {
//         handleServerNetworkError(error, dispatch)
//       })
//       .finally(() => {
//         dispatch(changeTaskEntityStatus({ todolistId, taskId, status: "idle" }))
//       })
//   }

// types
export type TaskDomainType = TaskType & {
  entityStatus: RequestStatusType
}
export type TasksDomainType = {
  [key: string]: TaskDomainType[]
}

export const tasksReducer = slice.reducer
export const tasksThunks = { fetchTasks, addTask, updateTask }
export const { removeTask, changeTaskEntityStatus } = slice.actions

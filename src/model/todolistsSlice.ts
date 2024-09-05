import { api, STATUS_CODE, TodoListType } from "api/api"
import { RequestStatusType, setAppStatus } from "model/appSlice"
import { handleServerAppError, handleServerNetworkError } from "utils/app-utils"
import { fetchTasks } from "model/tasksSlice"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { clearTasksAndTodolists } from "common/actions/common.actions"
import { createAppAsyncThunk } from "utils/createAppAsyncThunk"

const slice = createSlice({
  name: "todos",
  initialState: [] as TodoListDomainType[],
  reducers: {
    changeTodolistStatus: (state, action: PayloadAction<{ todolistId: string; status: RequestStatusType }>) => {
      const index = state.findIndex((tl) => tl.id === action.payload.todolistId)
      if (index !== -1) {
        state[index].entityStatus = action.payload.status
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(clearTasksAndTodolists, () => {
        return []
      })
      .addCase(addTodolist.fulfilled, (state, action) => {
        state.unshift({ ...action.payload.todolist, filter: "ALL", entityStatus: "idle" })
      })
      .addCase(fetchTodolists.fulfilled, (state, action) => {
        action.payload.todolists.forEach((tl) => {
          state.push({ ...tl, filter: "ALL", entityStatus: "idle" })
        })
      })
      .addCase(deleteTodolist.fulfilled, (state, action) => {
        const index = state.findIndex((tl) => tl.id === action.payload.todolistId)
        if (index !== -1) {
          state.splice(index, 1)
        }
      })
      .addCase(changeTodolistTitle.fulfilled, (state, action) => {
        const index = state.findIndex((tl) => tl.id === action.payload.todolistId)
        if (index !== -1) {
          state[index].title = action.payload.title
        }
      })
      .addCase(changeTodolistFilter.fulfilled, (state, action) => {
        const index = state.findIndex((tl) => tl.id === action.payload.todolistId)
        if (index !== -1) {
          state[index].filter = action.payload.filter
        }
      })
  },
})

// thunks

export const fetchTodolists = createAppAsyncThunk<{ todolists: TodoListType[] }>(
  `${slice.name}/fetchTodolists`,
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setAppStatus({ status: "loading" }))
      const res = await api.getTodos()

      res.data.forEach((tl) => {
        dispatch(fetchTasks(tl.id))
      })
      dispatch(setAppStatus({ status: "succeeded" }))
      return { todolists: res.data }
    } catch (error: unknown) {
      handleServerNetworkError(error, dispatch)
      return rejectWithValue(null)
    } finally {
      dispatch(setAppStatus({ status: "idle" }))
    }
  },
)

export const deleteTodolist = createAppAsyncThunk<{ todolistId: string }, { todolistId: string }>(
  `${slice.name}/deleteTodolist`,
  async ({ todolistId }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setAppStatus({ status: "loading" }))
      dispatch(changeTodolistStatus({ todolistId, status: "loading" }))
      const res = await api.deleteTodos(todolistId)

      if (res.data.resultCode === STATUS_CODE.SUCCESS) {
        dispatch(setAppStatus({ status: "succeeded" }))
        return { todolistId }
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

export const addTodolist = createAppAsyncThunk<{ todolist: TodoListType }, { title: string }>(
  `${slice.name}/addTodolist`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    try {
      dispatch(setAppStatus({ status: "loading" }))
      const res = await api.addTodo(arg.title)

      if (res.data.resultCode === STATUS_CODE.SUCCESS) {
        dispatch(setAppStatus({ status: "succeeded" }))
        return {
          todolist: res.data.data.item,
        }
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
export const changeTodolistTitle = createAppAsyncThunk<
  { todolistId: string; title: string },
  { todolistId: string; title: string }
>(`${slice.name}/changeTodolistTitle`, async ({ todolistId, title }, { dispatch, rejectWithValue }) => {
  try {
    dispatch(setAppStatus({ status: "loading" }))
    dispatch(changeTodolistStatus({ todolistId, status: "loading" }))
    const res = await api.changeTodoTitle(todolistId, title)

    if (res.data.resultCode === STATUS_CODE.SUCCESS) {
      dispatch(setAppStatus({ status: "succeeded" }))
      return { todolistId, title }
    } else {
      handleServerAppError(res.data, dispatch)
      return rejectWithValue(null)
    }
  } catch (error: unknown) {
    handleServerNetworkError(error, dispatch)
    return rejectWithValue(null)
  } finally {
    dispatch(changeTodolistStatus({ todolistId, status: "idle" }))
  }
})
export const changeTodolistFilter = createAppAsyncThunk<
  { todolistId: string; filter: FilterType },
  { todolistId: string; filter: FilterType }
>(`${slice.name}/changeTodolistFilter`, async ({ todolistId, filter }, { dispatch, rejectWithValue }) => {
  try {
    dispatch(setAppStatus({ status: "loading" }))
    dispatch(changeTodolistStatus({ todolistId, status: "loading" }))
    const res = await api.changeTodoTitle(todolistId, filter)

    if (res.data.resultCode === STATUS_CODE.SUCCESS) {
      dispatch(setAppStatus({ status: "succeeded" }))
      return { todolistId, filter }
    } else {
      handleServerAppError(res.data, dispatch)
      return rejectWithValue(null)
    }
  } catch (error: unknown) {
    handleServerNetworkError(error, dispatch)
    return rejectWithValue(null)
  } finally {
    dispatch(changeTodolistStatus({ todolistId, status: "idle" }))
  }
})

export const todosReducer = slice.reducer
export const tasksThunks = { addTodolist, fetchTodolists, deleteTodolist, changeTodolistTitle, changeTodolistFilter }
export const { changeTodolistStatus } = slice.actions

//types
export type TodoListDomainType = TodoListType & {
  filter: FilterType
  entityStatus: RequestStatusType
}
export type FilterType = "ALL" | "ACTIVE" | "COMPLETED"

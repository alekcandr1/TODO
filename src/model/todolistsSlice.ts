import { api, ErrorType, STATUS_CODE, TodoListType } from "api/api"
import { AppThunk } from "./store"
import { RequestStatusType, setAppStatus } from "model/appSlice"
import { handleServerAppError, handleServerNetworkError } from "utils/app-utils"
import axios from "axios"
import { fetchTasks } from "model/tasksSlice"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { clearTasksAndTodolists } from "common/actions/common.actions"

const slice = createSlice({
  name: "todos",
  initialState: [] as TodoListDomainType[],
  reducers: {
    addTodolist: (state, action: PayloadAction<{ todolist: TodoListType }>) => {
      state.unshift({ ...action.payload.todolist, filter: "ALL", entityStatus: "idle" })
    },
    deleteTodolist: (state, action: PayloadAction<{ id: string }>) => {
      const index = state.findIndex((tl) => tl.id === action.payload.id)
      if (index !== -1) {
        state.splice(index, 1)
      }
    },
    changeTodolistTitle: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const index = state.findIndex((tl) => tl.id === action.payload.id)
      if (index !== -1) {
        state[index].title = action.payload.title
      }
    },
    changeTodolistFilter: (state, action: PayloadAction<{ id: string; filter: FilterType }>) => {
      const index = state.findIndex((tl) => tl.id === action.payload.id)
      if (index !== -1) {
        state[index].filter = action.payload.filter
      }
    },
    changeTodolistStatus: (state, action: PayloadAction<{ id: string; status: RequestStatusType }>) => {
      const index = state.findIndex((tl) => tl.id === action.payload.id)
      if (index !== -1) {
        state[index].entityStatus = action.payload.status
      }
    },
    setTodos: (state, action: PayloadAction<{ todos: TodoListType[] }>) => {
      action.payload.todos.forEach((tl) => {
        state.push({ ...tl, filter: "ALL", entityStatus: "idle" })
      })
    },
  },
  extraReducers: (builder) => {
    builder.addCase(clearTasksAndTodolists, () => {
      return []
    })
  },
})

export const todosReducer = slice.reducer
export const {
  changeTodolistStatus,
  changeTodolistFilter,
  changeTodolistTitle,
  deleteTodolist,
  setTodos,
  addTodolist,
} = slice.actions

// thunks
export const getTodosTC = (): AppThunk => async (dispatch) => {
  try {
    dispatch(setAppStatus({ status: "loading" }))
    const res = await api.getTodos()
    dispatch(setTodos({ todos: res.data }))
    res.data.forEach((tl) => {
      dispatch(fetchTasks(tl.id))
    })
  } catch (e: unknown) {
    if (axios.isAxiosError<ErrorType>(e) && e.response?.data.messages[0]?.message) {
      handleServerNetworkError({ message: e.response.data.messages[0].message }, dispatch)
    } else {
      handleServerNetworkError({ message: (e as Error).message }, dispatch)
    }
  }
}
export const deleteTodoTC =
  (listID: string): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(setAppStatus({ status: "loading" }))
      dispatch(changeTodolistStatus({ id: listID, status: "loading" }))
      const res = await api.deleteTodos(listID)

      if (res.data.resultCode === STATUS_CODE.SUCCESS) {
        dispatch(deleteTodolist({ id: listID }))
        dispatch(setAppStatus({ status: "succeeded" }))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    } catch (e: unknown) {
      if (axios.isAxiosError<ErrorType>(e) && e.response?.data.messages[0]?.message) {
        handleServerNetworkError({ message: e.response.data.messages[0].message }, dispatch)
      } else {
        handleServerNetworkError({ message: (e as Error).message }, dispatch)
      }
    } finally {
      dispatch(changeTodolistStatus({ id: listID, status: "idle" }))
    }
  }
export const addTodoTC =
  (title: string): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(setAppStatus({ status: "loading" }))
      const res = await api.addTodo(title)

      if (res.data.resultCode === STATUS_CODE.SUCCESS) {
        dispatch(addTodolist({ todolist: res.data.data.item }))
        dispatch(setAppStatus({ status: "succeeded" }))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    } catch (e: unknown) {
      if (axios.isAxiosError<ErrorType>(e) && e.response?.data.messages[0]?.message) {
        handleServerNetworkError({ message: e.response.data.messages[0].message }, dispatch)
      } else {
        handleServerNetworkError({ message: (e as Error).message }, dispatch)
      }
    }
  }
export const changeTodoTitleTC =
  (listID: string, newTitle: string): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(setAppStatus({ status: "loading" }))
      dispatch(changeTodolistStatus({ id: listID, status: "loading" }))
      const res = await api.changeTodoTitle(listID, newTitle)

      if (res.data.resultCode === STATUS_CODE.SUCCESS) {
        dispatch(changeTodolistTitle({ id: listID, title: newTitle }))
        dispatch(setAppStatus({ status: "succeeded" }))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    } catch (e: unknown) {
      if (axios.isAxiosError<ErrorType>(e) && e.response?.data.messages[0]?.message) {
        handleServerNetworkError({ message: e.response.data.messages[0].message }, dispatch)
      } else {
        handleServerNetworkError({ message: (e as Error).message }, dispatch)
      }
    } finally {
      dispatch(changeTodolistStatus({ id: listID, status: "idle" }))
    }
  }

//types
export type TodoListDomainType = TodoListType & {
  filter: FilterType
  entityStatus: RequestStatusType
}
export type FilterType = "ALL" | "ACTIVE" | "COMPLETED"

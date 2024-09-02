import axios, { AxiosResponse } from "axios"

const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1",
  withCredentials: true,
  headers: {
    "API-KEY": "78c0a0ee-da0b-4710-ac11-ab8b526808e2",
  },
})

export enum STATUS_CODE {
  SUCCESS = 0,
  ERROR = 1,
  RECAPTCHA_ERROR = 10,
}

// api

export type AuthValues = {
  email: string
  password: string
  rememberMe?: boolean
  captcha?: boolean
}
export type MeType = {
  id: number
  email: string
  login: string
}

export const authAPI = {
  login: (values: AuthValues) => {
    return instance.post<ResponseType<{ userId: number }>>("/auth/login", values)
  },
  logout: () => {
    return instance.delete<ResponseType>("/auth/login")
  },
  me: () => {
    return instance.get<ResponseType<MeType>>("/auth/me")
  },
}

export const api = {
  getTodos: () => {
    return instance.get<TodoListType[]>("/todo-lists")
  },
  deleteTodos: (listID: string) => {
    return instance.delete<ResponseType>(`/todo-lists/${listID}`)
  },
  addTodo: (title: string) => {
    return instance.post<ResponseType<{ item: TodoListType }>>("/todo-lists/", { title })
  },
  changeTodoTitle: (listID: string, newTitle: string) => {
    return instance.put<ResponseType>(`/todo-lists/${listID}`, { title: newTitle })
  },

  getTasks: (listID: string) => {
    return instance.get<GetTasksResponse>(`/todo-lists/${listID}/tasks`)
  },
  addTask: (arg: addTaskArg) => {
    const { todolistId, taskTitle } = arg
    return instance.post<ResponseType<{ item: TaskType }>>(`/todo-lists/${todolistId}/tasks`, { title: taskTitle })
  },
  deleteTask: (arg: { todolistId: string; taskId: string }) => {
    const { todolistId, taskId } = arg
    return instance.delete<ResponseType>(`/todo-lists/${todolistId}/tasks/${taskId}`)
  },
  updateTask: (todolistId: string, taskId: string, model: UpdateTaskModelType) => {
    return instance.put<
      ResponseType<{ item: TaskType }>,
      AxiosResponse<
        ResponseType<{
          item: TaskType
        }>
      >
    >(`/todo-lists/${todolistId}/tasks/${taskId}`, model)
  },
}

//types
export type ResponseType<T = {}> = {
  data: T
  resultCode: number
  messages: string[]
  fieldsErrors: string[]
}
export type TodoListType = {
  id: string
  title: string
  addedDate: string
  order: number
}

export enum TaskStatuses {
  New = 0,
  InProgress = 1,
  Completed = 2,
  Draft = 3,
}

export enum TaskPriorities {
  Low = 0,
  Middle = 1,
  Hi = 2,
  Urgently = 3,
  Later = 4,
}

export type TaskType = {
  description: string
  title: string
  status: TaskStatuses
  priority: TaskPriorities
  startDate: string
  deadline: string
  id: string
  todoListId: string
  order: number
  addedDate: string
}
export type UpdateTaskModelType = {
  title?: string
  description?: string
  status?: TaskStatuses
  priority?: TaskPriorities
  startDate?: string
  deadline?: string
}
export type TasksType = {
  [key: string]: TaskType[]
}
type GetTasksResponse = {
  error: string | null
  totalCount: number
  items: TaskType[]
}
export type ErrorType = {
  statusCode: number
  messages: [
    {
      message: string
      field: string
    },
  ]
  error: string
}
export type addTaskArg = {
  todolistId: string
  taskTitle: string
}

export type updateTaskArg = {
  todolistId: string
  taskId: string
  model: UpdateTaskModelType
}

export type LoginParamsType = {
  email: string
  password: string
  rememberMe: boolean
  captcha?: string
}

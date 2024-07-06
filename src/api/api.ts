import axios from 'axios';
import { TaskType } from '../AppWithRedux';

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1',
    withCredentials: true,
    headers: {
        'API-KEY': '78c0a0ee-da0b-4710-ac11-ab8b526808e2'
    }
})

type ResponseType<T = {}> = {
    data: T
    resultCode: number
    messages: string[],
    fieldsErrors: string[]
}
export type TodoListType = {
    id: string,
    title: string,
    addedDate: string,
    order: number
}

type GetTasksResponse = {
    error: string | null
    totalCount: number
    items: TaskType[]
}

export const api = {
    getTodos: () => {
        return instance.get<TodoListType[]>('/todo-lists');
    },
    deleteTodos: ( listID: string ) => {
        return instance.delete<ResponseType>(`/todo-lists/${ listID }`)
    },
    addTodo: ( title: string ) => {
        return instance.post<ResponseType<{item: TodoListType}>>('/todo-lists/', {title})
    },
    changeTodoTitle: ( listID: string, newTitle: string ) => {
        return instance.put<ResponseType>(`/todo-lists/${ listID }`, {title: newTitle})
    },
    getTasks: ( listID: string ) => {
        return instance.get<GetTasksResponse>(`/todo-lists/${ listID }/tasks`)
    },
}
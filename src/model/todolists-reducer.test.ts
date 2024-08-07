import {
    addTodolistAC,
    changeTodolistFilterAC,
    changeTodolistTitleAC,
    deleteTodolistAC, TodoListDomainType,
    todolistsReducer
} from './todolists-reducer'
import { v1 } from 'uuid'

let todolistId1: string
let todolistId2: string
let startState: TodoListDomainType[]

beforeEach(() => {
    todolistId1 = v1()
    todolistId2 = v1()

    startState = [
        {id: todolistId1, title: 'What to learn', addedDate: 'null', order: 1, filter: 'ALL', entityStatus: 'idle'},
        {id: todolistId2, title: 'What to buy', addedDate: 'null', order: 1, filter: 'ALL', entityStatus: 'idle'},
    ]
})

test('correct todolist should be removed', () => {

    const endState = todolistsReducer(startState, deleteTodolistAC(todolistId1))

    expect(endState.length).toBe(1)
    expect(endState[0].id).toBe(todolistId2)

})

test('correct todolist should be added', () => {

    const title = 'New todolist'
    const endState = todolistsReducer(startState, addTodolistAC({
        id: v1(),
        title,
        addedDate: '',
        order: 0
    }))

    expect(endState.length).toBe(3)
    expect(endState[2].title).toBe(title)

})

test('correct todolist should change its name', () => {

    const newTitle = 'New title'
    const endState = todolistsReducer(startState, changeTodolistTitleAC(todolistId2, newTitle))

    expect(endState[0].title).toBe('What to learn')
    expect(endState[1].title).toBe(newTitle)
})

test('correct filter of todolist should be changed', () => {

    const endState = todolistsReducer(startState, changeTodolistFilterAC(todolistId2, 'COMPLETED'))

    expect(endState[0].filter).toBe('ALL')
    expect(endState[1].filter).toBe('COMPLETED')
})
import {
    addTodolistAC,
    changeTodolistFilterAC,
    changeTodolistTitleAC,
    removeTodolistAC,
    todolistsReducer
} from './todolists-reducer'
import { v1 } from 'uuid'
import { TodoListType } from '../AppWithRedux'

let todolistId1: string
let todolistId2: string
let startState: TodoListType[]

beforeEach(()=>{
    todolistId1 = v1()
    todolistId2 = v1()

    startState = [
        { listID: todolistId1, title: 'What to learn', filter: 'ALL' },
        { listID: todolistId2, title: 'What to buy', filter: 'ALL' },
    ]
})

test('correct todolist should be removed', ()=>{

    const endState = todolistsReducer(startState, removeTodolistAC(todolistId1))

    expect(endState.length).toBe(1)
    expect(endState[0].listID).toBe(todolistId2)

})

test('correct todolist should be added', () => {

    const title = 'New todolist'
    const endState = todolistsReducer(startState, addTodolistAC(title))

    //3

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
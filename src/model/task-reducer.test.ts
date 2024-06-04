import { addTodolistAC } from './todolists-reducer';
import { v1 } from 'uuid';
import { addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer } from './task-reducer';
import { TasksType } from '../AppWithRedux';

let startState: TasksType
let todolistID1: string
let todolistID2: string

beforeEach(()=>{
    todolistID1 = v1()
    todolistID2 = v1()
    startState = {
        [todolistID1]: [
            {id: '1', title: 'HTML&CSS', isDone: true},
            {id: '2', title: 'JS', isDone: true},
            {id: '3', title: 'React', isDone: false},
        ],
        [todolistID2]: [
            {id: '1', title: 'Terminator', isDone: true},
            {id: '2', title: 'The Godfather', isDone: false},
            {id: '3', title: 'Star Wars', isDone: false},
        ],
    }
})

test('remove correct task', () => {

    const endState = tasksReducer(startState, removeTaskAC(todolistID2, '2'))

    expect(endState[todolistID2][1].id).toBe('3')

})

test('correct task should be added to correct array', () => {

    const action = addTaskAC(todolistID2,'juce')

    const endState = tasksReducer(startState, action)

    expect(endState[todolistID1].length).toBe(3)
    expect(endState[todolistID2].length).toBe(4)
    expect(endState[todolistID2][0].id).toBeDefined()
    expect(endState[todolistID2][0].title).toBe('juce')
    expect(endState[todolistID2][0].isDone).toBe(false)
})

test('status of specified task should be changed', () => {

    const action = changeTaskStatusAC(todolistID2,'2', false)

    const endState = tasksReducer(startState, action)

    expect(endState[todolistID2][1].isDone).toBe(false)
    expect(endState[todolistID1][1].isDone).toBe(true)
})

test('title of specified task should be changed', () => {

    const action = changeTaskTitleAC(todolistID2,'2','juice')
    const endState = tasksReducer(startState, action)

    expect(endState[todolistID2][1].title).toBe('juice')
})

test('new array should be added when new todolist is added', () => {

    const action = addTodolistAC('new todolist')

    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState)
    const newKey = keys.find(k => k != todolistID1 && k != todolistID2)
    if (!newKey) {
        throw Error('new key should be added')
    }

    expect(keys.length).toBe(3)
    expect(endState[newKey]).toEqual([])
})

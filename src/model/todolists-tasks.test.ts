import { addTodolistAC, deleteTodolistAC, TodoListDomainType, todolistsReducer } from './todolists-reducer';
import { TasksDomainType, tasksReducer } from './task-reducer';
import { TasksType } from '../api/api';
import { v1 } from 'uuid';

test('ids should be equals', () => {
    const startTasksState: TasksDomainType = {}
    const startTodolistsState: Array<TodoListDomainType> = []

    const action = addTodolistAC({id: v1(), title: 'What to learn', addedDate: 'null', order: 1})

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todolistsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState)
    const idFromTasks = keys[0]
    const idFromTodolists = endTodolistsState[0].id

    expect(idFromTasks).toBe(action.payload.list.id)
    expect(idFromTodolists).toBe(action.payload.list.id)
})

test('property with todolistId should be deleted', () => {
    const startState: TasksDomainType = {
        'todolistId1': [
            {
                description: '', title: 'HTML&CSS', status: 0, priority: 0, startDate: '',
                deadline: '', id: '1', listID: '001', order: 0, addedDate: '', entityStatus: 'idle'
            },
            {
                description: '', title: 'JS', status: 0, priority: 0, startDate: '',
                deadline: '', id: '2', listID: '002', order: 0, addedDate: '', entityStatus: 'idle'
            },
            {
                description: '', title: 'REACT', status: 0, priority: 0, startDate: '',
                deadline: '', id: '3', listID: '003', order: 0, addedDate: '', entityStatus: 'idle'
            },
        ],
        'todolistId2': [
            {
                description: '', title: 'Terminator', status: 2, priority: 0, startDate: '',
                deadline: '', id: '1', listID: '001', order: 0, addedDate: '', entityStatus: 'idle'
            },
            {
                description: '', title: 'The Godfather', status: 0, priority: 0, startDate: '',
                deadline: '', id: '2', listID: '002', order: 0, addedDate: '', entityStatus: 'idle'
            },
            {
                description: '', title: 'Star Wars', status: 0, priority: 0, startDate: '',
                deadline: '', id: '3', listID: '003', order: 0, addedDate: '', entityStatus: 'idle'
            }
        ],
    }

    const action = deleteTodolistAC('todolistId2')

    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState)

    expect(keys.length).toBe(1)
    expect(endState['todolistId2']).not.toBeDefined()
})

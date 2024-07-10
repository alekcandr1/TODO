import { addTodolistAC, deleteTodolistAC, todolistsReducer } from './todolists-reducer';
import { tasksReducer } from './task-reducer';
import { TasksType } from '../api/api';
//
// import { TodoListType } from '../AppWithRedux';
//
//
// test('ids should be equals', () => {
//     const startTasksState: TasksType = {}
//     const startTodolistsState: Array<TodoListType> = []
//
//     const action = addTodolistAC('new todolist')
//
//     const endTasksState = tasksReducer(startTasksState, action)
//     const endTodolistsState = todolistsReducer(startTodolistsState, action)
//
//     const keys = Object.keys(endTasksState)
//     const idFromTasks = keys[0]
//     const idFromTodolists = endTodolistsState[0].listID
//
//     expect(idFromTasks).toBe(action.payload.listID)
//     expect(idFromTodolists).toBe(action.payload.listID)
// })
//
// test('property with todolistId should be deleted', () => {
//     const startState: TasksType = {
//         'todolistId1': [
//             {id: '1', title: 'CSS', isDone: false},
//             {id: '2', title: 'JS', isDone: true},
//             {id: '3', title: 'React', isDone: false}
//         ],
//         'todolistId2': [
//             {id: '1', title: 'bread', isDone: false},
//             {id: '2', title: 'milk', isDone: true},
//             {id: '3', title: 'tea', isDone: false}
//         ]
//     }
//
//     const action = removeTodolistAC('todolistId2')
//
//     const endState = tasksReducer(startState, action)
//
//     const keys = Object.keys(endState)
//
//     expect(keys.length).toBe(1)
//     expect(endState['todolistId2']).not.toBeDefined()
// })

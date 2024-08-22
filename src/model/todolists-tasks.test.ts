import { addTodolist, deleteTodolist, TodoListDomainType, todosReducer } from "model/todolistsSlice"
import { TasksDomainType, tasksReducer } from "model/tasksSlice"
import { v1 } from "uuid"

test("ids should be equals", () => {
  const startTasksState: TasksDomainType = {}
  const startTodolistsState: Array<TodoListDomainType> = []

  const action = addTodolist({ todolist: { id: v1(), title: "What to learn", addedDate: "null", order: 1 } })

  const endTasksState = tasksReducer(startTasksState, action)
  const endTodolistsState = todosReducer(startTodolistsState, action)

  const keys = Object.keys(endTasksState)
  const idFromTasks = keys[0]
  const idFromTodolists = endTodolistsState[0].id

  expect(idFromTasks).toBe(action.payload.todolist.id)
  expect(idFromTodolists).toBe(action.payload.todolist.id)
})

test("property with todolistId should be deleted", () => {
  const startState: TasksDomainType = {
    todolistId1: [
      {
        description: "",
        title: "HTML&CSS",
        status: 0,
        priority: 0,
        startDate: "",
        deadline: "",
        id: "1",
        todoListId: "001",
        order: 0,
        addedDate: "",
        entityStatus: "idle",
      },
      {
        description: "",
        title: "JS",
        status: 0,
        priority: 0,
        startDate: "",
        deadline: "",
        id: "2",
        todoListId: "002",
        order: 0,
        addedDate: "",
        entityStatus: "idle",
      },
      {
        description: "",
        title: "REACT",
        status: 0,
        priority: 0,
        startDate: "",
        deadline: "",
        id: "3",
        todoListId: "003",
        order: 0,
        addedDate: "",
        entityStatus: "idle",
      },
    ],
    todolistId2: [
      {
        description: "",
        title: "Terminator",
        status: 2,
        priority: 0,
        startDate: "",
        deadline: "",
        id: "1",
        todoListId: "001",
        order: 0,
        addedDate: "",
        entityStatus: "idle",
      },
      {
        description: "",
        title: "The Godfather",
        status: 0,
        priority: 0,
        startDate: "",
        deadline: "",
        id: "2",
        todoListId: "002",
        order: 0,
        addedDate: "",
        entityStatus: "idle",
      },
      {
        description: "",
        title: "Star Wars",
        status: 0,
        priority: 0,
        startDate: "",
        deadline: "",
        id: "3",
        todoListId: "003",
        order: 0,
        addedDate: "",
        entityStatus: "idle",
      },
    ],
  }

  const action = deleteTodolist({ id: "todolistId2" })

  const endState = tasksReducer(startState, action)

  const keys = Object.keys(endState)

  expect(keys.length).toBe(1)
  expect(endState["todolistId2"]).not.toBeDefined()
})

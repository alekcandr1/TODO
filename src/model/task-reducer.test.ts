import { addTodolist } from "model/todolistsSlice"
import { v1 } from "uuid"
import { addTask, updateTask, removeTask, TasksDomainType, tasksReducer } from "model/tasksSlice"

let startState: TasksDomainType
let todolistID1: string
let todolistID2: string

beforeEach(() => {
  todolistID1 = v1()
  todolistID2 = v1()
  startState = {
    [todolistID1]: [
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
    [todolistID2]: [
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
})

test("remove correct task", () => {
  const endState = tasksReducer(startState, removeTask({ todolistId: todolistID2, taskId: "2" }))
  expect(endState[todolistID2][1].id).toBe("3")
})

test("correct task should be added to correct array", () => {
  const title = "juce"
  const action = addTask({
    task: {
      description: "",
      title,
      status: 0,
      priority: 0,
      startDate: "",
      deadline: "",
      id: "3",
      todoListId: "001",
      order: 0,
      addedDate: "",
    },
  })

  const endState = tasksReducer(startState, action)

  expect(endState[todolistID1].length).toBe(3)
  expect(endState[todolistID2].length).toBe(4)
  expect(endState[todolistID2][0].id).toBeDefined()
  expect(endState[todolistID2][0].title).toBe("juce")
  expect(endState[todolistID2][0].status).toBe(0)
})

test("status of specified task should be changed", () => {
  const action = updateTask({
    taskId: "2",
    todolistId: todolistID2,
    model: {
      description: "",
      title: "The Godfather",
      status: 2,
      priority: 0,
      startDate: "",
      deadline: "",
      id: "2",
      todoListId: "002",
      order: 0,
      addedDate: "",
    },
  })

  const endState = tasksReducer(startState, action)

  expect(endState[todolistID2][1].status).toBe(2)
  expect(endState[todolistID1][1].status).toBe(0)
})

test("title of specified task should be changed", () => {
  const action = updateTask({
    taskId: "2",
    todolistId: todolistID2,
    model: {
      description: "",
      title: "juice",
      status: 2,
      priority: 0,
      startDate: "",
      deadline: "",
      id: "2",
      todoListId: "002",
      order: 0,
      addedDate: "",
    },
  })
  const endState = tasksReducer(startState, action)

  expect(endState[todolistID2][1].title).toBe("juice")
})

test("new array should be added when new todolist is added", () => {
  const action = addTodolist({ todolist: { id: v1(), title: "What to learn", addedDate: "null", order: 1 } })

  const endState = tasksReducer(startState, action)

  const keys = Object.keys(endState)
  const newKey = keys.find((k) => k !== todolistID1 && k !== todolistID2)
  if (!newKey) {
    throw Error("new key should be added")
  }

  expect(keys.length).toBe(3)
  expect(endState[newKey]).toEqual([])
})

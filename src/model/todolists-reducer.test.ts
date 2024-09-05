import {
  addTodolist,
  changeTodolistFilter,
  changeTodolistTitle,
  deleteTodolist,
  TodoListDomainType,
  todosReducer,
} from "model/todolistsSlice"
import { v1 } from "uuid"
import { TestAction } from "common/types/test-types"

let todolistId1: string
let todolistId2: string
let startState: TodoListDomainType[]

beforeEach(() => {
  todolistId1 = v1()
  todolistId2 = v1()

  startState = [
    { id: todolistId1, title: "What to learn", addedDate: "null", order: 1, filter: "ALL", entityStatus: "idle" },
    { id: todolistId2, title: "What to buy", addedDate: "null", order: 1, filter: "ALL", entityStatus: "idle" },
  ]
})

test("correct todolist should be removed", () => {
  const action: TestAction<typeof deleteTodolist.fulfilled> = {
    type: deleteTodolist.fulfilled.type,
    payload: { todolistId: todolistId1 },
  }
  const endState = todosReducer(startState, action)

  expect(endState.length).toBe(1)
  expect(endState[0].id).toBe(todolistId2)
})

test("correct todolist should be added", () => {
  const title = "New todolist"
  const action: TestAction<typeof addTodolist.fulfilled> = {
    type: addTodolist.fulfilled.type,
    payload: {
      todolist: {
        id: v1(),
        title,
        addedDate: "",
        order: 0,
      },
    },
  }
  const endState = todosReducer(startState, action)

  expect(endState.length).toBe(3)
  expect(endState[2].title).toBe(title)
})

test("correct todolist should change its name", () => {
  const newTitle = "New title"
  const action: TestAction<typeof changeTodolistTitle.fulfilled> = {
    type: changeTodolistTitle.fulfilled.type,
    payload: {
      todolistId: todolistId2,
      title: newTitle,
    },
  }
  const endState = todosReducer(startState, action)

  expect(endState[0].title).toBe("What to learn")
  expect(endState[1].title).toBe(newTitle)
})

test("correct filter of todolist should be changed", () => {
  const endState = todosReducer(startState, changeTodolistFilter({ todolistId: todolistId2, filter: "COMPLETED" }))

  expect(endState[0].filter).toBe("ALL")
  expect(endState[1].filter).toBe("COMPLETED")
})

import { addTodolist } from "model/todolistsSlice"
import { v1 } from "uuid"
import { addTask, deleteTask, fetchTasks, TasksDomainType, tasksReducer, updateTask } from "model/tasksSlice"
import { TestAction } from "common/types/test-types"
import { TaskStatuses } from "api/api"

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
  const action: TestAction<typeof deleteTask.fulfilled> = {
    type: deleteTask.fulfilled.type,
    payload: { todolistId: todolistID2, taskId: "2" },
  }
  const endState = tasksReducer(startState, action)
  expect(endState[todolistID2][1].id).toBe("3")
})
test("tasks should be added for todolist", () => {
  const action: TestAction<typeof fetchTasks.fulfilled> = {
    type: fetchTasks.fulfilled.type,
    payload: {
      tasks: startState["todolistId1"],
      todolistId: "todolistId1",
    },
  }

  // const action = fetchTasks.fulfilled({ tasks: startState["todolistId1"], todolistId: "todolistId1" }, 'requestId', "todolistId1");

  const endState = tasksReducer(
    {
      todolistId2: [],
      todolistId1: [],
    },
    action,
  )

  expect(endState["todolistId1"].length).toBe(3)
  expect(endState["todolistId2"].length).toBe(0)
})

test("correct task should be added to correct array", () => {
  //const action = addTaskAC("juce", "todolistId2");

  type Action = TestAction<typeof addTask.fulfilled>
  const action: Action = {
    type: addTask.fulfilled.type,
    payload: {
      task: {
        todoListId: "todolistId2",
        title: "juce",
        status: 0,
        addedDate: "",
        deadline: "",
        description: "",
        order: 0,
        priority: 0,
        startDate: "",
        id: "id exists",
      },
    },
  }

  const endState = tasksReducer(startState, action)

  expect(endState["todolistId1"].length).toBe(3)
  expect(endState["todolistId2"].length).toBe(4)
  expect(endState["todolistId2"][0].id).toBeDefined()
  expect(endState["todolistId2"][0].title).toBe("juce")
  expect(endState["todolistId2"][0].status).toBe(0)
})

test("status of specified task should be changed", () => {
  const action: TestAction<typeof updateTask.fulfilled> = {
    type: updateTask.fulfilled.type,
    payload: {
      taskId: "2",
      model: { status: TaskStatuses.New },
      todolistId: "todolistId2",
    },
  }

  const endState = tasksReducer(startState, action)

  expect(endState["todolistId1"][1].status).toBe(TaskStatuses.Completed)
  expect(endState["todolistId2"][1].status).toBe(TaskStatuses.New)
})

test("title of specified task should be changed", () => {
  const action: TestAction<typeof updateTask.fulfilled> = {
    type: updateTask.fulfilled.type,
    payload: { taskId: "2", model: { title: "yogurt" }, todolistId: "todolistId2" },
  }
  // const _action = tasksActions.updateTask({taskId: '2', model: {title: 'yogurt'}, todolistId: 'todolistId2'});

  const endState = tasksReducer(startState, action)

  expect(endState["todolistId1"][1].title).toBe("JS")
  expect(endState["todolistId2"][1].title).toBe("yogurt")
  expect(endState["todolistId2"][0].title).toBe("bread")
})

// test("status of specified task should be changed", () => {
//
//   type Action = TestAction<typeof addTask.fulfilled>
//   const action: Action = {
//     type: updateTask.fulfilled.type,
//     payload: {
//       todolistId: todolistID2,
//       taskId: string,
//       model: { status:  },
//     },
//   }
//
//   const endState = tasksReducer(startState, action)
//
//   expect(endState[todolistID2][1].status).toBe(2)
//   expect(endState[todolistID1][1].status).toBe(0)
// })
//
// test("title of specified task should be changed", () => {
//   const action = updateTask({
//     taskId: "2",
//     todolistId: todolistID2,
//     model: {
//       description: "",
//       title: "juice",
//       status: 2,
//       priority: 0,
//       startDate: "",
//       deadline: "",
//     },
//   })
//   const endState = tasksReducer(startState, action)
//
//   expect(endState[todolistID2][1].title).toBe("juice")
// })

test("new array should be added when new todolist is added", () => {
  const action: TestAction<typeof addTodolist.fulfilled> = {
    type: addTodolist.fulfilled.type,
    payload: {
      todolist: { id: v1(), title: "What to learn", addedDate: "null", order: 1 },
    },
  }

  const endState = tasksReducer(startState, action)

  const keys = Object.keys(endState)
  const newKey = keys.find((k) => k !== todolistID1 && k !== todolistID2)
  if (!newKey) {
    throw Error("new key should be added")
  }

  expect(keys.length).toBe(3)
  expect(endState[newKey]).toEqual([])
})

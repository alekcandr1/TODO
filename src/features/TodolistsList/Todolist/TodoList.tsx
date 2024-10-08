import * as React from "react"
import { memo, useCallback, useMemo } from "react"
import { List, ListItem } from "@mui/material"
import { AddItemForm } from "components/AddItemForm/AddItemForm"
import { EditableSpan } from "components/EditableSpan/EditableSpan"
import IconButton from "@mui/material/IconButton"
import DeleteIcon from "@mui/icons-material/Delete"
import { AppRootStateType, useAppDispatch } from "model/store"
import { addTask, TasksDomainType } from "model/tasksSlice"
import {
  changeTodolistFilter,
  changeTodolistTitle,
  deleteTodolist,
  FilterType,
  TodoListDomainType,
} from "model/todolistsSlice"
import ButtonContainer from "../../../components/Button/ButtonContainer"
import { Task } from "./Task/Task"
import { selectorTasks } from "common/selectors/tasks.selectors"
import { useAppSelector } from "common/hooks/hooks"

export type TodoListPropsType = {
  list: TodoListDomainType
}

export const TodoList = memo(({ list }: TodoListPropsType) => {
  const dispatch = useAppDispatch()
  const { id, title, filter, entityStatus } = list

  let tasks = useAppSelector<AppRootStateType, TasksDomainType>(selectorTasks)[id]

  tasks = useMemo(() => {
    if (list.filter === "ACTIVE") {
      tasks = tasks.filter((t) => t.status === 0)
    }
    if (list.filter === "COMPLETED") {
      tasks = tasks.filter((t) => t.status === 2)
    }
    return tasks
  }, [tasks, list.filter])

  const addTaskHandler = useCallback(
    (taskTitle: string) => {
      dispatch(addTask({ todolistId: list.id, taskTitle }))
    },
    [dispatch, list.id],
  )

  const changeFilterHandler = useCallback(
    (filter: FilterType) => {
      dispatch(changeTodolistFilter({ todolistId: id, filter }))
    },
    [dispatch, id],
  )

  const changeTodoListTitleHandler = useCallback(
    (title: string) => {
      dispatch(changeTodolistTitle({ todolistId: id, title }))
    },
    [dispatch, id],
  )

  const removeTodolistHandler = useCallback(() => {
    dispatch(deleteTodolist({ todolistId: id }))
  }, [dispatch, id])

  return (
    <div key={id} className={"todolist"}>
      <div className={"todolist-title-container"}>
        <h3>
          <EditableSpan title={title} onChange={changeTodoListTitleHandler} disabled={entityStatus === "loading"} />
        </h3>
        <IconButton onClick={removeTodolistHandler} disabled={entityStatus === "loading"}>
          <DeleteIcon />
        </IconButton>
      </div>

      <AddItemForm addItem={addTaskHandler} disabled={entityStatus === "loading"} />
      <List>
        {tasks.map((task) => {
          return (
            <ListItem key={task.id} disableGutters disablePadding className={task.status === 2 ? "is-done" : ""}>
              <Task key={task.id} task={task} todolistId={id} />
            </ListItem>
          )
        })}
      </List>
      <div>
        <ButtonContainer
          title={"ALL"}
          changeFilterHandler={changeFilterHandler}
          variantButton={filter === "ALL" ? "outlined" : "text"}
        />
        <ButtonContainer
          title={"ACTIVE"}
          changeFilterHandler={changeFilterHandler}
          variantButton={filter === "ACTIVE" ? "outlined" : "text"}
        />
        <ButtonContainer
          title={"COMPLETED"}
          changeFilterHandler={changeFilterHandler}
          variantButton={filter === "COMPLETED" ? "outlined" : "text"}
        />
      </div>
    </div>
  )
})

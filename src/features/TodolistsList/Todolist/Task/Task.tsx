// @flow
import * as React from "react"
import { Checkbox } from "@mui/material"
import { EditableSpan } from "components/EditableSpan/EditableSpan"
import IconButton from "@mui/material/IconButton"
import DeleteIcon from "@mui/icons-material/Delete"
import { ChangeEvent, useCallback } from "react"
import { deleteTask, TaskDomainType, updateTask } from "model/tasksSlice"
import { useAppDispatch } from "model/store"

type TaskProps = {
  task: TaskDomainType
  todolistId: string
}
export const Task = React.memo(({ task, todolistId }: TaskProps) => {
  console.log("Task")
  let dispatch = useAppDispatch()

  const removeTaskHandler = useCallback(() => {
    dispatch(deleteTask({ todolistId, taskId: task.id }))
  }, [dispatch, todolistId, task.id])

  const changeTaskStatusHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      let currentStatus
      e.currentTarget.checked ? (currentStatus = 2) : (currentStatus = 0)
      dispatch(
        updateTask({
          todolistId,
          taskId: task.id,
          model: {
            status: currentStatus,
            title: task.title,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline,
          },
        }),
      )
    },
    [dispatch, todolistId, task.deadline, task.description, task.id, task.priority, task.startDate, task.title],
  )

  const changeTaskTitleHandler = useCallback(
    (newTitle: string) => {
      dispatch(
        updateTask({
          todolistId,
          taskId: task.id,
          model: {
            status: task.status,
            title: newTitle,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline,
          },
        }),
      )
    },
    [dispatch, todolistId, task.id, task.status, task.description, task.priority, task.startDate, task.deadline],
  )

  return (
    <>
      <Checkbox checked={task.status === 2} onChange={changeTaskStatusHandler} />
      <EditableSpan title={task.title} onChange={changeTaskTitleHandler} disabled={task.entityStatus === "loading"} />
      <IconButton onClick={removeTaskHandler} disabled={task.entityStatus === "loading"}>
        <DeleteIcon />
      </IconButton>
    </>
  )
})

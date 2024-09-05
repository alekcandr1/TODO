// @flow
import * as React from "react"
import { useCallback, useEffect } from "react"
import Grid from "@mui/material/Unstable_Grid2"
import { Paper } from "@mui/material"
import { TodoList } from "./Todolist/TodoList"
import { AppRootStateType, useAppDispatch } from "model/store"
import { addTodolist, fetchTodolists, TodoListDomainType } from "model/todolistsSlice"
import { AddItemForm } from "components/AddItemForm/AddItemForm"
import { Navigate } from "react-router-dom"
import { useAppSelector } from "common/hooks/hooks"
import { selectIsLoggedIn } from "common/selectors/auth.selectors"
import { selectorTodolists } from "common/selectors/todolists.selectors"

type TodolistsListPropsType = {}
export const TodolistsList: React.FC<TodolistsListPropsType> = () => {
  let dispatch = useAppDispatch()
  const isLoggedIn = useAppSelector<AppRootStateType, boolean>(selectIsLoggedIn)

  useEffect(() => {
    if (!isLoggedIn) {
      return
    }
    dispatch(fetchTodolists())
  }, [dispatch, isLoggedIn])

  let todoLists = useAppSelector<AppRootStateType, TodoListDomainType[]>(selectorTodolists)

  const addTodoList = useCallback(
    (title: string) => {
      dispatch(addTodolist({ title }))
    },
    [dispatch],
  )

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />
  }

  return (
    <>
      <Grid container className={"head"} direction="column">
        <Grid>
          <h3>Add todolist:</h3>
        </Grid>
        <Grid>
          <AddItemForm addItem={addTodoList} />
        </Grid>
      </Grid>
      <Grid container spacing={4} className="todolists">
        {todoLists.map((list, index) => {
          return (
            <Grid key={index}>
              <Paper elevation={2}>
                <TodoList list={list} />
              </Paper>
            </Grid>
          )
        })}
      </Grid>
    </>
  )
}

// @flow
import * as React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import { Paper } from '@mui/material';
import { TodoList } from './Todolist/TodoList';
import { AppRootStateType, useAppDispatch } from '../../model/store';
import { useCallback, useEffect } from 'react';
import { addTodoTC, getTodosTC, TodoListDomainType } from '../../model/todolists-reducer';
import { useSelector } from 'react-redux';
import { AddItemForm } from '../../components/AddItemForm/AddItemForm';
import { Navigate } from 'react-router-dom';

type TodolistsListPropsType = {}
export const TodolistsList: React.FC<TodolistsListPropsType> = () => {
    let dispatch = useAppDispatch()
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)

    useEffect(() => {
        if (!isLoggedIn) {
            return
        }
        dispatch(getTodosTC())
    }, [dispatch, isLoggedIn])

    let todoLists = useSelector<AppRootStateType, TodoListDomainType[]>(state => state.todolists)

    const addTodoList = useCallback(
        ( todoListTitle: string ) => {
            dispatch(addTodoTC(todoListTitle))
        }, [dispatch]
    )

    if (!isLoggedIn) {
        return <Navigate to={'/login'} />
    }

    return <>
        <Grid container className={ 'head' } direction="column">
            <Grid><h3>Add todolist:</h3></Grid>
            <Grid><AddItemForm addItem={ addTodoList } /></Grid>
        </Grid>
        <Grid container spacing={ 4 } className="todolists">
            {
                todoLists.map(( list, index ) => {
                    return (
                        <Grid key={ index }>
                            <Paper elevation={ 2 }>
                                <TodoList list={ list } />
                            </Paper>
                        </Grid>
                    )
                })
            }

        </Grid>
    </>
}
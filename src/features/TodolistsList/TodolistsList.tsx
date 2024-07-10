// @flow
import * as React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import { Paper } from '@mui/material';
import { TodoList } from '../../components/TodoList/TodoList';
import { AppRootStateType, useAppDispatch } from '../../model/store';
import { useCallback, useEffect } from 'react';
import { addTodoTC, getTodosTC, TodoListDomainType } from '../../model/todolists-reducer';
import { useSelector } from 'react-redux';
import { AddItemForm } from '../../components/AddItemForm/AddItemForm';

type TodolistsListPropsType = {}
export const TodolistsList: React.FC<TodolistsListPropsType> = ( props ) => {
    let dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(getTodosTC())
    }, [dispatch])

    let todoLists = useSelector<AppRootStateType, TodoListDomainType[]>(state => state.todolists)

    const addTodoList = useCallback(
        ( todoListTitle: string ) => {
            dispatch(addTodoTC(todoListTitle))
        }, [dispatch]
    )

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
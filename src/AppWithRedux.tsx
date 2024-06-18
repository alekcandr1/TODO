import React, { useCallback } from 'react';
import './App.css';
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Unstable_Grid2'
import { Paper } from '@mui/material';
import { addTodolistAC } from './model/todolists-reducer';
import { useDispatch, useSelector } from 'react-redux';
import { AppRootStateType } from './model/store';
import { TodoListWithRedux } from './components/TodoList/TodoListWithRedux';
import { AddItemForm } from './components/AddItemForm';

export type FilterType = 'ALL' | 'ACTIVE' | 'COMPLETED'
export type TodoLists = TodoListType[]
export type TodoListType = {
    listID: string
    title: string
    filter: FilterType
}
export type TaskType = {
    id: string,
    title: string,
    isDone: boolean
}
export type TasksType = {
    [key: string]: TaskType[]
}

function AppWithRedux() {

    let todoLists = useSelector<AppRootStateType, TodoLists>(state => state.todolists)
    let dispatch = useDispatch()

    const addTodoList = useCallback(
        ( todoListTitle: string ) => {
            dispatch(addTodolistAC(todoListTitle))
        }, [dispatch]
    )

    return (
        <Grid className="App">
            <AppBar position="static" className={ 'app-bar' }>
                <Toolbar>
                    <IconButton color="inherit">
                        <MenuIcon />
                    </IconButton>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>

            <Container fixed className={ 'main-content' }>

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
                                        <TodoListWithRedux list={ list } />
                                    </Paper>
                                </Grid>
                            )
                        })
                    }
                </Grid>
            </Container>
        </Grid>
    );
}

export default AppWithRedux;

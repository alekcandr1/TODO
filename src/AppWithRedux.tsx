import React from 'react';
import './App.css';
import { TodoList } from './components/TodoList/TodoList';
import { AddItemForm } from './components/AddItemForm';
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Unstable_Grid2'
import { Paper } from '@mui/material';
import {
    addTodolistAC,
    changeTodolistFilterAC, changeTodolistTitleAC, removeTodolistAC,

} from './model/todolists-reducer';
import {
    addTaskAC,
    changeTaskStatusAC,
    changeTaskTitleAC,
    removeTaskAC,

} from './model/task-reducer';
import { useDispatch, useSelector } from 'react-redux';
import { AppRootStateType, store } from './model/store';
import { TodoListWithRedux } from './components/TodoList/TodoListWithRedux';

// DATA
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

// RENDER
function AppWithRedux() {

    let todoLists = useSelector<AppRootStateType, TodoLists>(state=> state.todolists)

    // let tasks = useSelector<AppRootStateType, TasksType>(state => state.tasks)

    let dispatch = useDispatch()

    // ACTIONS
    const removeTask = ( listID: string, taskID: string ) => {
        dispatch(removeTaskAC(listID, taskID))
    }
    const addTask = ( listID: string, taskTitle: string ) => {
        dispatch(addTaskAC(listID, taskTitle))
    }
    const changeFilterTasks = ( listID: string, filter: FilterType ) => {
        dispatch(changeTodolistFilterAC(listID, filter))
    }
    const changeTaskStatus = ( listID: string, taskID: string, taskStatus: boolean ) => {
        dispatch(changeTaskStatusAC(listID, taskID, taskStatus))
    }
    const changeTodoListTitle = ( listID: string, newTitle: string ) => {
        dispatch(changeTodolistTitleAC(listID, newTitle))
    }
    const changeTaskTitle = ( listID: string, taskID: string, newTitle: string ) => {
        dispatch(changeTaskTitleAC(listID, taskID, newTitle))
    }
    const addTodoList = ( todoListTitle: string ) => {
        dispatch(addTodolistAC(todoListTitle))
    }
    const removeTodolist = ( listID: string ) => {
        dispatch(removeTodolistAC(listID))
    }

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
                        todoLists.map(list => {
                            // let allTodoListTasks = tasks[list.listID]
                            // let tasksForTodoList = allTodoListTasks

                            return (
                                <Grid>
                                    <Paper elevation={ 2 }>
                                        <TodoListWithRedux key={ list.listID }
                                                           list={ list }
                                        />
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

import * as React from 'react';
import { FilterType, TasksType, TaskType, TodoListType } from '../../AppWithRedux';
import { Button, Checkbox, List, ListItem } from '@mui/material';
import { ChangeEvent, memo, useCallback, useState } from 'react';
import { AddItemForm } from '../AddItemForm';
import { EditableSpan } from '../EditableSpan';
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import { useDispatch, useSelector } from 'react-redux';
import { AppRootStateType } from '../../model/store';
import { addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC } from '../../model/task-reducer';
import { changeTodolistFilterAC, changeTodolistTitleAC, removeTodolistAC } from '../../model/todolists-reducer';

export type TodoListPropsType = {
    list: TodoListType
}

export const TodoListWithRedux = memo(( {list}: TodoListPropsType ) => {
    console.log('TodoListWithRedux')
    const {listID, title, filter} = list
    let tasks = useSelector<AppRootStateType, TaskType[]>(state => state.tasks[listID])
    const dispatch = useDispatch()

    const addTaskHandler = useCallback(( taskTitle: string ) => {
        dispatch(addTaskAC(list.listID, taskTitle))
    }, [dispatch, list.listID])

    const removeTaskHandler = ( taskID: string ) => {
        dispatch(removeTaskAC(list.listID, taskID))
    }
    const changeFilterHandler = ( filter: FilterType ) => {
        dispatch(changeTodolistFilterAC(listID, filter))
    }
    const changeTaskStatusHandler = ( taskID: string, e: ChangeEvent<HTMLInputElement> ) => {
        dispatch(changeTaskStatusAC(listID, taskID, e.currentTarget.checked))
    }
    const changeTodoListTitleHandler = ( newTitle: string ) => {
        dispatch(changeTodolistTitleAC(listID, newTitle))
    }
    const changeTaskTitleHandler = ( taskID: string, newTitle: string ) => {
        changeTaskTitleAC(listID, taskID, newTitle)
    }
    const removeTodolistHandler = () => {
        dispatch(removeTodolistAC(listID))
    }

    if (list.filter === 'ACTIVE') {
        tasks = tasks.filter(t => !t.isDone)
    }
    if (list.filter === 'COMPLETED') {
        tasks = tasks.filter(t => t.isDone)
    }

    return (
        <div key={ listID } className={ 'todolist' }>
            <div className={ 'todolist-title-container' }>
                <h3>
                    <EditableSpan title={ title } onChange={ changeTodoListTitleHandler } />
                </h3>
                <IconButton onClick={ removeTodolistHandler }>
                    <DeleteIcon />
                </IconButton>
            </div>

            <AddItemForm addItem={ addTaskHandler } />
            <List>
                {
                    tasks.map(task => {
                            return (
                                <ListItem
                                    key={ task.id }
                                    disableGutters
                                    disablePadding
                                    className={ task.isDone ? 'is-done' : '' }
                                >
                                    <Checkbox checked={ task.isDone }
                                              onChange={ ( e ) => changeTaskStatusHandler(task.id, e) } />
                                    <EditableSpan title={ task.title }
                                                  onChange={ ( e ) => changeTaskTitleHandler(task.id, e) } />
                                    <IconButton onClick={ () => removeTaskHandler(task.id) }>
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItem>
                            )
                        }
                    )
                }
            </List>
            <div>
                <Button
                    variant={ filter === 'ALL' ? 'outlined' : 'text' }
                    color={ 'inherit' }
                    onClick={ () => changeFilterHandler('ALL') }
                >
                    All
                </Button>
                <Button
                    variant={ filter === 'ACTIVE' ? 'outlined' : 'text' }
                    color={ 'primary' }
                    onClick={ () => changeFilterHandler('ACTIVE') }
                >
                    Active
                </Button>
                <Button
                    variant={ filter === 'COMPLETED' ? 'outlined' : 'text' }
                    color={ 'secondary' }
                    onClick={ () => changeFilterHandler('COMPLETED') }
                >
                    Completed
                </Button>
            </div>
        </div>
    )
})
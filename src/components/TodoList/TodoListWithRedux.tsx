import * as React from 'react';
import { FilterType, TaskType, TodoListType } from '../../AppWithRedux';
import { List, ListItem } from '@mui/material';
import { memo, useCallback, useMemo } from 'react';
import { AddItemForm } from '../AddItemForm';
import { EditableSpan } from '../EditableSpan';
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import { useDispatch, useSelector } from 'react-redux';
import { AppRootStateType } from '../../model/store';
import { addTaskAC } from '../../model/task-reducer';
import { changeTodolistFilterAC, changeTodolistTitleAC, removeTodolistAC } from '../../model/todolists-reducer';
import ButtonContainer from '../ButtonContainer';
import { Task } from './Task';

export type TodoListPropsType = {
    list: TodoListType
}

export const TodoListWithRedux = memo(( {list}: TodoListPropsType ) => {
    console.log('TodoListWithRedux')

    const dispatch = useDispatch()
    const {listID, title, filter} = list
    let tasks = useSelector<AppRootStateType, TaskType[]>(state => state.tasks[listID])

    tasks = useMemo(() => {
        console.log('useMemo')
        if (list.filter === 'ACTIVE') {
            tasks = tasks.filter(t => !t.isDone)
        }
        if (list.filter === 'COMPLETED') {
            tasks = tasks.filter(t => t.isDone)
        }
        return tasks
    }, [tasks, list.filter])

    const addTaskHandler = useCallback(( taskTitle: string ) => {
        dispatch(addTaskAC(list.listID, taskTitle))
    }, [dispatch, list.listID])

    const changeFilterHandler = useCallback(( filter: FilterType ) => {
        dispatch(changeTodolistFilterAC(listID, filter))
    }, [dispatch, listID])

    const changeTodoListTitleHandler = useCallback(( newTitle: string ) => {
        dispatch(changeTodolistTitleAC(listID, newTitle))
    }, [dispatch, listID])

    const removeTodolistHandler = useCallback(() => {
        dispatch(removeTodolistAC(listID))
    }, [dispatch, listID])

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
                                    <Task
                                        key={ task.id }
                                        task={ task }
                                        listID={ listID }
                                    />
                                </ListItem>
                            )
                        }
                    )
                }
            </List>
            <div>
                <ButtonContainer title={ 'ALL' }
                                 changeFilterHandler={ changeFilterHandler }
                                 variantButton={ filter === 'ALL' ? 'outlined' : 'text' }
                />
                <ButtonContainer title={ 'ACTIVE' }
                                 changeFilterHandler={ changeFilterHandler }
                                 variantButton={ filter === 'ACTIVE' ? 'outlined' : 'text' }
                />
                <ButtonContainer title={ 'COMPLETED' }
                                 changeFilterHandler={ changeFilterHandler }
                                 variantButton={ filter === 'COMPLETED' ? 'outlined' : 'text' }
                />
            </div>
        </div>
    )
})
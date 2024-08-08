import * as React from 'react';
import { List, ListItem } from '@mui/material';
import { memo, useCallback, useEffect, useMemo } from 'react';
import { AddItemForm } from '../../../components/AddItemForm/AddItemForm';
import { EditableSpan } from '../../../components/EditableSpan/EditableSpan';
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import { useSelector } from 'react-redux';
import { AppRootStateType, useAppDispatch } from '../../../model/store';
import { addTaskTC, getTasksTC, TaskDomainType } from '../../../model/task-reducer';
import {
    changeTodolistFilterAC,
    changeTodoTitleTC,
    deleteTodoTC, FilterType,
    TodoListDomainType
} from '../../../model/todolists-reducer';
import ButtonContainer from '../../../components/Button/ButtonContainer';
import { Task } from './Task/Task';

export type TodoListPropsType = {
    list: TodoListDomainType
}

export const TodoList = memo(( {list}: TodoListPropsType ) => {
    const dispatch = useAppDispatch()
    const {id, title, filter, entityStatus} = list

    // useEffect(() => {
    //     dispatch(getTasksTC(id))
    // }, [dispatch, id])

    let tasks = useSelector<AppRootStateType, TaskDomainType[]>(state => state.tasks[id])

    tasks = useMemo(() => {
        if (list.filter === 'ACTIVE') {
            tasks = tasks.filter(t => t.status === 0)
        }
        if (list.filter === 'COMPLETED') {
            tasks = tasks.filter(t => t.status === 2)
        }
        return tasks
    }, [tasks, list.filter])

    const addTaskHandler = useCallback(( taskTitle: string ) => {
        dispatch(addTaskTC(list.id, taskTitle))
    }, [dispatch, list.id])

    const changeFilterHandler = useCallback(( filter: FilterType ) => {
        dispatch(changeTodolistFilterAC(id, filter))
    }, [dispatch, id])

    const changeTodoListTitleHandler = useCallback(( newTitle: string ) => {
        dispatch(changeTodoTitleTC(id, newTitle))
    }, [dispatch, id])

    const removeTodolistHandler = useCallback(() => {
        dispatch(deleteTodoTC(id))
    }, [dispatch, id])

    return (
        <div key={ id } className={ 'todolist' }>
            <div className={ 'todolist-title-container' }>
                <h3>
                    <EditableSpan title={ title } onChange={ changeTodoListTitleHandler }
                                  disabled={ entityStatus === 'loading' } />
                </h3>
                <IconButton onClick={ removeTodolistHandler } disabled={ entityStatus === 'loading' }>
                    <DeleteIcon />
                </IconButton>
            </div>

            <AddItemForm addItem={ addTaskHandler } disabled={ entityStatus === 'loading' } />
            <List>
                {
                    tasks.map(task => {
                            return (
                                <ListItem
                                    key={ task.id }
                                    disableGutters
                                    disablePadding
                                    className={ task.status === 2 ? 'is-done' : '' }
                                >
                                    <Task
                                        key={ task.id }
                                        task={ task }
                                        listID={ id }
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
// @flow
import * as React from 'react';
import { Checkbox } from '@mui/material';
import { EditableSpan } from '../EditableSpan';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { TaskType } from '../../AppWithRedux';
import { ChangeEvent, useCallback } from 'react';
import { changeTaskStatusAC, changeTaskTitleAC, removeTaskAC } from '../../model/task-reducer';
import { useDispatch } from 'react-redux';

type TaskProps = {
    task: TaskType
    listID: string
};
export const Task = React.memo(( {task, listID}: TaskProps ) => {

    console.log('Task')
    let dispatch = useDispatch()

    const removeTaskHandler = useCallback(() => {
        dispatch(removeTaskAC(listID, task.id))
    }, [dispatch, listID, task.id])

    const changeTaskStatusHandler = useCallback(( e: ChangeEvent<HTMLInputElement> ) => {
        dispatch(changeTaskStatusAC(listID, task.id, e.currentTarget.checked))
    }, [dispatch, listID, task.id])

    const changeTaskTitleHandler = useCallback(( newTitle: string ) => {
        dispatch(changeTaskTitleAC(listID, task.id, newTitle))
    }, [dispatch, task.id, listID])


    return (
        <>
            <Checkbox checked={ task.isDone }
                      onChange={ changeTaskStatusHandler } />
            <EditableSpan title={ task.title }
                          onChange={ changeTaskTitleHandler } />
            <IconButton onClick={ removeTaskHandler }>
                <DeleteIcon />
            </IconButton>
        </>
    );
})
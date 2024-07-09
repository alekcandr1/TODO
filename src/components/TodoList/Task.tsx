// @flow
import * as React from 'react';
import { Checkbox } from '@mui/material';
import { EditableSpan } from '../EditableSpan';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { ChangeEvent, useCallback } from 'react';
import {
    changeTaskStatusAC,
    changeTaskTitleAC,
    deleteTaskTC,
    removeTaskAC,
    updateTaskTC
} from '../../model/task-reducer';
import { useDispatch } from 'react-redux';
import { TaskType } from '../../api/api';

type TaskProps = {
    task: TaskType
    listID: string
};
export const Task = React.memo(( {task, listID}: TaskProps ) => {

    console.log('Task')
    let dispatch = useDispatch()

    const removeTaskHandler = useCallback(() => {
        dispatch(deleteTaskTC(listID, task.id))
    }, [dispatch, listID, task.id])

    // const changeTaskStatusHandler = useCallback(( e: ChangeEvent<HTMLInputElement> ) => {
    //     dispatch(changeTaskStatusAC(listID, task.id, e.currentTarget.checked))
    // }, [dispatch, listID, task.id])
    const changeTaskStatusHandler = useCallback(( e: ChangeEvent<HTMLInputElement> ) => {
        let currentStatus
        e.currentTarget.checked
            ? currentStatus = 2
            : currentStatus = 0
        dispatch(updateTaskTC(listID, task.id, {
            status: currentStatus,
            title: task.title,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline
        }))
    }, [dispatch, listID, task.id])

    // const changeTaskTitleHandler = useCallback(( newTitle: string ) => {
    //     dispatch(updateTaskTC(listID, task.id, newTitle))
    // }, [dispatch, task.id, listID])


    return (
        <>
            <Checkbox checked={ task.status === 2 }
                      onChange={ changeTaskStatusHandler } />
            <EditableSpan title={ task.title }
                          onChange={ ()=>{}
                // changeTaskTitleHandler
            }
            />
            <IconButton onClick={ removeTaskHandler }>
                <DeleteIcon />
            </IconButton>
        </>
    );
})
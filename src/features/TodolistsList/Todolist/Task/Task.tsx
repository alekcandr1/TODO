// @flow
import * as React from 'react';
import { Checkbox } from '@mui/material';
import { EditableSpan } from '../../../../components/EditableSpan/EditableSpan';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { ChangeEvent, useCallback } from 'react';
import { deleteTaskTC, TaskDomainType, updateTaskTC } from '../../../../model/task-reducer';
import { useDispatch } from 'react-redux';

type TaskProps = {
    task: TaskDomainType
    listID: string
};
export const Task = React.memo(( {task, listID}: TaskProps ) => {

    console.log('Task')
    let dispatch = useDispatch()

    const removeTaskHandler = useCallback(() => {
        dispatch(deleteTaskTC(listID, task.id))
    }, [dispatch, listID, task.id])

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
    }, [dispatch, listID, task.deadline, task.description, task.id, task.priority, task.startDate, task.title])

    const changeTaskTitleHandler = useCallback(( newTitle: string ) => {
        dispatch(updateTaskTC(listID, task.id, {
            status: task.status,
            title: newTitle,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline
        }))
    }, [dispatch, listID, task.id, task.status, task.description, task.priority, task.startDate, task.deadline])

    return (
        <>
            <Checkbox checked={ task.status === 2 }
                      onChange={ changeTaskStatusHandler } />
            <EditableSpan title={ task.title }
                          onChange={ changeTaskTitleHandler }
                          disabled={ task.entityStatus === 'loading' }
            />
            <IconButton onClick={ removeTaskHandler }
                        disabled={ task.entityStatus === 'loading' }
            >
                <DeleteIcon />
            </IconButton>
        </>
    );
})
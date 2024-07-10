import * as React from 'react';
import { Button, Checkbox, List, ListItem } from '@mui/material';
import { ChangeEvent, useState } from 'react';
import { AddItemForm } from '../AddItemForm';
import { EditableSpan } from '../EditableSpan';
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import { TaskType } from '../../api/api';
import { FilterType } from '../../model/todolists-reducer';

export type TodoListPropsType = {
    id: string
    title: string
    filter: FilterType
    tasks: TaskType[]
    removeTask: ( listID: string, taskID: string ) => void
    addTask: ( listID: string, taskTitle: string ) => void
    changeFilterTasks: ( listID: string, filter: FilterType ) => void
    changeTaskStatus: ( listID: string, taskID: string, taskStatus: boolean ) => void
    changeTodoListTitle: ( listID: string, newTitle: string ) => void
    changeTaskTitle: ( listID: string, taskID: string, newTitle: string ) => void
    removeTodolist: ( listID: string ) => void

}

export const TodoList = ( {
                              id,
                              title,
                              filter,
                              tasks,
                              removeTask,
                              addTask,
                              changeFilterTasks,
                              changeTaskStatus,
                              changeTodoListTitle,
                              changeTaskTitle,
                              removeTodolist

                          }: TodoListPropsType ) => {
    const [taskTitle, setTaskTitle] = useState<string>('')

    const addTaskHandler = ( taskTitle: string ) => {
        addTask(id, taskTitle)
    }

    const removeTaskHandler = ( taskID: string ) => {
        removeTask(id, taskID)
    }

    const changeFilterHandler = ( filter: FilterType ) => {
        changeFilterTasks(id, filter)

    }
    const changeTaskStatusHandler = ( taskID: string, e: ChangeEvent<HTMLInputElement> ) => {
        changeTaskStatus(id, taskID, e.currentTarget.checked)
    }
    const changeTodoListTitleHandler = ( newTitle: string ) => {
        changeTodoListTitle(id, newTitle)
    }
    const changeTaskTitleHandler = ( taskID: string, newTitle: string ) => {
        changeTaskTitle(id, taskID, newTitle)
    }
    const removeTodolistHandler = () => {
        removeTodolist(id)
    }


    return (
        <div key={ id } className={ 'todolist' }>
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
                                    className={ task.status === 2 ? 'is-done' : '' }
                                >
                                    <Checkbox checked={ task.status === 2 }
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
}
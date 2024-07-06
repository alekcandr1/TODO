import type { Meta, StoryObj } from '@storybook/react';
import React, { useEffect } from 'react';
import { Task } from './Task';
import { ReduxStoreProviderDecorator } from '../../ReduxStoreProviderDecorator';
import { useDispatch, useSelector } from 'react-redux';
import { AppRootStateType } from '../../model/store';
import { TaskType } from '../../AppWithRedux';
import { addTaskAC } from '../../model/task-reducer';

//META
const meta = {
    title: 'TODOLISTS/Task',
    component: Task,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {},
    args: {
        task: {id: '1', title: 'JS', isDone: false},
        listID: 'todolistId1'
    },
    decorators: [ReduxStoreProviderDecorator]
} satisfies Meta<typeof Task>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TaskStory: Story = {};

const TaskToggle = () => {

    let task = useSelector<AppRootStateType, TaskType>(state => state.tasks['todolistId1'][0])
    const dispatch = useDispatch()

    useEffect(() => {
        if (!task) {
            dispatch(addTaskAC('todolistId1', 'Default task'));
        }
    }, [task]);

    if (!task) {
        return null; // возвращаем null, если task не существует
    }

    console.log(task)
    return <Task key={ task.id } task={ task } listID={ 'todolistId1' } />

}

export const TaskToggleStory: Story = {
    render: () => <TaskToggle />
}
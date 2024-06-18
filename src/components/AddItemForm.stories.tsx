import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { AddItemForm, AddItemFormPropsType } from './AddItemForm';
import React, { ChangeEvent, KeyboardEvent, memo, useState } from 'react';
import { IconButton, TextField } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

//META
const meta = {
    title: 'TODOLISTS/AddItemForm',
    component: AddItemForm,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        addItem: {
            description: 'Button clicked inside form',
            action: 'clicked'
        }
    },
    args: {addItem: fn()},
} satisfies Meta<typeof AddItemForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AddItemForm1: Story = {};

export const AddItemFormWithError = memo(( {addItem}: AddItemFormPropsType ) => {
    const [title, setTitle] = useState<string>('')
    const [error, setError] = useState<string | null>('Title is required')

    const onChangeInputHandler = ( e: ChangeEvent<HTMLInputElement> ) => {
        setTitle(e.currentTarget.value)
    }
    const onKeyUpInputHandler = ( e: KeyboardEvent<HTMLInputElement> ) => {
        if (e.key === 'Enter') {
            addItemHandler()
        }
    }
    const addItemHandler = () => {

        if (title.trim() !== '') {
            addItem(title.trim())
            setTitle('')
            setError('')
        } else {
            setError('Title is required')
        }
    }

    return <>
        <TextField
            label="Enter a title"
            variant={ 'outlined' }
            className={ error ? 'error' : '' }
            value={ title }
            size={ 'small' }
            onChange={ onChangeInputHandler }
            onKeyUp={ onKeyUpInputHandler }
            error={ !!error }
            helperText={ error }
        />

        <IconButton color={ 'primary' } onClick={ addItemHandler }>
            <AddCircleOutlineIcon />
        </IconButton>
    </>

})

export const AddItemFormWithErrorStory: Story = {
    render: ( args ) => <AddItemFormWithError addItem={ args.addItem } />
}
// import * as React from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import React, { ChangeEvent, KeyboardEvent, memo, useState } from 'react';
import { IconButton, TextField } from '@mui/material';

type AddItemFormPropsType = {
    addItem: ( title: string ) => void
};

export const AddItemForm = memo(( {addItem}: AddItemFormPropsType ) => {
    const [title, setTitle] = useState<string>('')
    const [error, setError] = useState<string | null>(null)

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
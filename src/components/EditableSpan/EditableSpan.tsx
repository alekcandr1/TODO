import * as React from 'react';
import { ChangeEvent, FocusEventHandler, useState } from 'react';
import { TextField } from '@mui/material';
import { RequestStatusType } from '../../model/app-reducer';

type EditableSpanPropsType = {
    title: string
    onChange: ( newTitle: string ) => void
    disabled?: boolean
};
export const EditableSpan = React.memo(( {title, onChange, disabled}: EditableSpanPropsType ) => {
    const [value, setValue] = useState<string>(title)
    const [editMode, setEditMode] = useState(false)
    const activateEditMode = () => {
        setEditMode(true)
    }
    const deactivateEditMode: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement> = ( e ) => {
        onChange(e.currentTarget.value)
        setEditMode(false)
    }
    const onChangeHandler = ( e: ChangeEvent<HTMLInputElement> ) => {
        setValue(e.currentTarget.value)
    }
    return (
        <>
            { editMode ? (
                <TextField
                    variant={ 'outlined' }
                    value={ value }
                    size={ 'small' }
                    onChange={ onChangeHandler }
                    onBlur={ deactivateEditMode }
                    autoFocus
                    disabled={ disabled }
                />
            ) : (
                <span onDoubleClick={ activateEditMode }>{ title }</span>
            ) }

        </>
    );
})



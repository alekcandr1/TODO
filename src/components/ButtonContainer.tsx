import { Button } from '@mui/material';
import { FilterType } from '../AppWithRedux';
import React, { memo } from 'react';

type ButtonContainerPropsType = {
    title: FilterType
    changeFilterHandler: ( title: FilterType ) => void
    variantButton: 'text' | 'outlined' | 'contained'| undefined
}

const ButtonContainer = memo(( {title, variantButton, changeFilterHandler, ...rest}: ButtonContainerPropsType ) => {
    return <Button
        variant={variantButton}
        color={ 'inherit' }
        onClick={ () => changeFilterHandler(title) }
        { ...rest }>
        { title }
    </Button>
})

export default ButtonContainer
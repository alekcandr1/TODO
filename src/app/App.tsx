import React from 'react';
import './App.css';
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Unstable_Grid2'
import { TodolistsList } from '../features/TodolistsList/TodolistsList';

function App() {
    return (
        <Grid className="App">
            <AppBar position="static" className={ 'app-bar' }>
                <Toolbar>
                    <IconButton color="inherit">
                        <MenuIcon />
                    </IconButton>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>

            <Container fixed className={ 'main-content' }>
                <TodolistsList />
            </Container>
        </Grid>
    );
}

export default App;

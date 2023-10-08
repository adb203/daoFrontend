import React from 'react';
import DAOInterface from './components/DAOInterface';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const cryptoDarkTheme = createTheme({
    typography: {
        fontFamily: "'Roboto', sans-serif"
    },
    palette: {
        mode: 'dark',
        primary: {
            main: '#3A416F',
        },
        secondary: {
            main: '#7D48FF',
        },
        background: {
            default: '#1C1C1E',
            paper: '#272838'
        },
        text: {
            primary: '#E6E6E6',
            secondary: '#B0B0B0'
        },
        action: {
            active: '#FFAB40'
        }
    },
});

function App() {
    return (
        <ThemeProvider theme={cryptoDarkTheme}>
            <CssBaseline />
            <DAOInterface />
        </ThemeProvider>
    );
}

export default App;

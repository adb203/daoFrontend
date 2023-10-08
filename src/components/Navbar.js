import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Avatar, ClickAwayListener, Paper, Popper } from '@mui/material';
import DiamondIcon from '@mui/icons-material/Diamond';

function Navbar({ account }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleClose = () => {
        setIsDropdownOpen(false);
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <DiamondIcon />
                <Typography variant="h6" sx={{ flexGrow: 1, marginLeft: 1 }}>
                    D A O
                </Typography>
                {account.id && (
                    <>
                        <Avatar sx={{ bgcolor: 'secondary.main', marginRight: 1 }}>
                            {account.id.substring(0, 2)}
                        </Avatar>
                        <Typography 
                            variant="body2" 
                            sx={{ marginRight: 2, cursor: 'pointer' }} 
                            onClick={handleClick}
                        >
                            {`${account.id.substring(0, 6)}...${account.id.substring(account.id.length - 4)}`}
                        </Typography>
                        <Popper open={isDropdownOpen} anchorEl={anchorEl} placement="bottom-end">
                            <ClickAwayListener onClickAway={handleClose}>
                                <Paper style={{ padding: '10px' }}>
                                    <Typography variant="body2">Full Address: {account.id}</Typography>
                                    <Typography variant="body2">Balance: {account.balance} ETH</Typography>
                                </Paper>
                            </ClickAwayListener>
                        </Popper>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;

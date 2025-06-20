import React from 'react';
import './message.css';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton } from '@mui/material';

const RemoveMessage = ({ description, iCon, cancelClcik, acceptedClick, message, isOpen }) => {
    return (
        <Dialog
            open={isOpen}
            onClose={cancelClcik}
            aria-labelledby="remove-message-dialog-title"
            aria-describedby="remove-message-dialog-description"
        >
            <DialogTitle id="remove-message-dialog-title" className="d-flex align-items-center">
                <IconButton className="message-icon" edge="start" disableRipple>
                    <RiDeleteBin5Line />
                </IconButton>
                <Typography variant="h6" color="error" className="ps-3">
                    {message}
                </Typography>
            </DialogTitle>

            <DialogContent>
                <Typography id="remove-message-dialog-description" className="py-2">
                    {description}
                </Typography>
            </DialogContent>

            <DialogActions>
                <Button onClick={cancelClcik} color="inherit" variant="contained">
                    No
                </Button>
                <Button onClick={acceptedClick} color="error" variant="contained">
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RemoveMessage;

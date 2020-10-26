import React from 'react';
import {Button, TextField, Snackbar, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, ListItem, ListItemAvatar, Avatar, List, ListItemText } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

const Collabs = ({open, setOpenColabs, materiaId}) => {

    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
      }

    const handleClick = () => {
        //setOpenSnack(true);
    };

    const handleSnackClose = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }

        //setOpenSnack(false);
    };

    const handleClose = () => {
        open = false;
    };

    const handleChange = (event) => {
        //setEmail(event.target.value);
    }; 

    const handleListItemClick = (event) => {}
    //buscar los ids de usuarios de la materia
    //mostrarlos


    return ( 
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
            <DialogTitle id="simple-dialog-title">Set backup account</DialogTitle>
            <List>
                {/* {emails.map((email) => (
                <ListItem button onClick={() => handleListItemClick(email)} key={email}>
                    <ListItemAvatar>
                    <Avatar className={classes.avatar}>
                        <PersonIcon />
                    </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={email} />
                </ListItem>
                ))}
 */}
                <ListItem autoFocus button onClick={() => handleListItemClick('addAccount')}>
                <ListItemAvatar>
                    <Avatar>

                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Add account" />
                </ListItem>
            </List>
        </Dialog> 
    );
}

export default Collabs;
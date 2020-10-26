import React, {useState} from 'react'
import {Button, TextField, IconButton, makeStyles} from '@material-ui/core';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import PeopleIcon from '@material-ui/icons/People';
import { db} from '../../services/firebase/setup';
import { getUserDetail } from '../../services/UserService';
import Invite from './Invite';


const useStyles = makeStyles((theme) => ({
    materiaContent: {
        marginTop: theme.spacing(2),
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minWidth: 300,
        maxHeight: 100,
        background: '#30E3CA'
    },
    floatingButtonInvite: {
        position: 'fixed',
        bottom: 0,
        right: 0,
        marginBottom: '12px',
        marginRight: '12px',
        color: 'white',
        backgroundColor: theme.palette.primary.main
    },
    floatingButtonColabs: {
        position: 'fixed',
        bottom: 0,
        left: 0,
        marginBottom: '12px',
        marginLeft: '12px',
        color: 'white',
        backgroundColor: theme.palette.primary.main
    },



}));

const Tasks = (props) => {

    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const materiaId = props.location.state.materiaId;

    const handleClickOpen = () => {
        setOpen(true);
    };
   
    return (
        <>
            <Invite 
                open={open}
                setOpen={setOpen}
                materiaId={materiaId}
            />
            <IconButton
                className={classes.floatingButtonInvite}
                arial-label="Add"
                onClick={handleClickOpen}
            >
                <PersonAddIcon style={{ fontSize: "40px" }} />
            </IconButton>

            <IconButton
                className={classes.floatingButtonColabs}
                arial-label="Add"
                onClick={handleClickOpen}
            >
                <PeopleIcon style={{ fontSize: "40px" }} />
            </IconButton>
            
        </>      
     );
}
 
export default Tasks;

import React, {useState} from 'react'
import { useParams } from 'react-router-dom'
import {Button, TextField, IconButton, makeStyles} from '@material-ui/core';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { db} from '../../services/firebase/setup';
import { getUserDetail } from '../../services/UserService';
import Invite from '../Tasks/Invite';


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
    floatingButton: {
        position: 'fixed',
        bottom: 0,
        right: 0,
        marginBottom: '12px',
        marginRight: '12px',
        color: 'white',
        backgroundColor: theme.palette.primary.main
    }

}));

const Subject = (props) => {

    const { materiaId } = useParams();
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    //const materiaId = props.location.state.materiaId;

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
                className={classes.floatingButton}
                arial-label="Add"
                onClick={handleClickOpen}
            >
                <PersonAddIcon style={{ fontSize: "40px" }} />
            </IconButton>
            
        </>      
     );
}
 
export default Subject;

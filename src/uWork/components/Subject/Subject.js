import React, {useState} from 'react'
import { useParams } from 'react-router-dom'
import {Button, TextField, IconButton, makeStyles} from '@material-ui/core';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import GroupIcon from '@material-ui/icons/Group';
import { db} from '../../services/firebase/setup';
import { getUserDetail } from '../../services/UserService';
import Invite from './Invite';
import Collabs from './Collabs';


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
    floatingButtonCollabs: {
        position: 'fixed',
        bottom: 0,
        left: 0,
        marginBottom: '12px',
        marginLeft: '12px',
        color: 'white',
        backgroundColor: theme.palette.primary.main
    }

}));

const Subject = (props) => {

    const { materiaId } = useParams();
    const classes = useStyles();
    const [openInvite, setOpenInvite] = useState(false);
    const [openCollabs, setOpenCollabs] = useState(false);
    //const materiaId = props.location.state.materiaId;

    const handleClickOpenInvite = () => {
        setOpenInvite(true);
    };

    const handleClickOpenCollabs = () => {
        setOpenCollabs(true);
    };
   
    return (
        <>
            <Invite 
                open={openInvite}
                setOpen={setOpenInvite}
                materiaId={materiaId}
            />
            <Collabs 
                open={openCollabs}
                setOpen={setOpenCollabs}
                materiaId={materiaId}
            />
            <IconButton
                className={classes.floatingButtonInvite}
                arial-label="Agregar colaborador"
                onClick={handleClickOpenInvite}
            >
                <PersonAddIcon style={{ fontSize: "40px" }} />
            </IconButton>
            <IconButton
                className={classes.floatingButtonCollabs}
                arial-label="Ver colaboradores"
                onClick={handleClickOpenCollabs}
            >
                <GroupIcon style={{ fontSize: "40px" }} />
            </IconButton>
            
        </>      
     );
}
 
export default Subject;

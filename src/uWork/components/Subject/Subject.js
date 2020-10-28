import React, {useContext, useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import { IconButton, makeStyles, Button, Grid } from '@material-ui/core';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import GroupIcon from '@material-ui/icons/Group';
import { db} from '../../services/firebase/setup';
import { getUserDetail } from '../../services/UserService';
import Invite from './Invite';
import Collabs from './Collabs';
import { SubjectContext } from '../../context/subject';
import AddTask from '../Task/AddTask';
import CardTask from '../Task/CardTask';

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

const Subject = () => {

    const { materiaId } = useParams();
    const { setSubjectId } = useContext(SubjectContext)
    const classes = useStyles();
    const [openInvite, setOpenInvite] = useState(false);
    const [openCollabs, setOpenCollabs] = useState(false);

    useEffect(() => {
        setSubjectId(materiaId)
    }, [materiaId, setSubjectId])

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
            <AddTask
                open={open}
                setOpen={setOpen}
            />

                    <Grid item xs={12} sm={6} md={4}>
                        <CardTask/>
                    </Grid>

            <IconButton
                className={classes.floatingButtonInvite}
                arial-label="Agregar colaborador"
                onClick={handleClickOpenInvite}
            >
                <PersonAddIcon style={{ fontSize: "40px" }} />
            </IconButton>
<<<<<<< HEAD

            <Button 
            className={classes.floatingButton}
            onClick={handleClickOpen}> Agregar Tarea </Button>
=======
            <IconButton
                className={classes.floatingButtonCollabs}
                arial-label="Ver colaboradores"
                onClick={handleClickOpenCollabs}
            >
                <GroupIcon style={{ fontSize: "40px" }} />
            </IconButton>
            
>>>>>>> 91950fb786b9267c596025a3a5299ede707537d0
        </>      
    );
}

export default Subject;

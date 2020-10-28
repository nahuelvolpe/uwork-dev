import React, {useContext, useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import { IconButton, makeStyles, Button, Grid } from '@material-ui/core';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Invite from './Invite';
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

const Subject = () => {

    const { materiaId } = useParams();
    const { setSubjectId } = useContext(SubjectContext)
    const classes = useStyles();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setSubjectId(materiaId)
    }, [materiaId, setSubjectId])

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
            <AddTask
                open={open}
                setOpen={setOpen}
            />

                    <Grid item xs={12} sm={6} md={4}>
                        <CardTask/>
                    </Grid>

            <IconButton
                className={classes.floatingButton}
                arial-label="Add"
                onClick={handleClickOpen}
            >
                <PersonAddIcon style={{ fontSize: "40px" }} />
            </IconButton>

            <Button 
            className={classes.floatingButton}
            onClick={handleClickOpen}> Agregar Tarea </Button>
        </>      
    );
}

export default Subject;

import React, {useContext, useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import { IconButton, makeStyles } from '@material-ui/core';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Invite from './Invite';
import { SubjectContext } from '../../context/subject';
import * as MateriasService from '../../services/MateriasService'

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
    const { setSubjectId, setSubjectName } = useContext(SubjectContext)
    const classes = useStyles();
    const [openInvite, setOpenInvite] = useState(false);

    useEffect(() => {
        async function setSubjectData() {
            const materia = await MateriasService.getSubjectById(materiaId)
            setSubjectName(materia.nombre)
            setSubjectId(materiaId)
        }
        setSubjectData()
    }, [materiaId, setSubjectId, setSubjectName])

    const handleClickOpenInvite = () => {
        setOpenInvite(true);
    };

    return (
        <>
            <Invite 
                open={openInvite}
                setOpen={setOpenInvite}
                materiaId={materiaId}
            />
            <IconButton
                className={classes.floatingButtonInvite}
                arial-label="Agregar colaborador"
                onClick={handleClickOpenInvite}
            >
                <PersonAddIcon style={{ fontSize: "40px" }} />
            </IconButton>
        </>      
    );
}

export default Subject;

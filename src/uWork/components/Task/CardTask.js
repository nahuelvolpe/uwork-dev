import React, { useState, useContext, useEffect } from 'react';
import {
    Card, CardContent, Typography, CardActions,
    makeStyles, Avatar, Box, CardActionArea, IconButton,
    Tooltip, Chip, Menu, MenuItem
} from '@material-ui/core'
import { VisibilityRounded, Delete, CheckCircle, Timer, TimerOff, Undo } from '@material-ui/icons'
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import WarningIcon from '@material-ui/icons/Warning';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import DeleteIcon from '@material-ui/icons/Delete';
import ReplyIcon from '@material-ui/icons/Reply';
import MoreVertIcon from '@material-ui/icons/MoreVert'
import AvatarGroup from '@material-ui/lab/AvatarGroup'
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn';
import Task from './Task'
import { SubjectContext } from '../../context/subject';
import moment from 'moment'
import 'moment/locale/es-mx'
import './CardTask.css'
moment().locale('es-mx')

const useStyles = makeStyles((theme) => ({
    textTarea: {
        fontSize: '1.4rem',
        fontStyle: 'bold',
        color: 'black'
    },
    cardContent: {
        paddingTop: '4px',
        paddingBottom: '4px'
    },
    descripcion: {
        marginBottom: 0,
        color: 'black'
    },
    actionArea: {
        padding: '4px'
    },
    actionButtons: {
        marginLeft: theme.spacing(1),
        padding: 0,
        color: 'black'
    },
    tooltip: {
        marginTop: 0,
    },
    finalizarButton: {
        color: 'green'
    },
    chipOutline: {
        border: '2px solid rgb(59 128 4)',
        backgroundColor: '#abf76e'
    },
    chipLabel: {
        color: 'rgb(59 128 4)',
        fontWeight: 'bold'
    },
    chipOutlineExpired: {
        border: '2px solid rgb(152 8 8)',
        backgroundColor: '#ff7e7d'
    },
    chipLabelExpired: {
        color: 'rgb(152 8 8)',
        fontWeight: 'bold'
    },
    warningIcon: {
        margin: '0px !important',
        padding: '0 0 3px 0 !important',
        color: '#ffc107'
    },
    checkIcon: {
        margin: '0px !important',
        padding: '2px 0 0 0 !important',
    }
}))

const CardTask = (props) => {
    const classes = useStyles()
    const { data, acceptTaskHandler, deleteHandler, index } = props
    const [open, setOpen] = useState(false)
    const { subjectId } = useContext(SubjectContext)
    const [anchorEl, setAnchorEl] = useState(null)
    const openMenu = Boolean(anchorEl)

    useEffect(() => {
        setOpen(false)
        return () => setOpen(false);
    }, [])

    const handleView = async () => {
        if (open) {
            await setOpen(false)
        }
        setOpen(true);
    }

    const handleFinished = (event) => {
        props.finishedHandler(data.tareaId, subjectId)
        event.stopPropagation()
        setAnchorEl(null)
    }

    const handlePendiente = (event) => {
        props.pendienteHandler(data.tareaId, subjectId)
        event.stopPropagation()
        setAnchorEl(null)
    }

    const handleClick = (event) => {
        event.stopPropagation()
        setAnchorEl(event.currentTarget)
    }

    const handleClose = (event) => {
        event.stopPropagation()
        setAnchorEl(null)
    }

    return (
        <>
            <div className="card" onClick={() => handleView()}>
                <div className="card__info">

                    {data.estado === 'pendiente' ? (
                        (moment().isBefore(moment(data.fechaLimite, 'DD-MM-YYYY'))) ?
                            <>
                                <h3>{data.titulo}</h3>
                                <h4>{`Vencimiento: ${data.fechaLimite}`}</h4>
                                {/* <h4>Vencimiento: <span>{data.fechaLimite}</span></h4> */}
                            </>
                            :
                            <>
                                <h3>{data.titulo} <WarningIcon className={classes.warningIcon}/> </h3>
                                
                                {/* <h4>{`Vencimiento: ${data.fechaLimite}`}</h4> */}
                                <h4>Vencimiento: <span style={{color: "#e93e3e"}}>{data.fechaLimite}</span></h4>                         
                                {/* <h4>Vencimiento: <span style={{color: "#e93e3e"}}>{data.fechaLimite}</span> <WarningIcon className={classes.warningIcon}/></h4> */} 
                            </>
                    )
                        :
                        <>
                            <div className="check">
                                <h3>{`${data.titulo}`}</h3>
                                <CheckCircleIcon color="secondary" className={classes.checkIcon} />
                            </div>  
                            <h4>{`Vencimiento: ${data.fechaLimite}`}</h4>
                        </>
                    }
                </div>

                <div className="card__avatars">
                    <AvatarGroup max={3}>
                        {
                            Object.keys(data.colaboradores).map(id => {
                                return <Avatar key={id} alt={data.colaboradores[id].name} src={data.colaboradores[id].photoURL} />
                            })
                        }
                    </AvatarGroup>
                </div>

                <div className="card__menu">
                    <IconButton
                        aria-label="more"
                        aria-controls="long-menu"
                        aria-haspopup="true"
                        onClick={handleClick}
                        style={{ float: 'right', padding: 0, color: 'black' }}
                    >
                        <MoreVertIcon />
                    </IconButton>

                </div>

            </div>

            <Menu
                id="long-menu"
                anchorEl={anchorEl}
                getContentAnchorEl={null}
                keepMounted
                open={openMenu}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        maxHeight: 48 * 4.5,
                        width: '20ch',
                    },
                }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                {data.estado === 'pendiente' ?
                    <div>
                        <MenuItem onClick={handleFinished}>
                            <CheckBoxIcon /> Finalizar
                                         </MenuItem>
                        <MenuItem onClick={() => { deleteHandler(data.tareaId, Object.keys(data.colaboradores).length) }}>
                            <DeleteIcon /> Eliminar
                                         </MenuItem>
                    </div>
                    :
                    <MenuItem onClick={handlePendiente}>
                        <KeyboardReturnIcon /> Pendiente
                                    </MenuItem>
                }
            </Menu>

            {open && <Task
                open={open}
                setOpen={setOpen}
                data={data}
                index={index}
                acceptHandler={acceptTaskHandler}
            />}
        </>
    )
}

export default CardTask;
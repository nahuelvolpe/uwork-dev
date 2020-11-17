import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, makeStyles,
    IconButton, Menu, MenuItem, Box } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete';
import ReplyIcon from '@material-ui/icons/Reply';
import MoreVertIcon from '@material-ui/icons/MoreVert'
import * as MateriasService from '../../services/MateriasService'
import './CardSubject.css'

const useStyles = makeStyles((theme) => ({
    textMateria: {
        fontSize: '1.4rem',
        fontStyle: 'bold',
        color: '#FFFFFF'
    },
    cardContent: {
        marginTop: theme.spacing(2),
        background: 'linear-gradient(45deg, #8f34a4 15%, #a53493)'
        //bc3480
    },
    carrera: {
        marginBottom: 0,
        color: '#FFFFFF'
    },
    button: {
        color: '#FFF',
        borderColor: '#FFF',
    }

}))

function createRipple(event) {
    const card = event.currentTarget;

    const circle = document.createElement("span");
    const diameter = Math.max(card.clientWidth, card.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - card.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - card.offsetTop - radius}px`;
    circle.classList.add("ripple");

    const ripple = card.getElementsByClassName("ripple")[0];

    if (ripple) {
        ripple.remove();
    }

    card.appendChild(circle);
}

const CardSubject = (props) => {

    const classes = useStyles()
    const { data, history, deleteHandler, exitHandler } = props
    const materiaId = data.materiaId;
    const [admin, setAdmin] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const cards = document.getElementsByClassName("card-content-test")
    if (cards.length) {
        for (const card of cards) {
            card.addEventListener("click", createRipple);
        }
    }

    useEffect(() => {
        const verificarAdmin = async () => {
            const isAdmin = await MateriasService.verifyAdmin(materiaId)
            setAdmin(isAdmin)
        }
        verificarAdmin()
    }, [materiaId])

    const handleClick = (event) => {
        event.stopPropagation()
        setAnchorEl(event.currentTarget)
    }

    const handleClose = (event) => {
        event.stopPropagation()
        setAnchorEl(null)
    }

    const handleOption = (event) => {
        event.stopPropagation()
        if (admin) {
            deleteHandler(materiaId)
        } else {
            exitHandler(materiaId)
        }
        setAnchorEl(null)
    }

    return (
        <div>
            <Card className={classes.cardContent} key={data.materiaId}>
                <CardContent className="card-content-test" onClick={() => { history.push(`/subject/${materiaId}`) }} id="card-content-test">
                    <Box display="flex" flexDirection="row" justifyContent="space-between" style={{ marginTop: 16 }}>
                        <Box>
                            <Typography className={classes.textMateria} variant="h5" component="h2">
                                {data.nombre}
                            </Typography>
                        </Box>
                        <Box>
                            <IconButton
                                aria-label="more"
                                aria-controls="long-menu"
                                aria-haspopup="true"
                                onClick={handleClick}
                                style={{ float: 'right', padding: 0, color: 'white' }}
                            >
                                <MoreVertIcon />
                            </IconButton>
                            <Menu
                                id="long-menu"
                                anchorEl={anchorEl}
                                getContentAnchorEl={null}
                                keepMounted
                                open={open}
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
                                {
                                    admin ? <MenuItem onClick={handleOption}>
                                                <DeleteIcon/> Eliminar
                                            </MenuItem>
                                    : <MenuItem onClick={handleOption}>
                                        <ReplyIcon/> Salir
                                    </MenuItem>
                                }
                            </Menu>
                        </Box>
                    </Box>
                    <Box display="flex" flexDirection="row">
                        <Typography className={classes.carrera}>
                            {data.carrera}
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </div>
    )
}

export default CardSubject;
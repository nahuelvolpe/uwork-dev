import 'date-fns';
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Button, List, ListItem, ListItemAvatar, Avatar, ListItemText, ListItemSecondaryAction, Checkbox} from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers';
import Grid from '@material-ui/core/Grid';
import * as MateriasService from '../../services/MateriasService';


const useStyles = makeStyles((theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    width: 'fit-content',
  },
  formControl: {
    marginTop: theme.spacing(2),
    minWidth: 120,
  },
  formControlLabel: {
    marginTop: theme.spacing(1),
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  titulo: {
    marginBottom: theme.spacing(2)
  },
  dialogTitle: {
    marginBottom: theme.spacing(1),
    alignContent: 'center',
    textAlign: 'center'
  }
}));

  

export default function AddSubject(props) {

  const { open, setOpen, subjectId, acceptHandler } = props
  const classes = useStyles();
  const [colaboradores, setColaborares] = useState([]);
  const [colabCargo, setColabCargo] = React.useState([]);
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [descripcion, setDescripcion] = useState('');
  const [titulo, setTitulo] = useState('')

  useEffect(() => {
      const cargarUsuarios = async () => {
          if(subjectId) {
              const collabs = await MateriasService.getCollabsFromSubject(subjectId)
              setColaborares(collabs)
          }
      }
      cargarUsuarios()
  }, [subjectId])

  const handleToggle = (colaborador) => () => {
    const currentIndex = colabCargo.indexOf(colaborador);
    const newChecked = [...colabCargo];

    if (currentIndex === -1) {
      newChecked.push(colaborador);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setColabCargo(newChecked);
  };

  const handleClose = () => {
        setOpen(false);
  };

  const onAccept = () => {
    let collabs = {};
    let colaborador = {};
    colabCargo.map((colab)=>{
     colaborador = {[colab.uid]: new Date()}
     collabs = {...collabs, ...colaborador}
    })
    acceptHandler({titulo: titulo, descripcion: descripcion, colabCargo: collabs, fechaLimite: selectedDate})
    setOpen(false)
  }

  const handleCollab = (event) => {
    setColabCargo(event.target.value);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleDescripcionChange = (event) => {
    setDescripcion(event.target.value)
  };

  const handleTituloChange = (event) => {
    setTitulo(event.target.value)
  };

  return (
    <React.Fragment>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="dialog-title"
      >
        <h2 className={classes.dialogTitle} >Nueva Tarea</h2>
        <DialogContent>
          
          <form className={classes.form} noValidate>
            <FormControl className={classes.formControl}>
            <TextField className={classes.titulo} id="standard-basic" variant="outlined" label="Titulo" autoComplete="off" value={titulo} onChange={handleTituloChange}/>
                  
            <TextField id="standard-basic" label="Descripcion" variant="outlined" multiline rows={4} autoComplete="off" value={descripcion} onChange={handleDescripcionChange}/>
                  
            <FormControl variant="outlined" className={classes.formControl}>
            {/* <InputLabel id="demo-simple-select-outlined-label">Colaborador/es a cargo</InputLabel> */}
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography className={classes.heading}>Seleccionar colabodores</Typography>
              </AccordionSummary>
              <AccordionDetails>
              <List dense className={classes.root}>
                {colaboradores.map((colaborador) => {
                  return (
                    <ListItem key={colaborador.uid} button>
                      <ListItemAvatar>
                        <Avatar
                          alt={colaborador.firstName}
                          src={colaborador.photoURL}
                        />
                      </ListItemAvatar>
                      <ListItemText id={colaborador.uid} primary={`${colaborador.firstName} ${colaborador.lastName}`} />
                      <ListItemSecondaryAction>
                        <Checkbox
                          edge="end"
                          onChange={handleToggle(colaborador)}
                          checked={colabCargo.indexOf(colaborador) !== -1}
                          inputProps={{ 'aria-labelledby': colaborador.uid }}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  );
                })}
              </List>
              </AccordionDetails>
            </Accordion>
            </FormControl>

      {<MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid container justify="space-around">
          <KeyboardDatePicker
            disableToolbar
            variant="outlined"
            format="dd/MM/yyyy"
            margin="normal"
            id="date-picker-inline"
            label="Fecha Límite"
            value={selectedDate}
            onChange={handleDateChange}
            KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
          /> 
        </Grid>
      </MuiPickersUtilsProvider>  }
            
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={onAccept} color="primary">
            Aceptar
          </Button>
          <Button onClick={handleClose} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
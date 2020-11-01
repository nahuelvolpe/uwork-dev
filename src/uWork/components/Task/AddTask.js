import 'date-fns';
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers';
import Grid from '@material-ui/core/Grid';


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
  }
}));

  

export default function AddSubject(props) {
  const { open, setOpen, acceptHandler } = props
  const classes = useStyles();

  const handleClose = () => {
        setOpen(false);
  };

  const onAccept = () => {
    console.log("Tarea agregada")
    setOpen(false)
  }

  const [colabCargo, setColabCargo] = React.useState('');

  const handleCollab = (event) => {
    setColabCargo(event.target.value);
  };

  const [selectedDate, setSelectedDate] = React.useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <React.Fragment>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="dialog-title"
      >
        <DialogTitle id="dialog-title">Nueva Tarea</DialogTitle>
        <DialogContent>
          
          <form className={classes.form} noValidate>
            <FormControl className={classes.formControl}>
            <TextField id="standard-basic" label="Nombre" autocomplete="off"/>
                  
            <TextField id="standard-basic" label="Descripcion" multiline rows={4} autocomplete="off"/>
                  
            <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="demo-simple-select-outlined-label">Colaborador/es a cargo</InputLabel>
            <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            label="Colaborador/es a cargo"
            onChange={handleCollab}
            >
            <MenuItem value="">
            <em>None</em>
            </MenuItem>
            <MenuItem value={"Dan Suarez"}>Dan Suarez</MenuItem>
            <MenuItem value={"Nahui Volpe"}>Nahui Volpe</MenuItem>
            </Select>
            </FormControl>

      {<MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid container justify="space-around">
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
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
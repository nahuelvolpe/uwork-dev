import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/core/styles';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
    background: '#ab003c',
    color: 'white'
  },
}));

export default function AlertTaskDialog(props) {

  

  const {open, setOpen, taskId, subjectId, cantColaboradores, acceptHandler} = props;
  const classes = useStyles();


  const handleClose = () => {
    setOpen(false);
  };

  const handleAccept = () => {
    acceptHandler(taskId, subjectId)
    setOpen(false)
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Advertencia</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
              {`En esta tarea hay ${cantColaboradores} ${cantColaboradores > 1 ? 'colaboradorxs' : 'colaborador/a'} a cargo, estas segurx que desea eliminarla?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
          variant="contained"
          className={classes.button}
          startIcon={<DeleteIcon />}
          onClick={handleAccept}
          autoFocus >
            Eliminar
          </Button>

          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
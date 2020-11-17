import React, { useState } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl,
  InputLabel, MenuItem, Select, makeStyles } from '@material-ui/core'
import * as MateriasService from '../../services/MateriasService'
import * as UserService from '../../services/UserService'
import AuthenticationService from '../../services/AuthenticationService'
import careers from '../../services/subjects/careers.json'
import subjects from '../../services/subjects/subjects.json'
import AdornedButton from '../AdornedButton/AdornedButton'
import CustomizedSnackbars from '../CustomSnackBar/CustomSnackBar'
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    width: '100%',
    maxWidth: '180px'
  },
  formControl: {
    marginTop: theme.spacing(2)
  },
  formControlLabel: {
    marginTop: theme.spacing(1),
  },
  botonAccept: {
    color: 'white'
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  }
}));

export default function AddSubject(props) {
  const { open, setOpen, acceptHandler, errorHandler } = props
  const classes = useStyles()
  const userId = AuthenticationService.getSessionUserId()

  const [subject, setSubject] = useState({})
  const [career, setCareer] = useState({})
  const [subjectOptions, setOptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [subjectExists, setSubjectExists] = useState(false)

  const getIndex = (id, array) => {
    let i
    array.forEach((el, index) => {
      if (el.id === id) {
        i = index
      }
    })
    return i
  }

  const handleClose = () => {
    setOpen(false);
  }

  const handleCarrera = (e) => {
    setCareer(e.target.value)
    let filteredOptions = subjects.filter(s => s.career === e.target.value.id)
    setOptions(filteredOptions)
  }

  const handleSubject = (e) => {
    setSubject(e.target.value)
  }

  const handleCloseSnackError = () => {
    setSubjectExists(false)
  }

  const onAccept = async () => {
    setLoading(true)
    let exist = await UserService.existSubject(subject.description, career.description, userId)
    if (!exist) {
      let materia = { career: career.description, subject: subject.description, link: subject.link }
      MateriasService.createSubject(materia, userId)
        .then(async (doc) => {
            await UserService.updateUser(userId, { materias: { [doc.id]: 'admin' }})
            return MateriasService.getSubjectById(doc.id)
        })
        .then((newMateria) => {
          setLoading(false)
          acceptHandler(newMateria)
          setOpen(false)
        })
        .catch(err => {
          console.log(err)
          setLoading(false)
          errorHandler()
        })
    } else {
      setLoading(false)
      setSubjectExists(true)
    }
  }


  return (
    <React.Fragment>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="dialog-title"
        >
          <DialogTitle id="dialog-title">Agregar una materia</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Primero elija la carrera y luego la materia
              </DialogContentText>
              <form className={classes.form} noValidate>
                <FormControl required className={classes.formControl}>
                  <InputLabel htmlFor="carrera">Carrera</InputLabel>
                  <Select
                    value={careers[getIndex(career.id, careers)] || ''}
                    onChange={handleCarrera}
                  >
                    {
                      careers.map(
                        (career) => <MenuItem key={career.id} value={career}>{career.description}</MenuItem>
                      )
                    }
                  </Select>
                </FormControl>
                <FormControl required className={classes.formControl}>
                  <InputLabel htmlFor="subject">Materia</InputLabel>
                  <Select
                    value={subjectOptions[getIndex(subject.id, subjectOptions)] || ''}
                    onChange={handleSubject}
                  >
                    {
                      subjectOptions.map(
                        subject => <MenuItem key={subject.id} value={subject}>{subject.description}</MenuItem>
                      )
                    }
                  </Select>
                </FormControl>
              </form>
            </DialogContent>
            <DialogActions>
              <AdornedButton className={classes.botonAccept} onClick={onAccept} variant="contained" color="secondary" loading={loading} disabled={loading || (!career.id || !subject.id)} >
                Aceptar
              </AdornedButton>
              {/* <Button onClick={handleClose} color="primary">
                Cerrar
              </Button> */}
              <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </DialogActions>
        </Dialog>
        <CustomizedSnackbars open={subjectExists} handleClose={handleCloseSnackError} severity="error">
            La materia seleccionada ya existe dentro de sus materias.
        </CustomizedSnackbars>
    </React.Fragment>
  );
}
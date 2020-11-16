import React, { useState } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl,
  InputLabel, MenuItem, Select, makeStyles } from '@material-ui/core'
import * as MateriasService from '../../services/MateriasService'
import * as UserService from '../../services/UserService'
import AuthenticationService from '../../services/AuthenticationService'
import careers from '../../services/subjects/careers.json'
import subjects from '../../services/subjects/subjects.json'
import AdornedButton from '../AdornedButton/AdornedButton';

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
}));

export default function AddSubject(props) {
  const { open, setOpen, acceptHandler, errorHandler } = props
  const classes = useStyles()
  const userId = AuthenticationService.getSessionUserId()

  const [subject, setSubject] = useState({})
  const [career, setCareer] = useState({})
  const [subjectOptions, setOptions] = useState([])
  const [loading, setLoading] = useState(false)

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

  const onAccept = () => {
    setLoading(true)
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
                Primero elegí la carrera y luego la materia
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
              <AdornedButton onClick={onAccept} variant="contained" color="primary" loading={loading} disabled={loading || (!career.id || !subject.id)} >
                Aceptar
              </AdornedButton>
              <Button onClick={handleClose} color="primary">
                Cerrar
              </Button>
            </DialogActions>
        </Dialog>
    </React.Fragment>
  );
}
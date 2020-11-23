import React, {useState} from 'react'
import { IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, makeStyles } from '@material-ui/core';
import CustomizedSnackbars from '../CustomSnackBar/CustomSnackBar'
import { Formik, Form } from "formik"
import * as Yup from 'yup'
import FormikField from "../FormikField/FormikField"
import * as MateriasService from '../../services/MateriasService'
import AdornedButton from '../AdornedButton/AdornedButton'
import AuthenticationService from '../../services/AuthenticationService'
import CloseIcon from '@material-ui/icons/Close'

const InviteSchema = Yup.object().shape({
    email: Yup.string()
        .required("Debe ingresar un email para enviar la invitación!")
        .email("Formato inválido!")
})

const useStyles = makeStyles((theme) => ({
    botonAccept: {
        color: 'white'
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    }
}))

const Invite = ({open, setOpen, materiaId, successHandler}) => {

    const [email, ] = useState('')
    const [errorMessage, setErrorMessage] = useState('Error al enviar invitación.')
    const [openErrorSnackBar, setOpenErrorSnackBar] = useState(false)
    const [loading, setLoading] = useState(false)
    const classes = useStyles();

    const handleClose = () => {
        setOpen(false)
    }

    const handleCloseSnackError = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }
        setOpenErrorSnackBar(false)
    }

    const onSubmit = async (values) => {
        setLoading(true)
        const isValid = await isEmailValid(values.email)
        if(!isValid){
            setLoading(false)
            setOpenErrorSnackBar(true)
        } else {
            MateriasService.inviteUser(values.email, materiaId)
            .then(() => {
                setLoading(false)
                successHandler()
                setOpen(false)
            })
            .catch(() => {
                setErrorMessage('Error al enviar invitación, quizas el email esté mal escrito.')
                setLoading(false)
                setOpenErrorSnackBar(true)
            })
        }
    }

    const isEmailValid = async (email) => {
        let isValid = true
        const user = AuthenticationService.getCurrentUser()
        if(user.email === email){
            setErrorMessage('No te puedes invitar a ti mismo!')
            isValid = false
        } else if (await MateriasService.verificarColaboradores(email, materiaId)){
            setErrorMessage('Este colaborador ya se encuentra en la materia!')
            isValid = false;
        }
        return isValid;
    }

    return ( 
        <div>
            <Formik
            initialValues={{email}}
            validationSchema={InviteSchema}
            onSubmit={onSubmit}>
            {({ errors, touched }) => (
                <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                    <Form noValidate>
                        <DialogTitle id="form-dialog-title">Añadir colaborador</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Escribe el email de la persona que quieres añadir. 
                                <strong> No se le enviara un email a esa persona, sino que se le agregará automáticamente esta materia en su cuenta.</strong>
                            </DialogContentText>
                            <FormikField required name="email" label="Email" type="email" fullWidth
                                error={errors.email && touched.email}/>
                        </DialogContent>
                        <DialogActions>
                            <AdornedButton className={classes.botonAccept}
                                type="submit"
                                variant="contained"
                                color="secondary"
                                loading={loading}
                                disabled={loading}>
                                    Enviar
                            </AdornedButton>
                            <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
                                <CloseIcon />
                            </IconButton>
                        </DialogActions>
                    </Form>
                </Dialog>
            )}
            </Formik>
            <CustomizedSnackbars open={openErrorSnackBar} handleClose={handleCloseSnackError} severity="error">
                {errorMessage}
            </CustomizedSnackbars>
        </div>
    );
}

export default Invite;
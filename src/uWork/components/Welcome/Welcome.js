import React from "react";
import { Link, withRouter } from 'react-router-dom';
import { Button, makeStyles, Grid } from "@material-ui/core";
import task from './task.svg'
import './Welcome.css'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import EmailIcon from '@material-ui/icons/Email';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import MenuBookIcon from '@material-ui/icons/MenuBook';

const useStyles = makeStyles((theme) => ({
  boton: {
    color: 'white',
    backgroundColor: theme.palette.secondary.main
  },
  root: {
    minWidth: 275,
    marginTop: theme.spacing(2),
    background: 'linear-gradient(45deg, #8f34a4 15%, #a53493)',
    color: 'white'
  },
  pos: {
    marginBottom: 12,
    color: 'white'
  },
}));

const Welcome = () => {
  const classes = useStyles();

  return (

    <div className="container">
      <div>
        <div className="logoInfo">
          <div className="logo">
            <img src='https://firebasestorage.googleapis.com/v0/b/uwork-dev-beta.appspot.com/o/assets%2FuWork.png?alt=media&token=ea6dd5fe-9312-4fac-8c50-c7964cc91939' alt='' className="imagenLogo"></img>
            <h1 className="textoLogo"> uWork</h1>
          </div>
          <div className="info">
            <h2>BIENVENIDO</h2>
            <h3>Tu aplicación para organizar tus tareas universitarias de manera colaborativa</h3>
            
          </div>
        </div>
        <div className="appInfo">
          <h3><EmailIcon/> Registrate sólo con tu eMail</h3>
          <h3><AddCircleIcon/> Asignate la/s materia/s que estés cursando</h3>
          <h3><GroupAddIcon/> Agregá a tus compañeros de grupo</h3>
          <h3><MenuBookIcon/> Crea las tareas que tienen que hacer</h3>
          <h4>¡Listo! Ya pueden organizar las tareas de la materia de manera colaborativa</h4>
          <Button className={classes.boton} component={Link} to="/login">INGRESAR</Button>
        </div>
      </div>

      <div className="illustracion">
       {/*  <img src={task} alt='' className="illustracionLogo"></img> */}
      </div>
    </div>

    
  )
}

export default withRouter(Welcome)
  
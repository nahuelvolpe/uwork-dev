import React from "react";
import { Link, withRouter } from 'react-router-dom';
import { Button, makeStyles } from "@material-ui/core";
import empty from './empty.svg'
import './NotFound.css'

const useStyles = makeStyles((theme) => ({
  boton: {
    color: 'white',
    backgroundColor: theme.palette.secondary.main
  }
}));

const NotFound = () => {
  const classes = useStyles();

  return (

    <div className="container">
      <div className="logoInfo">
        <div className="logo">
          <img src='https://firebasestorage.googleapis.com/v0/b/uwork-dev-beta.appspot.com/o/assets%2FuWork.png?alt=media&token=ea6dd5fe-9312-4fac-8c50-c7964cc91939' alt='' className="imagenLogo"></img>
          <h1 className="textoLogo"> uWork</h1>
        </div>
        <div className="info">
          <h2>UPS! Parece que aca no hay nada</h2>
          <h3>Página no encontrada</h3>
          <Button className={classes.boton} component={Link} to="/">Volver</Button>
        </div>
      </div>
      <div className="illustracion">
        <img src={empty} alt='' className="illustracionLogo"></img>
      </div>
    </div>

    
  )
}

export default withRouter(NotFound)
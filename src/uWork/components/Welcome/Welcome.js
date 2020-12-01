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
    backgroundColor: theme.palette.secondary.main,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
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
      <Grid container style={{ minHeight: "100vh" }}>
        <Grid
          container
          item xs={12} sm={6}
          alignItems="center"
          direction="column"
          justify="center"
        >
          <div className="illustracion">
        <img src={task} alt='' className="illustracionLogo"></img>
          </div>

        </Grid>

        <Grid 
        container item xs={12} sm={6}
        alignItems="center"
        direction="column"
        justify="center"
        >
          <Card className={classes.root}>
      <CardContent>
        <Typography variant="h5" component="h2">
          <EmailIcon/> Registrate sólo con tu eMail
        </Typography>
        <Typography variant="h5" component="h2">
          <AddCircleIcon/> Asignate la/s materia/s que estés cursando
        </Typography>
        <Typography variant="h5" component="h2">
          <GroupAddIcon/> Agregá a tus compañeros de grupo
        </Typography>
        <Typography variant="h5" component="h2">
          <MenuBookIcon/> Crea las tareas que tienen que hacer
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          ¡Listo! Ya pueden organizar las tareas de la materia de manera colaborativa
        </Typography>
        </CardContent>
    </Card>
    <Button className={classes.boton} component={Link} to="/login">INGRESAR</Button>
          </Grid>
      </Grid>
    </div>

    
  )
}

export default withRouter(Welcome)
  
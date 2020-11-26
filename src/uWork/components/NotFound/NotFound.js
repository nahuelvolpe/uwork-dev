import React, { useState } from "react";
import { ReactComponent as Empty} from '../NotFound/empty.svg';
import { Link, withRouter } from 'react-router-dom';
import { Button, Grid, Paper, makeStyles, Divider } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  boton: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    color: 'white'
  },
  title: {
    color: 'white',
    display: 'flex',
    alignItems: 'center'
  },
  fondo: {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='25 50 430 100' preserveAspectRatio='none'%3E%3Crect x='0' y='0' width='500' height='500' style='stroke: none; fill: %23FFFFFF;' /%3E%3Cdefs%3E%3ClinearGradient id='gradient'%3E%3Cstop offset='5%25' stop-color='%238F34A4' /%3E%3Cstop offset='80%25' stop-color='%23A53493' /%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath fill='url(%23gradient)' d='M0,100 C150,115 350,80 500,100 L500,00 L0,0 Z' style='stroke: none'%3E%3C/path%3E%3C/svg%3E");`
    },
  logo: {
    maxWidth: 40,
  },
  text: {
      color: 'white',
      textAlign: 'center'
  },
}));

const NotFound = () => {
  const classes = useStyles();

  return (
    <div className={classes.fondo}> 
       <Grid container style={{ minHeight: "100vh" }}>
        <Grid
          container
          item
          xs={12}
          alignItems="center"
          direction="column"
          justify="center"
        > 
        <div className={classes.title}>
            <img src='https://firebasestorage.googleapis.com/v0/b/uwork-dev-beta.appspot.com/o/assets%2FuWork.png?alt=media&token=ea6dd5fe-9312-4fac-8c50-c7964cc91939' alt='' className={classes.logo}></img>
            <h1 style={{fontFamily: 'Roboto', marginLeft: 8}}>uWork</h1> 
        </div>

            <div className={classes.text}>
                <h1> UPS! Parece que acá no hay nada! </h1>
                <h3> Página no encontrada</h3>
            </div>

            <div>
                <Button className={classes.boton} 
                variant="contained" color="secondary"> Volver </Button>
            </div>
        
            <Empty />
        
        </Grid>
      </Grid>
     </div>
  )
}

export default withRouter(NotFound)
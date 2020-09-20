import React, { useContext, Fragment } from 'react'
import { AuthContext } from '../../context/auth'
import { AppBar, Toolbar, IconButton, Typography, makeStyles, Container } from '@material-ui/core'
import { AccountCircle } from '@material-ui/icons'
import MenuIcon from '@material-ui/icons/Menu'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const Layout = (props) => {
  const { isLoggedIn } = useContext(AuthContext)
  const classes = useStyles();
  const { children } = props;
  return (
    <div>
      {isLoggedIn &&
        (
          <Fragment>
            <AppBar position="static">
              <Toolbar>
                <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                  Photos
                </Typography>
                <div>
                  <IconButton
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    color="inherit"
                  >
                    <AccountCircle />
                  </IconButton>
                </div>
              </Toolbar>
            </AppBar>
          </Fragment>)}
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {isLoggedIn &&
          (<Container fixed>
            {children}
          </Container>)}
        {!isLoggedIn && (<Fragment>{children}</Fragment>)}
      </main>
    </div>
  )
}

export default Layout
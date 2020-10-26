import React, { Fragment, useState } from 'react'
import { AppBar, Container, Toolbar, IconButton, Typography, makeStyles, Hidden, MenuList, MenuItem, Drawer, CssBaseline, ListItemIcon } from '@material-ui/core'
import AuthenticationService from '../../services/AuthenticationService'
import MenuIcon from '@material-ui/icons/Menu'
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';
import ReplyRoundedIcon from '@material-ui/icons/ReplyRounded';
import MenuBookRoundedIcon from '@material-ui/icons/MenuBookRounded';
import { Link } from 'react-router-dom'
import Collabs from '../Subject/Collabs'

const drawerWidth = 240
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    width: '100%'
  },
  menuButton: {
    color: 'white'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  title: {
    flexGrow: 1,
    color: 'white',
    cursor: 'pointer',
    textDecoration: 'none'
  },
  actualPage: {
    flexGrow: 1,
    color: 'white'
  },
  navIconHide: {
    [theme.breakpoints.up('md')]: {
      display: 'none'
    }
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: theme.palette.primary.main,
    color: 'white'
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
  }
}));

const Layout = (props) => {

  const [openDrawer, setOpenDrawer] = useState(false)
  const [openPopCollab, setOpenCollab] = useState(false)
  const classes = useStyles();
  const { location: { pathname }, children } = props;

  const handleOpenCollab = () => {
    setOpenCollab(!openPopCollab)
  }

  const handleDrawerToggle = () => {
    setOpenDrawer(!openDrawer)
  }

  const handleLogout = () => {
    AuthenticationService.logout()
      .then()
      .catch(error => console.log(error))
  }

  const getCurrentPageName = () => {
    switch (pathname) {
      case '/edit_profile':
        return 'Editar perfil'
        break
      case '/dashboard':
        return 'Materias'
        break
      default:
        return ''
        break
    }
  }

  const drawer = (
    <div>
      <Hidden smDown>
        <div className={classes.toolbar} />
      </Hidden>
      <MenuList>
        <MenuItem component={Link} to="/dashboard" selected={'/dashboard' === pathname}>
          <ListItemIcon>
            <MenuBookRoundedIcon fontSize="small" />
          </ListItemIcon>
          Mis Materias
        </MenuItem>
        <MenuItem component={Link} to="/edit_profile" selected={'/edit_profile' === pathname}>
          <ListItemIcon>
            <AccountCircleRoundedIcon fontSize="small" />
          </ListItemIcon>
          Editar Perfil
        </MenuItem>
        {
          pathname.includes('/subject') ?
          <MenuItem onClick={handleOpenCollab}>
            <ListItemIcon>
              <AccountCircleRoundedIcon fontSize="small" />
            </ListItemIcon>
            Ver colaboradores
            <Collabs open={openPopCollab}/>
          </MenuItem>
        : []
        }
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <ReplyRoundedIcon fontSize="small" />
          </ListItemIcon>
          Cerrar Sesión
        </MenuItem>
      </MenuList>
    </div>
  )

  return (
    <div>
      <Fragment>
        <CssBaseline />
        <div className={classes.root}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" className={classes.title} component={Link} to="/dashboard">
                uWork
              </Typography>
              <Typography variant="h6" className={classes.actualPage}>
                {getCurrentPageName()}
              </Typography>
              <div>
                <IconButton onClick={handleDrawerToggle} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                  <MenuIcon />
                </IconButton>
              </div>
            </Toolbar>
          </AppBar>
          <Drawer
            variant="temporary"
            open={openDrawer}
            anchor="right"
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper
            }}
            ModalProps={{
              keepMounted: true
            }}>
            {drawer}
          </Drawer>
        </div>
      </Fragment>
      <main className={classes.content}>
        <Container fixed>
          {children}
        </Container>
      </main>
    </div>
  )
}

export default Layout
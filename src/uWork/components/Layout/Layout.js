import React, { Fragment, useContext, useState } from 'react'
import { AppBar, Container, Toolbar, IconButton, Typography, makeStyles, Hidden, MenuList, MenuItem, Drawer, CssBaseline, ListItemIcon } from '@material-ui/core'
import AuthenticationService from '../../services/AuthenticationService'
import MenuIcon from '@material-ui/icons/Menu'
import GroupIcon from '@material-ui/icons/Group';
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';
import ReplyRoundedIcon from '@material-ui/icons/ReplyRounded';
import MenuBookRoundedIcon from '@material-ui/icons/MenuBookRounded';
import { Link } from 'react-router-dom'
import Collabs from '../Subject/Collabs'
import { SubjectContext } from '../../context/subject';

const drawerWidth = 240
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    position: 'relative',
    display: 'flex',
    width: '100%'
  },
  menuButton: {
    color: theme.palette.primary.main,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  title: {
    flexGrow: 1,
    color: theme.palette.primary.main,
    cursor: 'pointer',
    textDecoration: 'none'
  },
  actualPage: {
    flexGrow: 1,
    color: theme.palette.primary.main,
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
  },
  logo: {
    maxWidth: 40,
  },
  icons: {
    color: 'white'
  }
}));

const Layout = (props) => {

  const [openDrawer, setOpenDrawer] = useState(false)
  const [openPopCollab, setOpenCollab] = useState(false)
  const classes = useStyles();
  const { location: { pathname }, children } = props;
  const { subjectId, subjectName } = useContext(SubjectContext)

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
      case '/dashboard':
        return 'Materias'
      case `/subject/${subjectId}`:
        return subjectName
      default:
        return ''
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
            <MenuBookRoundedIcon className={classes.icons} fontSize="small" />
          </ListItemIcon>
          Mis Materias
        </MenuItem>
        <MenuItem component={Link} to="/edit_profile" selected={'/edit_profile' === pathname}>
          <ListItemIcon>
            <AccountCircleRoundedIcon className={classes.icons} fontSize="small" />
          </ListItemIcon>
          Editar Perfil
        </MenuItem>
        {
          pathname.includes('/subject') ?
          <MenuItem onClick={handleOpenCollab}>
            <ListItemIcon>
              <GroupIcon className={classes.icons} fontSize="small" />
            </ListItemIcon>
            Ver colaboradores
            {openPopCollab && <Collabs open={openPopCollab} setOpen={setOpenCollab}/>}
          </MenuItem>
        : [] 
        }
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <ReplyRoundedIcon className={classes.icons} fontSize="small" />
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
          <AppBar color='default' position="static" className={classes.appBar}>
            <Toolbar>
              <Typography className={classes.title} component={Link} to="/dashboard">
                <img src='https://firebasestorage.googleapis.com/v0/b/uwork-dev-beta.appspot.com/o/assets%2FuWork.png?alt=media&token=5ec925a9-c41a-478b-a3fd-a6b08dcda360' className={classes.logo}></img>
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
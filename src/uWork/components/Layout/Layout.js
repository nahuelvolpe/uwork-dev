import React, { Fragment, useContext, useState, useEffect } from 'react'
import { AppBar, Container, Toolbar, IconButton, Typography, makeStyles, Avatar, MenuList, MenuItem, Drawer, CssBaseline, ListItemIcon } from '@material-ui/core'
import AuthenticationService from '../../services/AuthenticationService'
import * as UserService from '../../services/UserService'
import MenuIcon from '@material-ui/icons/Menu'
import GroupIcon from '@material-ui/icons/Group';
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';
import MenuBookRoundedIcon from '@material-ui/icons/MenuBookRounded';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';
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
  userData: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: 12,
    marginTop: 12,
  },
  avatar: {
    width: theme.spacing(8),
    height: theme.spacing(8),
  },
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
  },
  footer:{
    position: 'absolute',
    bottom: 0,
    left: '25%'
  }
}));

const Layout = (props) => {

  
  const [openDrawer, setOpenDrawer] = useState(false)
  const [openPopCollab, setOpenCollab] = useState(false)
  const [userData, setUserData] = useState({})
  const classes = useStyles();
  const { location: { pathname }, children } = props;
  const { subjectId, subjectName } = useContext(SubjectContext)

  useEffect(() => {
    let mounted = true
    const loadUserData = async () => {
      const id = AuthenticationService.getSessionUserId()
      try {
        const user = await UserService.getUserDataById(id)
        if (mounted) {
          setUserData(user)
        }
      } catch (err) {
        console.log(err)
      }
    }
    loadUserData()

    return () => mounted = false
  }, [])

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
      <div className={`${classes.toolbar} ${classes.userData}`}>
        <Avatar className={classes.avatar} alt='' src={userData.photoURL}/>
        <div>
          <Typography style={{marginLeft: 8}} variant="body1">{`${userData.firstName} ${userData.lastName}`}</Typography>
        </div>
      </div>
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
            Ver Colaboradores
            {openPopCollab && <Collabs open={openPopCollab} setOpen={setOpenCollab}/>}
          </MenuItem>
        : [] 
        }
        {
          pathname.includes('/subject') ?
          <MenuItem component="a"  href='https://forouno.org/' target="_blank">
            <ListItemIcon>
              <OpenInBrowserIcon className={classes.icons} fontSize="small" />
            </ListItemIcon>
            Ir al Foro
          </MenuItem>
        : [] 
        }
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <MeetingRoomIcon className={classes.icons} fontSize="small" />
          </ListItemIcon>
          Cerrar Sesión
        </MenuItem>
      </MenuList>
      <p className={classes.footer}> uWork &copy; - Beta v0.9 </p>
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
                <img src='https://firebasestorage.googleapis.com/v0/b/uwork-dev-beta.appspot.com/o/assets%2FuWork.png?alt=media&token=ea6dd5fe-9312-4fac-8c50-c7964cc91939' alt='' className={classes.logo}></img>
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
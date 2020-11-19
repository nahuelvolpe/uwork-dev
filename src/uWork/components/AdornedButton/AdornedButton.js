import React from 'react'
import { Button, CircularProgress, makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  spinner: {
    marginLeft: '6px'
  }
}))

const SpinnerAdornment = () => {
  const classes = useStyles()

  return (
    <CircularProgress
      className={classes.spinner}
      size={20}
    />
  )
}

const AdornedButton = (props) => {
  const {
    children,
    loading,
    ...rest
  } = props
  return (
    <Button {...rest}>
      {children}
      {loading && <SpinnerAdornment {...rest} />}
    </Button>
  )
}

export default AdornedButton
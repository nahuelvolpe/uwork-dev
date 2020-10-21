import React, { Fragment } from 'react'
import { CssBaseline, Container, Box, CircularProgress } from '@material-ui/core'

const LoadingPage = () => {
  return (
    <Fragment>
      <CssBaseline />
      <Container fixed>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={1}
          m={1}
          bgcolor="background.paper"
          css={{ height: "97vh", backgroundColor: 'unset' }}
        >
          <CircularProgress size={60} thickness={4.2} />
        </Box>
      </Container>
    </Fragment>
  )
}

export default LoadingPage
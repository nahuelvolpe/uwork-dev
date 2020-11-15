import React from 'react'
import { Box, LinearProgress } from '@material-ui/core'

const LinealLoading = ({ height, children }) => {

  return (
    <Box display="block" css={{ height: height ? height : '50vh' }}>
      <div
          style={{top: '50%',
              left: '50%',
              width: '30%',
              transform: 'translate(-50%, -50%)',
              position: 'absolute',
              margin: 0,
              textAlign: 'center'
          }}
          >
          {children}
          <LinearProgress />
      </div>
    </Box>
  )
}

export default LinealLoading
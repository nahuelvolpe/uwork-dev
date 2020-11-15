import React from 'react';
import MuiAlert from '@material-ui/lab/Alert';
import { Snackbar } from '@material-ui/core';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const CustomizedSnackbars = (props) => {
  return (
    <div>
      <Snackbar open={props.open} autoHideDuration={6000} onClose={props.handleClose}>
        <Alert onClose={props.handleClose} severity={props.severity}>
          {props.children}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default CustomizedSnackbars
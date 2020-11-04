import React, { useState } from 'react'
import { Field, ErrorMessage } from 'formik'
import {
  TextField,
  InputAdornment,
  IconButton
} from '@material-ui/core'
import { Visibility, VisibilityOff }
  from '@material-ui/icons'
import PropTypes from 'prop-types'


function FormikField(props) {
  const [showPassword, setShowPassword] = useState(false)

  return <div className="FormikField">
    <Field
      required={props.required}
      id={props.id}
      as={TextField}
      autoComplete="off"
      label={props.label}
      name={props.name}
      helperText={<ErrorMessage name={props.name} />}
      error={props.error}
      fullWidth={props.fullWidth}
      variant={props.variant}
      multiline={props.multiline}
      disabled={props.disabled}
      rows={props.rows}
      type={props.type === "password" ? (showPassword ? "text" : "password") : props.type}
      InputProps={props.type === "password" ? {
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        ),
      } : {}}
    />
  </div>
}

FormikField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string
}

FormikField.defaultProps = {
  type: 'text',
  required: false
}

export default FormikField
import React from 'react'
import { Field, ErrorMessage } from 'formik'
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import PropTypes from 'prop-types'

const useStyles = makeStyles((theme) => ({
  formControl: {
    //margin: theme.spacing(1),
    minWidth: 182,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

function MaterialUISelectField(props) {
  const classes = useStyles();
  return (
    <FormControl className={classes.formControl} error={props.error}>
      <InputLabel required={props.required}>{props.label}</InputLabel>
      <Select name={props.name} value={props.value} onChange={props.onChange} onBlur={props.onBlur}>
        {props.children}
      </Select>
      <FormHelperText>{props.errorString}</FormHelperText>
    </FormControl >
  )
}

function FormikSelect(props) {
  return (
    <div className="FormikSelect">
      <Field
        name={props.name}
        as={MaterialUISelectField}
        label={props.label}
        errorString={<ErrorMessage name={props.name} />}
        required={props.required}
        error={props.error}
        id={props.id}
        fullWidth={props.fullWidth}
      >
        {
          props.items.map(
            item => <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
          )
        }
      </Field>
    </div>
  )
}

FormikSelect.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  items: PropTypes.array
}

FormikSelect.defaultProps = {
  required: false
}

export default FormikSelect
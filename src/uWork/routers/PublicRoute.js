import React, { useContext, Fragment } from 'react';
import PropTypes from 'prop-types';
import { AuthContext } from '../context/auth'
import { Route, Redirect } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import { auth } from '../services/firebase'


export const PublicRoute = ({
    component: Component,
    ...rest
}) => {

    const currentUser = auth.currentUser;
    const { authReady } = useContext(AuthContext)

    return (
        <Fragment>
            { authReady ?
                <Route {...rest}
                    component={(props) => (
                        (!currentUser)
                            ? (<Component {...props} />)
                            : (<Redirect to="/dashboard" />)
                    )}

                /> : <CircularProgress />}
        </Fragment>
    )
}

PublicRoute.propTypes = {
    component: PropTypes.func.isRequired
}
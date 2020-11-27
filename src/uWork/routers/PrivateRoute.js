import React, { useContext, Fragment } from 'react';
import PropTypes from 'prop-types';
import { AuthContext } from '../context/auth'
import { Route, Redirect } from 'react-router-dom';
import AuthenticationService from '../services/AuthenticationService'
import Layout from '../components/Layout/Layout';

export const PrivateRoute = ({
    component: Component,
    ...rest
}) => {

    const currentUser = AuthenticationService.getCurrentUser()
    const { authReady } = useContext(AuthContext)

    return (
        <Fragment>
            { authReady &&
                <Route {...rest}
                    component={(props) => (
                        (currentUser)
                            ? (<Layout {...rest} ><Component {...props} /></Layout>)
                            : (<Redirect to="/login" />)
                    )}

                />}
        </Fragment>
    )
}

PrivateRoute.propTypes = {
    component: PropTypes.func.isRequired
}
import React, { useContext, Fragment } from 'react';
import PropTypes from 'prop-types';
import { AuthContext } from '../context/auth'
import { Route, Redirect } from 'react-router-dom';
import AuthenticationService from '../services/AuthenticationService'
import LoadingPage from '../components/LoadingPage/LoadingPage';

export const PrivateRoute = ({
    component: Component,
    ...rest
}) => {

    const currentUser = AuthenticationService.getCurrentUser()
    const { authReady } = useContext(AuthContext)

    return (
        <Fragment>
            { authReady ?
                <Route {...rest}
                    component={(props) => (
                        (currentUser)
                            ? (<Component {...props} />)
                            : (<Redirect to="/login" />)
                    )}

                /> : <LoadingPage />}
        </Fragment>
    )
}

PrivateRoute.propTypes = {
    component: PropTypes.func.isRequired
}
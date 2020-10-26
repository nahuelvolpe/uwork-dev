import React, { useContext, Fragment } from 'react';
import PropTypes from 'prop-types';
import { AuthContext } from '../context/auth'
import { Route, Redirect } from 'react-router-dom';
import { auth } from '../services/firebase/setup'
import LoadingPage from '../components/LoadingPage/LoadingPage';


export const PublicRoute = ({
    component: Component,
    ...rest
}) => {

    const currentUser = auth().currentUser;
    const { authReady } = useContext(AuthContext)

    return (
        <Fragment>
            <Route {...rest}
                component={(props) => (
                    (!currentUser)
                        ? (<Component {...props} />)
                        : (<Redirect to="/dashboard" />)
                )}

            />
        </Fragment>
    )
}

PublicRoute.propTypes = {
    component: PropTypes.func.isRequired
}
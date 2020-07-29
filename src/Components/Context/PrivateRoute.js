import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from './auth';

export default function PrivateRoute({ component: Component, ...rest }) {
    const {authTokens} = useAuth();

    return (
        <Route
          {...rest}
          render={props =>
            authTokens==="jackie" ? (
              <Component {...props} /> )
             : (
              <Redirect to="/login" /> )
            
          }
        />
    );
}


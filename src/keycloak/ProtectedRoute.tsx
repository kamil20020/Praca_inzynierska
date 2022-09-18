import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Forbidden from "../pages/error/Forbidden";
import { RootState } from "../redux/store";

type PrivateRouteProps = {
    children: React.ReactNode,
    requiredLogin?: boolean, 
    requiredRole?: string
};

const PrivateRoute = (props: PrivateRouteProps) => {

    const keycloak = useSelector((state: RootState) => state.keycloak);
    const user = useSelector((state: RootState) => state.user)

    if(!props.requiredLogin){
        return <React.Fragment>{props.children}</React.Fragment>
    }

    if(!props.requiredRole){
        const isLoggedIn = keycloak.authenticated
        return isLoggedIn ? <React.Fragment>{props.children}</React.Fragment> : <Forbidden/>
    }

    return user.roles.includes(props.requiredRole, 0) ? <React.Fragment>{props.children}</React.Fragment> : <Forbidden/>
}

export default PrivateRoute;
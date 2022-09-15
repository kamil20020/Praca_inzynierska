import { useKeycloak } from "@react-keycloak/web";

type PrivateRouteProps = {
    children: React.ReactNode;
};

const PrivateRoute = ({ children }: PrivateRouteProps) => {

    const {keycloak} = useKeycloak();
    const isLoggedIn = keycloak.authenticated

    return isLoggedIn ? children : null
}

export default PrivateRoute;
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

type PrivateRouteProps = {
    children: React.ReactNode;
};

const PrivateRoute = ({ children }: PrivateRouteProps) => {

    const keycloak = useSelector((state: RootState) => state.keycloak);
    const isLoggedIn = keycloak.authenticated

    return isLoggedIn ? children : null
}

export default PrivateRoute;
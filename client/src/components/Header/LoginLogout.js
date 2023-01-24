import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";

import { Auth as Server } from "../../api/Server";

const LoginLogout = props => {
    // Destructre props and define useNavigate()
    const { iconHeight, user, setUser } = props;
    let navigate = useNavigate();

    // ICONS + CLICK HANDLERS
    // Login
    const loginClick = async e => {
        e.preventDefault();
        navigate("/login");
    }
    
    const Login = (
        <svg className="iconLogin" width={iconHeight} height={iconHeight} viewBox="0 0 24 24" onClick={loginClick}>
            <path className="pathLogin" style={{ fill:"#ffffff" }} d="M10 9.408l2.963 2.592-2.963 2.592v-1.592h-8v-2h8v-1.592zm-2-4.408v4h-8v6h8v4l8-7-8-7zm6-3c-1.787 0-3.46.474-4.911 1.295l.228.2 1.396 1.221c1.004-.456 2.114-.716 3.287-.716 4.411 0 8 3.589 8 8s-3.589 8-8 8c-1.173 0-2.283-.26-3.288-.715l-1.396 1.221-.228.2c1.452.82 3.125 1.294 4.912 1.294 5.522 0 10-4.477 10-10s-4.478-10-10-10z" />
        </svg>
    )

    // Logout
    let [loggingOut, setLoggingOut] = useState(false);
    const logoutClick = async e => {
        e.preventDefault();
        setLoggingOut(true);

        let response = await Server.logout();
        if (response === "Logout successful") {
            setUser(null);
            navigate("/");
            setLoggingOut(false);
        };
    }

    const Logout = loggingOut ? <Skeleton /> : (
        <svg className="iconLogout" width={iconHeight} height={iconHeight} viewBox="0 0 24 24" onClick={logoutClick}>
            <path className="pathLogout" style={{ fill:"#ffffff" }} d="M14 19v-.083c-1.178.685-2.542 1.083-4 1.083-4.411 0-8-3.589-8-8s3.589-8 8-8c1.458 0 2.822.398 4 1.083v-2.245c-1.226-.536-2.576-.838-4-.838-5.522 0-10 4.477-10 10s4.478 10 10 10c1.424 0 2.774-.302 4-.838v-2.162zm4-9.592l2.963 2.592-2.963 2.592v-1.592h-8v-2h8v-1.592zm-2-4.408v4h-8v6h8v4l8-7-8-7z" />
        </svg>
    )
    
    // Return logout icon if logged in, otherwise return login icon
    return user ? Logout : Login;
}

export default LoginLogout;
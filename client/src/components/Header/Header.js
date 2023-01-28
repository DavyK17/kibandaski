import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import CartHome from "./CartHome";
import Logo from "./Logo";
import LoginLogout from "./LoginLogout";

import { Auth as Server } from "../../api/Server";

const Header = props => {
    // Destructure props
    const { user, setUser, windowWidth, iconHeight } = props;

    // Define useLocation() and useNavigate(0)
    let location = useLocation();
    let navigate = useNavigate();

    // Define primary, secondary and admin paths
    const primary = ["/", "/menu", "/orders"];
    const secondary = ["/login", "/register", "/account", "/cart"];
    const admin = ["/admin/orders", "/admin/products", "/admin/users"];

    // Define function to check whether current path is primary or secondary
    const checkPathFor = type => {
        let current;
        if (type === "primary") current = primary;
        if (type === "secondary") current = secondary;
        if (type === "admin") current = admin;

        current = current.filter(pathname => location.pathname === pathname);
        return current.length > 0 ? true : false;
    }

    // CLICK HANDLERS
    // Cart/Home
    const cartHomeClick = e => {
        e.preventDefault();
        if ((e.target.classList[0] === "iconCart" || e.target.classList[0] === "pathCart") && checkPathFor("primary") && user) navigate("/cart");
        if ((e.target.classList[0] === "iconHome" || e.target.classList[0] === "pathHome") && (checkPathFor("secondary") || checkPathFor("admin"))) navigate("/");
    }

    // Login
    const loginClick = async e => {
        e.preventDefault();
        navigate("/login");
    }

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
        }
    }


    // Return component
    return (
        <header data-testid="header">
            <h1 className="sr-only">Kibandaski</h1>
            <nav>
                <ul>
                    <li>
                        <CartHome user={user} iconHeight={iconHeight} location={location} checkPathFor={checkPathFor} handleClick={cartHomeClick} />
                    </li>
                    <li id="logo">
                        <Logo windowWidth={windowWidth} />
                    </li>
                    <li>
                        <LoginLogout user={user} iconHeight={iconHeight} loggingOut={loggingOut} handleLogin={loginClick} handleLogout={logoutClick} />
                    </li>
                </ul>
            </nav>
        </header>
    )
}

export default Header;
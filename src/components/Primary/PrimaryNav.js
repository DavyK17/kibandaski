import { NavLink, useLocation } from "react-router-dom";
import capitalise from "../../util/capitalise";

const PrimaryNav = props => {
    // Destructure props
    const { user, activeClassName } = props;

    // Define useLocation()
    let location = useLocation();

    // Define function to render menu item
    const renderMenuItem = (name, path = `/${name}`) => {
        const check = isActive => name === "menu" ?
            (isActive || location.pathname.includes("/menu") || location.pathname === "/") :
            (isActive || location.pathname.includes(path));

        return (
            <li>
                <NavLink className={({ isActive }) => check(isActive) ? activeClassName : undefined} to={path} end>{capitalise(name)}</NavLink>
            </li>
        )
    }

    // Return component
    return (
        <nav>
            <ul>
                {renderMenuItem("menu")}
                {user ? renderMenuItem("orders") : null}
                {user && user.role === "admin" ? renderMenuItem("admin", "/admin/orders") : null}
            </ul>
        </nav>
    )
}

export default PrimaryNav;
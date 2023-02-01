import { NavLink, useLocation } from "react-router-dom";
import capitalise from "../../util/capitalise";

const AdminNav = props => {
    // Destructure props
    const { user, activeClassName } = props;

    // Define useLocation()
    let location = useLocation();

    // Define function to render menu item
    const renderMenuItem = (name, path = `/admin/${name}`) => {
        const check = isActive => isActive || location.pathname.includes(path);
   
        return (
            <li>
                <NavLink className={({ isActive }) => check(isActive) ? activeClassName : undefined} to={path}>{capitalise(name)}</NavLink>
            </li>
        )
    }

    // Return component
    return user && user.role === "admin" ? (
        <nav>
            <ul>
                {renderMenuItem("orders")}
                {renderMenuItem("products")}
                {renderMenuItem("users")}
            </ul>
        </nav>
    ) : null
}

export default AdminNav;
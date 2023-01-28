import { NavLink, useLocation } from "react-router-dom";
import capitalise from "../../util/capitalise";

const SecondaryNav = props => {
    // Destructure props
    const { user, activeClassName } = props;

    // Define useLocation()
    let location = useLocation();

    // Define function to render menu item
    const renderMenuItem = (name, path = `/${name}`) => {
        const check = isActive => isActive || location.pathname.includes(path);

        return (
            <li>
                <NavLink className={({ isActive }) => check(isActive) ? activeClassName : undefined} to={path}>{capitalise(name)}</NavLink>
            </li>
        )
    }

    // Return component
    return (
        <nav>
            <ul>
                {user ? null : renderMenuItem("login")}
                {user ? null : renderMenuItem("register")}
                {user ? renderMenuItem("cart") : null}
                {user ? renderMenuItem("account") : null}
            </ul>
        </nav>
    )
}

export default SecondaryNav;
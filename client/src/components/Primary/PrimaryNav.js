import { NavLink, useLocation } from "react-router-dom";
import capitalise from "../../util/capitalise";

const PrimaryNav = props => {
    const { user, activeClassName } = props;
    let location = useLocation();

    const renderMenuItem = name => {
        const check = (isActive) => name === "menu" ? (isActive || location.pathname === "/") : isActive;

        return (
            <li>
                <NavLink className={({ isActive }) => check(isActive) ? activeClassName : undefined} to={`/${name}`} end>{capitalise(name)}</NavLink>
            </li>
        )
    }

    return (
        <nav>
            <ul>
                {renderMenuItem("menu")}
                {renderMenuItem("orders")}
                {user && user.role === "admin" ? renderMenuItem("admin") : null}
            </ul>
        </nav>
    )
}

export default PrimaryNav;
import { NavLink } from "react-router-dom";
import capitalise from "../../util/capitalise";

const PrimaryNav = props => {
    const { user, activeClassName } = props;
    const renderMenuItem = name => {
        return (
            <li>
                <NavLink className={({ isActive }) => isActive ? activeClassName : undefined} to={`/${name}`} end>{capitalise(name)}</NavLink>
            </li>
        )
    }

    return (
        <nav>
            <ul>
                {renderMenuItem("menu")}
                {user ? renderMenuItem("account") : null}
                {user ? (user.role === "admin" ? renderMenuItem("admin") : null) : null}
            </ul>
        </nav>
    )
}

export default PrimaryNav;
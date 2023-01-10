import { NavLink } from "react-router-dom";
import capitalise from "../../util/capitalise";

const SecondaryNav = props => {
    const { user, activeClassName } = props;
    const renderMenuItem = name => {
        return (
            <li>
                <NavLink className={({ isActive }) => isActive ? activeClassName : undefined} to={`/${name}`}>{capitalise(name)}</NavLink>
            </li>
        )
    }

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
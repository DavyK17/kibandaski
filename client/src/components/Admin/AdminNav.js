import { NavLink } from "react-router-dom";
import capitalise from "../../util/capitalise";

const AdminNav = props => {
    // Destructure props
    const { activeClassName } = props;

    // Define function to render menu item
    const renderMenuItem = name => {
        return (
            <li>
                <NavLink className={({ isActive }) => isActive ? activeClassName : undefined} to={`/admin/${name}`}>{capitalise(name)}</NavLink>
            </li>
        )
    }

    // Return component
    return (
        <nav>
            <ul>
                {renderMenuItem("orders")}
                {renderMenuItem("products")}
                {renderMenuItem("users")}
            </ul>
        </nav>
    )
}

export default AdminNav;
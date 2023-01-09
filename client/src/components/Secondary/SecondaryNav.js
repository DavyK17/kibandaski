import capitalise from "../../util/capitalise";

const SecondaryNav = props => {
    const { user, activeClassName, secondaryView, setSecondaryView } = props;

    const handleClick = e => {
        e.preventDefault();
        if (e.target.textContent === "Login") setSecondaryView("login");
        if (e.target.textContent === "Register") setSecondaryView("register");
    }

    const renderMenuItem = name => {
        return (
            <li>
                <span className={name === "cart" ? `${activeClassName} cart` : name === secondaryView ? activeClassName : undefined} onClick={handleClick}>{capitalise(name)}</span>
            </li>
        )
    }

    return (
        <nav>
            <ul>
                {user ? null : renderMenuItem("login")}
                {user ? null : renderMenuItem("register")}
                {user ? renderMenuItem("cart") : null}
            </ul>
        </nav>
    )
}

export default SecondaryNav;
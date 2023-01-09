import CartHome from "./CartHome";
import Logo from "./Logo";
import LoginLogout from "./LoginLogout";

const Header = props => {
    const { user, setUser, view, setView, windowWidth } = props;
    const iconHeight = "30";

    return (
        <header>
            <h1 className="sr-only">Kibandaski</h1>
            <nav>
                <ul>
                    <li>
                        <CartHome iconHeight={iconHeight} user={user} view={view} setView={setView} />
                    </li>
                    <li id="logo">
                        <Logo windowWidth={windowWidth} />
                    </li>
                    <li>
                        <LoginLogout iconHeight={iconHeight} user={user} setUser={setUser} view={view} setView={setView} />
                    </li>
                </ul>
            </nav>
        </header>
    )
}

export default Header;
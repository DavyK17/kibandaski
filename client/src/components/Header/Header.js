import CartHome from "./CartHome";
import Logo from "./Logo";
import LoginLogout from "./LoginLogout";

const Header = props => {
    const { user, setUser, windowWidth, iconHeight } = props;

    return (
        <header>
            <h1 className="sr-only">Kibandaski</h1>
            <nav>
                <ul>
                    <li>
                        <CartHome iconHeight={iconHeight} user={user} />
                    </li>
                    <li id="logo">
                        <Logo windowWidth={windowWidth} />
                    </li>
                    <li>
                        <LoginLogout iconHeight={iconHeight} user={user} setUser={setUser} />
                    </li>
                </ul>
            </nav>
        </header>
    )
}

export default Header;
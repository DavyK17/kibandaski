import { useState } from "react";
import Nav from "./SecondaryNav";
import Auth from "./Auth/Auth";
import Cart from "./Cart/Cart";

const Secondary = props => {
    const { user, setUser, activeClassName } = props;
    const [secondaryView, setSecondaryView] = useState("login");

    return (
        <section className="secondary">
        <h2 className="sr-only">{user ? "Cart" : "Log in or register"}</h2>
            <Nav user={user} activeClassName={activeClassName} secondaryView={secondaryView} setSecondaryView={setSecondaryView} />
            {user ? <Cart /> : <Auth setUser={setUser} secondaryView={secondaryView} />}
        </section>
    )
}

export default Secondary;